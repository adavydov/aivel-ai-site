import { whoEvidence, type WhoEvidence } from "./who-page";

export type WhoClaimStatus = "draft" | "approved" | "expired" | "blocked";

export type WhoImplementationClaim = {
  id: string;
  evidenceId: WhoEvidence["id"];
  kind: "implementation-context";
  wording: string;
  source: string;
  owner: string;
  reviewedAt: string;
  publishPermission: boolean;
  routes: readonly string[];
  status: WhoClaimStatus;
  expiresAt?: string;
};

const whoClaims: readonly WhoImplementationClaim[] = [
  {
    id: "who-golfstrim-implementation",
    evidenceId: "golfstrim",
    kind: "implementation-context",
    wording: "Решение Aivel внедрено в рабочем финансовом контуре компании «Гольфстрим».",
    source: "Материалы Aivel и подтверждение основателя Aivel",
    owner: "Основатель Aivel",
    reviewedAt: "2026-07-21",
    publishPermission: true,
    routes: ["/kto-my"],
    status: "approved",
  },
  {
    id: "who-primary-documents-implementations",
    evidenceId: "primary-documents",
    kind: "implementation-context",
    wording: "Агент Aivel используется в процессах первичных документов «Нефтьмагистрали» и «Братьев Караваевых».",
    source: "Материалы Aivel и подтверждение основателя Aivel",
    owner: "Основатель Aivel",
    reviewedAt: "2026-07-21",
    publishPermission: true,
    routes: ["/kto-my"],
    status: "approved",
  },
  {
    id: "who-ddx-accounting-production",
    evidenceId: "accounting-production",
    kind: "implementation-context",
    wording: "Модель ИИ-агентов и специалистов применяется в бухгалтерском производстве DDX Fitness.",
    source: "Материалы Aivel и подтверждение основателя Aivel",
    owner: "Основатель Aivel",
    reviewedAt: "2026-07-21",
    publishPermission: true,
    routes: ["/kto-my"],
    status: "approved",
  },
] as const;

function isCurrent(claim: WhoImplementationClaim, at: Date) {
  if (!claim.expiresAt) return true;
  return new Date(`${claim.expiresAt}T23:59:59Z`).getTime() >= at.getTime();
}

function hasRequiredContext(evidence: WhoEvidence | undefined) {
  return Boolean(
    evidence &&
      evidence.logos.length > 0 &&
      evidence.process &&
      evidence.statement &&
      evidence.perimeter &&
      evidence.accountableRole &&
      evidence.href,
  );
}

export function getPublishedWhoEvidence(route = "/kto-my", at = new Date()) {
  return whoClaims.flatMap((claim) => {
    if (
      claim.status !== "approved" ||
      !claim.publishPermission ||
      !claim.routes.includes(route) ||
      !isCurrent(claim, at)
    ) {
      return [];
    }

    const evidence = whoEvidence.find((item) => item.id === claim.evidenceId);
    return hasRequiredContext(evidence) && evidence ? [evidence] : [];
  });
}
