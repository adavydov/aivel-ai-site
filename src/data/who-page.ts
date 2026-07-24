export type TeamRole = {
  id: "agents" | "experts" | "engineers";
  number: string;
  title: string;
  does: string;
  boundary: string;
};

export type ResponsibilityModel = {
  id: "business" | "enterprise" | "partner";
  number: string;
  title: string;
  aivel: string;
  counterpartLabel: string;
  counterpart: string;
  ai: string;
  href: string;
  linkLabel: string;
  analyticsEvent?: "who_platform_link_click";
};

export type EvidenceLogo = {
  name: string;
  src: string;
  width: number;
  height: number;
};

export type WhoEvidence = {
  id: string;
  number: string;
  logos: readonly EvidenceLogo[];
  process: string;
  statement: string;
  perimeter: string;
  accountableRole: string;
  href: string;
  linkLabel: string;
};

export type WhoRoute = {
  id: "business" | "enterprise" | "partner";
  number: string;
  audience: string;
  outcome: string;
  href: string;
  linkLabel: string;
  secondary?: {
    href: string;
    label: string;
  };
};

export const teamRoles: readonly TeamRole[] = [
  {
    id: "agents",
    number: "01",
    title: "ИИ-агенты",
    does: "Получают данные, сверяют их, проверяют правила и выполняют типовые операции.",
    boundary: "Не принимают решения за пределами заданной роли.",
  },
  {
    id: "experts",
    number: "02",
    title: "Бухгалтеры и финансисты",
    does: "Разбирают исключения, применяют профессиональное суждение и объясняют результат клиенту.",
    boundary: "Не тратят основное время на повторяемый перенос данных.",
  },
  {
    id: "engineers",
    number: "03",
    title: "Инженеры",
    does: "Подключают источники, задают права и контрольные правила, обеспечивают устойчивость и безопасность.",
    boundary: "Не подменяют профессиональное решение техническим допущением.",
  },
] as const;

export const responsibilityModels: readonly ResponsibilityModel[] = [
  {
    id: "business",
    number: "01",
    title: "Бухгалтерское обслуживание",
    aivel: "Aivel отвечает за согласованный контур обслуживания и качество предусмотренных договором работ.",
    counterpartLabel: "Клиент",
    counterpart: "Клиент предоставляет исходные данные и принимает решения, которые остаются за ним.",
    ai: "ИИ выполняет типовое, специалист Aivel разбирает исключения.",
    href: "/#uchet",
    linkLabel: "Посмотреть решение для бизнеса",
  },
  {
    id: "enterprise",
    number: "02",
    title: "Корпоративное внедрение",
    aivel: "Aivel отвечает за работу решения в согласованных технических и процессных границах.",
    counterpartLabel: "Заказчик",
    counterpart: "Назначенные роли заказчика сохраняют предусмотренные утверждения и профессиональные решения.",
    ai: "ИИ действует в заданной роли и передаёт исключения человеку; права и порядок контроля фиксируются до запуска.",
    href: "/dlya-korporatsiy/platforma",
    linkLabel: "Посмотреть платформу управления ИИ",
    analyticsEvent: "who_platform_link_click",
  },
  {
    id: "partner",
    number: "03",
    title: "Партнёрство с бухгалтерской компанией",
    aivel: "Aivel отвечает за технологию и производственную систему в согласованном объёме.",
    counterpartLabel: "Партнёр",
    counterpart: "Партнёр отвечает за отношения с клиентами, сервис и рост.",
    ai: "Решения сторон и совместные решения закрепляются корпоративным договором.",
    href: "/partneram",
    linkLabel: "Посмотреть модель партнёрства",
  },
] as const;

export const whoEvidence: readonly WhoEvidence[] = [
  {
    id: "golfstrim",
    number: "01",
    logos: [
      { name: "Гольфстрим", src: assetPath("/brands/golfstrim-official.svg"), width: 278, height: 48 },
    ],
    process: "Финансовый контур",
    statement: "Решение Aivel внедрено в рабочем контуре компании.",
    perimeter: "Согласованный финансовый периметр заказчика",
    accountableRole: "Команда финансовой методологии и внедрения Aivel",
    href: "/#vazhnoe",
    linkLabel: "Посмотреть результат для руководителя",
  },
  {
    id: "primary-documents",
    number: "02",
    logos: [
      { name: "Нефтьмагистраль", src: assetPath("/brands/neftmagistral.png"), width: 480, height: 138 },
      { name: "Братья Караваевы", src: assetPath("/brands/karavaevi-wordmark.svg"), width: 132, height: 37 },
    ],
    process: "Первичные документы",
    statement: "ИИ-агент включён в рабочий процесс обработки первичных документов.",
    perimeter: "Получение, проверка и передача документов в учётный контур",
    accountableRole: "Команда внедрения и бухгалтерской методологии Aivel",
    href: "/dlya-korporatsiy/pervichnye-dokumenty",
    linkLabel: "Посмотреть агента по первичным документам",
  },
  {
    id: "accounting-production",
    number: "03",
    logos: [
      { name: "DDX Fitness", src: assetPath("/brands/ddx.png"), width: 482, height: 140 },
    ],
    process: "Бухгалтерское производство",
    statement: "ИИ-агенты и специалисты на исключениях работают в одном производственном контуре.",
    perimeter: "Бухгалтерское обслуживание действующего бизнеса",
    accountableRole: "Руководитель бухгалтерского производства Aivel",
    href: "/#uchet",
    linkLabel: "Посмотреть, как устроен надёжный учёт",
  },
] as const;

export const whoRoutes: readonly WhoRoute[] = [
  {
    id: "business",
    number: "01",
    audience: "Для бизнеса",
    outcome: "Передать учёт и вовремя видеть важные изменения.",
    href: "/#uchet",
    linkLabel: "Посмотреть решение для бизнеса",
    secondary: {
      href: "/#demo",
      label: "Записаться на демонстрацию",
    },
  },
  {
    id: "enterprise",
    number: "02",
    audience: "Для крупной компании",
    outcome: "Разобрать один процесс от исходных данных до результата.",
    href: "/dlya-korporatsiy",
    linkLabel: "Выбрать процесс для разбора",
  },
  {
    id: "partner",
    number: "03",
    audience: "Для собственника бухгалтерской компании",
    outcome: "Понять модель партнёрства и будущую роль собственника.",
    href: "/partneram",
    linkLabel: "Посмотреть модель партнёрства",
  },
] as const;
import { assetPath } from "@/lib/site-paths";
