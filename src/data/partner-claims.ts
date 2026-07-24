export type PartnerClaimStatus = "draft" | "approved" | "expired" | "blocked";

export type PartnerClaimKind =
  | "deal-term"
  | "operating-model"
  | "implementation-proof"
  | "partner-profile"
  | "scale";

export type PartnerClaim = {
  id: string;
  kind: PartnerClaimKind;
  wording: string;
  source: string;
  owner: string;
  reviewedAt: string;
  publishPermission: boolean;
  routes: readonly string[];
  status: PartnerClaimStatus;
  expiresAt?: string;
  proofPassport?: {
    period: string;
    baseline: string;
    outcome: string;
    teamSize: string;
    processes: readonly string[];
    sourceUrl: string;
  };
  partnerProfile?: {
    geography: string;
    specialization: string;
    networkValue: string;
  };
  scaleMetric?: {
    value: string;
    definition: string;
  };
};

const partnerClaims: readonly PartnerClaim[] = [
  {
    id: "partner-acquisition-threshold",
    kind: "deal-term",
    wording: "Aivel приобретает долю от 51% в бухгалтерской компании.",
    source: "Условия партнёрской модели, подтверждённые основателем Aivel",
    owner: "Основатель Aivel",
    reviewedAt: "2026-07-20",
    publishPermission: true,
    routes: ["/partneram"],
    status: "approved",
  },
  {
    id: "partner-category-boundary",
    kind: "deal-term",
    wording: "Контрольная доля от 51% · не франшиза · не продажа программы.",
    source: "Условия партнёрской модели, подтверждённые основателем Aivel",
    owner: "Основатель Aivel",
    reviewedAt: "2026-07-20",
    publishPermission: true,
    routes: ["/partneram"],
    status: "approved",
  },
  {
    id: "partner-control-boundary",
    kind: "deal-term",
    wording:
      "При продаже контрольной доли собственник не сохраняет единоличный контроль. До сделки корпоративный договор фиксирует права собственника, обязанности Aivel и решения, которые стороны принимают только вместе.",
    source: "Условия партнёрской модели, подтверждённые основателем Aivel",
    owner: "Основатель Aivel",
    reviewedAt: "2026-07-20",
    publishPermission: true,
    routes: ["/partneram"],
    status: "approved",
  },
  {
    id: "partner-ownership-options",
    kind: "deal-term",
    wording:
      "Возможны покупка 100% компании с согласованным выходом собственника или покупка 51% с поэтапным увеличением доли до 100% по заранее согласованным условиям.",
    source: "Условия партнёрской модели, подтверждённые основателем Aivel",
    owner: "Основатель Aivel",
    reviewedAt: "2026-07-20",
    publishPermission: true,
    routes: ["/partneram"],
    status: "approved",
  },
  {
    id: "partner-ddx-proof",
    kind: "implementation-proof",
    wording: "Кейс ДДХ о росте без увеличения бухгалтерской функции.",
    source: "Партнёрские материалы Aivel; паспорт измерения не завершён",
    owner: "Партнёрское направление Aivel",
    reviewedAt: "2026-07-20",
    publishPermission: false,
    routes: ["/partneram"],
    status: "draft",
  },
  {
    id: "partner-current-profile-placeholder",
    kind: "partner-profile",
    wording: "Актуальные регионы и специализации для поиска партнёров.",
    source: "Требуется утверждённый список приоритетов с датой",
    owner: "Партнёрское направление Aivel",
    reviewedAt: "2026-07-20",
    publishPermission: false,
    routes: ["/partneram"],
    status: "draft",
  },
  {
    id: "partner-scale-placeholder",
    kind: "scale",
    wording: "Показатели масштаба сети Aivel.",
    source: "Требуются единые определения, дата и подтверждение состава сети",
    owner: "Финансовая функция Aivel",
    reviewedAt: "2026-07-20",
    publishPermission: false,
    routes: ["/partneram"],
    status: "draft",
  },
];

function isCurrent(claim: PartnerClaim, at: Date) {
  if (!claim.expiresAt) return true;
  return new Date(`${claim.expiresAt}T23:59:59Z`).getTime() >= at.getTime();
}

function hasRequiredEvidence(claim: PartnerClaim) {
  if (claim.kind === "implementation-proof") {
    const passport = claim.proofPassport;
    return Boolean(
      passport?.period &&
        passport.baseline &&
        passport.outcome &&
        passport.teamSize &&
        passport.processes.length > 0 &&
        passport.sourceUrl,
    );
  }
  if (claim.kind === "partner-profile") {
    return Boolean(
      claim.partnerProfile?.geography &&
        claim.partnerProfile.specialization &&
        claim.partnerProfile.networkValue,
    );
  }
  if (claim.kind === "scale") {
    return Boolean(claim.scaleMetric?.value && claim.scaleMetric.definition);
  }
  return true;
}

export function getPublishedPartnerClaims(
  kind?: PartnerClaimKind,
  route = "/partneram",
  at = new Date(),
) {
  return partnerClaims.filter(
    (claim) =>
      claim.status === "approved" &&
      claim.publishPermission &&
      claim.routes.includes(route) &&
      isCurrent(claim, at) &&
      hasRequiredEvidence(claim) &&
      (!kind || claim.kind === kind),
  );
}

export function getPublishedPartnerClaim(id: string, route = "/partneram") {
  return getPublishedPartnerClaims(undefined, route).find((claim) => claim.id === id);
}
