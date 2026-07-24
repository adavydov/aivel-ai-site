"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { partnerScaleOptions, partnerScenarioOptions } from "@/data/partner-program";
import {
  createPartnerInquiryMailto,
  validatePartnerInquiry,
  type PartnerInquiryField,
} from "@/lib/partner-inquiry";

type FormState = {
  kind: "idle" | "pending" | "ready" | "success" | "error";
  message: string;
  mailtoHref?: string;
  errors: Partial<Record<PartnerInquiryField, string>>;
};

const initialState: FormState = { kind: "idle", message: "", errors: {} };
const staticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";

function makeRequestId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function FieldError({ field, state }: { field: PartnerInquiryField; state: FormState }) {
  const message = state.errors[field];
  return (
    <p className="partner-field-error" id={`partner-${field}-error`} aria-live="polite">
      {message ?? ""}
    </p>
  );
}

export function PartnerInquiryForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const requestIdRef = useRef(makeRequestId());
  const [state, setState] = useState<FormState>(initialState);

  useEffect(() => {
    const focusFormHeading = () => {
      if (window.location.hash !== "#partner-form") return;
      window.requestAnimationFrame(() => document.getElementById("partner-form")?.focus());
    };
    focusFormHeading();
    window.addEventListener("hashchange", focusFormHeading);
    return () => window.removeEventListener("hashchange", focusFormHeading);
  }, []);

  const clearError = (field: PartnerInquiryField) => {
    setState((current) => ({
      ...current,
      kind: current.kind === "success" ? "success" : "idle",
      message: current.kind === "success" ? current.message : "",
      errors: { ...current.errors, [field]: undefined },
    }));
  };

  const focusFirstError = (errors: Partial<Record<PartnerInquiryField, string>>) => {
    const firstField = Object.keys(errors)[0] as PartnerInquiryField | undefined;
    if (!firstField) return;
    formRef.current?.querySelector<HTMLElement>(`[name="${firstField}"]`)?.focus();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state.kind === "pending") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const raw = {
      name: data.get("name"),
      contact: data.get("contact"),
      company: data.get("company"),
      region: data.get("region"),
      scale: data.get("scale"),
      scenario: data.get("scenario"),
      specialization: data.get("specialization"),
      comment: data.get("comment"),
      consent: data.get("consent"),
      website: data.get("website"),
      requestId: requestIdRef.current,
    };
    const clientValidation = validatePartnerInquiry(raw);

    if (!clientValidation.success) {
      setState({
        kind: "error",
        message: clientValidation.message,
        errors: clientValidation.errors,
      });
      window.requestAnimationFrame(() => focusFirstError(clientValidation.errors));
      return;
    }

    setState({ kind: "pending", message: "Проверяем обращение…", errors: {} });

    if (staticExport) {
      setState({
        kind: "ready",
        message: "Черновик обращения готов. Откройте письмо и отправьте его из своей почтовой программы.",
        mailtoHref: createPartnerInquiryMailto(clientValidation.data),
        errors: {},
      });
      return;
    }

    try {
      const response = await fetch("/api/partner-inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(raw),
      });
      const result = (await response.json()) as {
        status?: "received" | "mailto";
        message?: string;
        mailtoHref?: string;
        errors?: Partial<Record<PartnerInquiryField, string>>;
      };

      if (!response.ok) {
        const errors = result.errors ?? {};
        setState({
          kind: "error",
          message: result.message ?? "Не удалось передать обращение. Попробуйте ещё раз.",
          mailtoHref: result.mailtoHref,
          errors,
        });
        window.requestAnimationFrame(() => focusFirstError(errors));
        return;
      }

      if (result.status === "received") {
        setState({
          kind: "success",
          message:
            result.message ??
            "Анкета получена. Следующий шаг — короткое знакомство; закрытые данные на этом этапе не нужны.",
          errors: {},
        });
        requestIdRef.current = makeRequestId();
        return;
      }

      setState({
        kind: "ready",
        message:
          result.message ??
          "Черновик обращения готов. Откройте письмо и отправьте его из своей почтовой программы.",
        mailtoHref: result.mailtoHref ?? createPartnerInquiryMailto(clientValidation.data),
        errors: {},
      });
    } catch {
      setState({
        kind: "error",
        message: "Связь прервалась. Данные остались в форме; можно отправить подготовленное письмо.",
        mailtoHref: createPartnerInquiryMailto(clientValidation.data),
        errors: {},
      });
    }
  };

  return (
    <form
      ref={formRef}
      className="partner-form"
      action="mailto:hello@aivel.ai?subject=Партнёрство%20с%20Aivel"
      method="post"
      encType="text/plain"
      onSubmit={handleSubmit}
    >
      <div className="partner-form-grid">
        <div className="partner-field">
          <label htmlFor="partner-name">Имя <span aria-hidden="true">*</span></label>
          <input
            id="partner-name"
            name="name"
            autoComplete="name"
            aria-describedby="partner-name-error"
            aria-invalid={Boolean(state.errors.name)}
            onInput={() => clearError("name")}
            required
          />
          <FieldError field="name" state={state} />
        </div>

        <div className="partner-field">
          <label htmlFor="partner-contact">Рабочий телефон или почта <span aria-hidden="true">*</span></label>
          <input
            id="partner-contact"
            name="contact"
            autoComplete="off"
            placeholder="+7 900 000-00-00 или name@company.ru"
            aria-describedby="partner-contact-help partner-contact-error"
            aria-invalid={Boolean(state.errors.contact)}
            onInput={() => clearError("contact")}
            required
          />
          <p className="partner-field-help" id="partner-contact-help">Достаточно одного способа связи.</p>
          <FieldError field="contact" state={state} />
        </div>

        <div className="partner-field">
          <label htmlFor="partner-company">Компания или сайт <span aria-hidden="true">*</span></label>
          <input
            id="partner-company"
            name="company"
            autoComplete="organization"
            aria-describedby="partner-company-error"
            aria-invalid={Boolean(state.errors.company)}
            onInput={() => clearError("company")}
            required
          />
          <FieldError field="company" state={state} />
        </div>

        <div className="partner-field">
          <label htmlFor="partner-region">Регион <span aria-hidden="true">*</span></label>
          <input
            id="partner-region"
            name="region"
            autoComplete="address-level1"
            aria-describedby="partner-region-error"
            aria-invalid={Boolean(state.errors.region)}
            onInput={() => clearError("region")}
            required
          />
          <FieldError field="region" state={state} />
        </div>

        <div className="partner-field">
          <label htmlFor="partner-scale">Примерный масштаб <span aria-hidden="true">*</span></label>
          <select
            id="partner-scale"
            name="scale"
            defaultValue=""
            aria-describedby="partner-scale-help partner-scale-error"
            aria-invalid={Boolean(state.errors.scale)}
            onChange={() => clearError("scale")}
            required
          >
            <option value="" disabled>Выберите диапазон</option>
            <optgroup label="По количеству клиентов">
              {partnerScaleOptions.slice(0, 4).map((option) => (
                <option value={option.value} key={option.value}>{option.label}</option>
              ))}
            </optgroup>
            <optgroup label="По годовой выручке">
              {partnerScaleOptions.slice(4, 8).map((option) => (
                <option value={option.value} key={option.value}>{option.label}</option>
              ))}
            </optgroup>
            <option value={partnerScaleOptions[8].value}>{partnerScaleOptions[8].label}</option>
          </select>
          <p className="partner-field-help" id="partner-scale-help">Можно ориентироваться на клиентов или выручку.</p>
          <FieldError field="scale" state={state} />
        </div>

        <div className="partner-field">
          <label htmlFor="partner-scenario">Сценарий собственника <span aria-hidden="true">*</span></label>
          <select
            id="partner-scenario"
            name="scenario"
            defaultValue=""
            aria-describedby="partner-scenario-error"
            aria-invalid={Boolean(state.errors.scenario)}
            onChange={() => clearError("scenario")}
            required
          >
            <option value="" disabled>Выберите ближайший вариант</option>
            {partnerScenarioOptions.map((option) => (
              <option value={option.value} key={option.value}>{option.label}</option>
            ))}
          </select>
          <FieldError field="scenario" state={state} />
        </div>

        <div className="partner-field partner-field-wide">
          <label htmlFor="partner-specialization">Сильная специализация</label>
          <input
            id="partner-specialization"
            name="specialization"
            placeholder="Например: медицина, строительство, зарплата и кадры"
            maxLength={180}
          />
        </div>

        <div className="partner-field partner-field-wide">
          <label htmlFor="partner-comment">Что важно обсудить</label>
          <textarea
            id="partner-comment"
            name="comment"
            rows={4}
            maxLength={700}
            aria-describedby="partner-comment-help"
          />
          <p className="partner-field-help" id="partner-comment-help">
            Не указывайте клиентские списки, отчётность, банковские сведения и другие закрытые данные.
          </p>
        </div>
      </div>

      <div className="partner-honeypot" aria-hidden="true">
        <label htmlFor="partner-website">Оставьте поле пустым</label>
        <input id="partner-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <label className="partner-consent" htmlFor="partner-consent">
        <input
          id="partner-consent"
          name="consent"
          type="checkbox"
          aria-describedby="partner-consent-copy partner-consent-error"
          aria-invalid={Boolean(state.errors.consent)}
          onChange={() => clearError("consent")}
          required
        />
        <span id="partner-consent-copy">
          Согласен передать эти данные Aivel для ответа на обращение. Если приём заявок ещё не подключён,
          сайт подготовит письмо, а отправку подтвержу я сам.
        </span>
      </label>
      <FieldError field="consent" state={state} />

      <div className="partner-form-actions">
        <button className="button primary partner-submit" type="submit" disabled={state.kind === "pending"}>
          {state.kind === "pending" ? "Проверяем…" : "Рассказать о компании"}
        </button>
        <p>На первом шаге не нужны точная выручка, отчётность или список клиентов.</p>
      </div>

      <div
        className={`partner-form-status${state.kind !== "idle" ? ` is-${state.kind}` : ""}`}
        role={state.kind === "error" ? "alert" : "status"}
        aria-live="polite"
      >
        {state.message && <span>{state.message}</span>}
        {state.mailtoHref && (
          <a href={state.mailtoHref}>Открыть подготовленное письмо →</a>
        )}
      </div>
    </form>
  );
}
