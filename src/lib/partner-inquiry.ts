import { partnerScaleOptions, partnerScenarioOptions } from "@/data/partner-program";

export type PartnerInquiryField =
  | "name"
  | "contact"
  | "company"
  | "region"
  | "scale"
  | "scenario"
  | "specialization"
  | "comment"
  | "consent";

export type PartnerInquiry = {
  name: string;
  contact: string;
  company: string;
  region: string;
  scale: string;
  scenario: string;
  specialization: string;
  comment: string;
  consent: true;
};

export type PartnerInquiryValidation =
  | { success: true; data: PartnerInquiry; requestId: string; isBot: boolean }
  | {
      success: false;
      errors: Partial<Record<PartnerInquiryField, string>>;
      message: string;
    };

const scaleValues = new Set<string>(partnerScaleOptions.map((option) => option.value));
const scenarioValues = new Set<string>(partnerScenarioOptions.map((option) => option.value));

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function withoutControlCharacters(value: string) {
  return Array.from(value)
    .filter((character) => {
      const code = character.charCodeAt(0);
      return character === "\n" || character === "\t" || code >= 32;
    })
    .join("");
}

function cleanText(value: unknown, maximumLength: number) {
  if (typeof value !== "string") return "";
  return withoutControlCharacters(value).trim().slice(0, maximumLength);
}

function contactLooksValid(value: string) {
  const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const digits = value.replace(/\D/g, "");
  const phoneLooksValid = /^\+?[0-9\s()\-]+$/.test(value) && digits.length >= 10 && digits.length <= 15;
  return emailLooksValid || phoneLooksValid;
}

export function validatePartnerInquiry(value: unknown): PartnerInquiryValidation {
  const input = asRecord(value);
  if (!input) {
    return { success: false, errors: {}, message: "Не удалось прочитать данные формы." };
  }

  const name = cleanText(input.name, 100);
  const contact = cleanText(input.contact, 160);
  const company = cleanText(input.company, 180);
  const region = cleanText(input.region, 120);
  const scale = cleanText(input.scale, 60);
  const scenario = cleanText(input.scenario, 60);
  const specialization = cleanText(input.specialization, 180);
  const comment = cleanText(input.comment, 700);
  const requestId = cleanText(input.requestId, 100);
  const consent = input.consent === true || input.consent === "true" || input.consent === "on";
  const isBot = cleanText(input.website, 120).length > 0;
  const errors: Partial<Record<PartnerInquiryField, string>> = {};

  if (name.length < 2) errors.name = "Укажите имя.";
  if (!contact) {
    errors.contact = "Укажите рабочий телефон или электронную почту.";
  } else if (!contactLooksValid(contact)) {
    errors.contact = "Проверьте телефон или адрес электронной почты.";
  }
  if (company.length < 2) errors.company = "Укажите название компании или сайт.";
  if (region.length < 2) errors.region = "Укажите регион работы компании.";
  if (!scaleValues.has(scale)) errors.scale = "Выберите примерный масштаб компании.";
  if (!scenarioValues.has(scenario)) errors.scenario = "Выберите предполагаемый сценарий.";
  if (!consent) errors.consent = "Подтвердите согласие на передачу данных для ответа.";
  if (!requestId) errors.comment = errors.comment ?? "Обновите страницу и повторите отправку.";

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors,
      message: "Проверьте отмеченные поля. Введённые данные сохранены.",
    };
  }

  return {
    success: true,
    requestId,
    isBot,
    data: {
      name,
      contact,
      company,
      region,
      scale,
      scenario,
      specialization,
      comment,
      consent: true,
    },
  };
}

function optionLabel(options: readonly { value: string; label: string }[], value: string) {
  return options.find((option) => option.value === value)?.label ?? value;
}

export function createPartnerInquiryMailto(inquiry: PartnerInquiry) {
  const lines = [
    "Здравствуйте!",
    "",
    "Хочу обсудить партнёрство с Aivel.",
    "",
    `Имя: ${inquiry.name}`,
    `Телефон или почта: ${inquiry.contact}`,
    `Компания или сайт: ${inquiry.company}`,
    `Регион: ${inquiry.region}`,
    `Примерный масштаб: ${optionLabel(partnerScaleOptions, inquiry.scale)}`,
    `Сценарий собственника: ${optionLabel(partnerScenarioOptions, inquiry.scenario)}`,
  ];

  if (inquiry.specialization) lines.push(`Специализация: ${inquiry.specialization}`);
  if (inquiry.comment) lines.push(`Комментарий: ${inquiry.comment}`);
  lines.push("", "Источник: aivel.ai/partneram");

  const subject = "Партнёрство с бухгалтерской компанией — обращение с сайта Aivel";
  return `mailto:hello@aivel.ai?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
}
