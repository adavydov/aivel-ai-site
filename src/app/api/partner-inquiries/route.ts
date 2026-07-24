import { createHash } from "node:crypto";
import {
  createPartnerInquiryMailto,
  validatePartnerInquiry,
  type PartnerInquiry,
} from "@/lib/partner-inquiry";

type RateLimitEntry = { count: number; resetsAt: number };
type CachedResponse = { expiresAt: number; body: Record<string, unknown>; status: number };

const rateLimits = new Map<string, RateLimitEntry>();
const processedRequests = new Map<string, CachedResponse>();
const rateLimitWindow = 15 * 60 * 1000;
const responseCacheWindow = 30 * 60 * 1000;

function json(body: Record<string, unknown>, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function cleanExpiredEntries(now: number) {
  for (const [key, entry] of rateLimits) {
    if (entry.resetsAt <= now) rateLimits.delete(key);
  }
  for (const [key, entry] of processedRequests) {
    if (entry.expiresAt <= now) processedRequests.delete(key);
  }
}

function clientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const address = forwarded || request.headers.get("x-real-ip") || "local";
  return createHash("sha256").update(address).digest("hex");
}

function isRateLimited(request: Request, now: number) {
  const key = clientKey(request);
  const current = rateLimits.get(key);
  if (!current || current.resetsAt <= now) {
    rateLimits.set(key, { count: 1, resetsAt: now + rateLimitWindow });
    return false;
  }
  current.count += 1;
  return current.count > 5;
}

async function forwardInquiry(requestId: string, inquiry: PartnerInquiry) {
  const endpoint = process.env.PARTNER_INQUIRY_WEBHOOK_URL;
  if (!endpoint) return { configured: false as const };

  let target: URL;
  try {
    target = new URL(endpoint);
  } catch {
    return { configured: true as const, delivered: false as const };
  }
  if (target.protocol !== "https:") {
    return { configured: true as const, delivered: false as const };
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Idempotency-Key": requestId,
  };
  const token = process.env.PARTNER_INQUIRY_WEBHOOK_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const response = await fetch(target, {
      method: "POST",
      headers,
      body: JSON.stringify({
        requestId,
        source: "/partneram",
        receivedAt: new Date().toISOString(),
        inquiry,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });
    return { configured: true as const, delivered: response.ok };
  } catch {
    return { configured: true as const, delivered: false as const };
  }
}

export async function POST(request: Request) {
  const now = Date.now();
  cleanExpiredEntries(now);

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > 32_000) {
    return json({ message: "Объём обращения слишком большой." }, 413);
  }
  if (isRateLimited(request, now)) {
    return json(
      { message: "Слишком много попыток. Данные сохранены — попробуйте отправить обращение позже." },
      429,
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json({ message: "Не удалось прочитать данные формы." }, 400);
  }

  const validated = validatePartnerInquiry(raw);
  if (!validated.success) {
    return json({ message: validated.message, errors: validated.errors }, 400);
  }

  if (validated.isBot) {
    return json({ status: "received" });
  }

  const cached = processedRequests.get(validated.requestId);
  if (cached && cached.expiresAt > now) return json(cached.body, cached.status);

  const mailtoHref = createPartnerInquiryMailto(validated.data);
  const forwarded = await forwardInquiry(validated.requestId, validated.data);

  if (!forwarded.configured) {
    const body = {
      status: "mailto",
      mailtoHref,
      message:
        "Черновик обращения готов. Откройте письмо и отправьте его из своей почтовой программы.",
    };
    processedRequests.set(validated.requestId, {
      body,
      status: 200,
      expiresAt: now + responseCacheWindow,
    });
    return json(body);
  }

  if (!forwarded.delivered) {
    return json(
      {
        message: "Не удалось передать обращение. Данные сохранены в форме; можно отправить письмо.",
        mailtoHref,
      },
      503,
    );
  }

  const body = {
    status: "received",
    message:
      "Анкета получена. Следующий шаг — короткое знакомство; закрытые данные на этом этапе не нужны.",
  };
  processedRequests.set(validated.requestId, {
    body,
    status: 200,
    expiresAt: now + responseCacheWindow,
  });
  return json(body);
}
