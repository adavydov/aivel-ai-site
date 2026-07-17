# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Aivel 2.0
**Updated:** 2026-07-17
**Category:** B2B AI Accounting
**Design Dials:** Variance 2/10 (Editorial / Minimal) | Motion 1/10 (Functional) | Density 2/10 (Spacious)

---

## Global Rules

### Color Palette

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Primary | `#090B10` | `--color-primary` |
| On Primary | `#FFFFFF` | `--color-on-primary` |
| Secondary text | `rgba(9, 11, 16, 0.64)` | `--color-secondary` |
| Accent/CTA | `#155EEF` | `--color-accent` |
| Background | `#FFFFFF` | `--color-background` |
| Foreground | `#090B10` | `--color-foreground` |
| Muted surface | `rgba(21, 94, 239, 0.04)` | `--color-muted` |
| Border | `rgba(9, 11, 16, 0.12)` | `--color-border` |
| Ring | `#155EEF` | `--color-ring` |

**Color Notes:** Вся поверхность белая. Интерфейс использует только чёрный и синий: чёрный для содержания, синий для действия и текущего состояния. Приглушённые поверхности и линии получают только прозрачность этих двух цветов.

### Typography

- **Heading Font:** system-ui
- **Body Font:** system-ui
- **Mood:** editorial, trustworthy, readable, calm
- **External fonts:** none; use the local system stack for speed and privacy.

**CSS Import:**
```css
font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
```

### Spacing Variables

*Density: 2/10 — Spacious*

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` / `0.25rem` | Tight gaps |
| `--space-sm` | `8px` / `0.5rem` | Icon gaps, inline spacing |
| `--space-md` | `24px` / `1.5rem` | Standard padding |
| `--space-lg` | `32px` / `2rem` | Section padding |
| `--space-xl` | `48px` / `3rem` | Large gaps |
| `--space-2xl` | `64px` / `4rem` | Section margins |
| `--space-3xl` | `96px` / `6rem` | Hero padding |

### Shadow Depths

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Cards, buttons |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals, dropdowns |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | Hero images, featured cards |

---

## Component Specs

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: #155EEF;
  color: white;
  min-height: 48px;
  padding: 12px 20px;
  border-radius: 10px;
  font-weight: 700;
  transition: background-color 160ms ease, border-color 160ms ease;
  cursor: pointer;
}

.btn-primary:hover {
  background: #0F46BD;
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: #090B10;
  border: 1px solid rgba(9, 11, 16, 0.2);
  min-height: 48px;
  padding: 12px 20px;
  border-radius: 10px;
  font-weight: 700;
  transition: border-color 160ms ease;
  cursor: pointer;
}
```

### Cards

```css
.card {
  background: #FFFFFF;
  border-radius: 14px;
  padding: 24px;
  border: 1px solid rgba(9, 11, 16, 0.12);
  transition: border-color 160ms ease;
  cursor: pointer;
}

.card:hover {
  border-color: #155EEF;
}
```

### Inputs

```css
.input {
  padding: 12px 16px;
  border: 1px solid rgba(9, 11, 16, 0.2);
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 200ms ease;
}

.input:focus {
  border-color: #155EEF;
  outline: none;
  box-shadow: 0 0 0 3px rgba(21, 94, 239, 0.22);
}
```

### Modals

```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 90%;
}
```

---

## Style Guidelines

**Style:** Editorial Minimalism

**Keywords:** Clear hierarchy, narrow reading measure, high contrast, generous whitespace, restrained blue accent

**Best For:** A complex B2B product that must become understandable in one reading pass

**Key Effects:** 60px desktop / 48px mobile hero, 720px editorial column, natural-height sections, one blue semantic accent

### Page Pattern

**Pattern Name:** Editorial Single Column with Proof Breakouts

- **Conversion Strategy:** One claim per screen, one primary action, concrete proof directly after the claim.
- **Reading measure:** 720px for hero and narrative; up to 960px only for diagrams, cases and comparison grids.
- **Vertical rhythm:** first content begins 88–112px from the top; later sections follow after 64–80px. Do not stretch sections to the viewport.
- **Typography:** hero 60/62 desktop and 48/50 mobile, weight 650; section title up to 48px; body 16–19px.
- **CTA Placement:** left-aligned with the reading column; secondary action is a text link.
- **Homepage rule:** the first screen has one action leading to the interactive example; contact conversion follows after the product value is understood.
- **Cases rule:** customer outcomes are scanned in a single three-card grid, not stretched into separate viewport-height stories.

### Navigation

- На широком экране — фиксированная левая полоса шириной 100 пикселей.
- Знак расположен сверху, меню начинается через 24 пикселя под ним, а не центрируется по высоте окна.
- Четыре направления: «Увидеть важное», «Наладить учёт», «Кейсы», «Стать партнёром».
- Каждый пункт содержит контурную SVG-иконку и постоянную текстовую подпись.
- Пункт занимает 64 × 64 пикселя; подпись не меньше 12 пикселей и может переноситься на две строки.
- Текущий раздел выделяется белой плиткой с тонкой границей и лёгкой тенью; синий показывает текущее состояние.
- На экране до 700 пикселей эта же навигация становится нижней панелью высотой 80 пикселей из четырёх пунктов; содержимое получает безопасный нижний отступ.

---

## Motion

**Page Transition** (Subtle) — Trigger: route change | Duration: 200-300ms | Easing: `power1.inOut`

```js
gsap.to(main, { opacity: 0, duration: 0.2, onComplete: () => { navigate(); gsap.fromTo(main, { opacity: 0 }, { opacity: 1, duration: 0.2 }); } });
```

**Framework notes:** Pair with the router's transition hooks (Next.js App Router transitions, React Router's useNavigate, Vue Router's beforeEach/afterEach)

- ✅ Preload the destination route's critical assets before the exit tween finishes
- ❌ Don't block navigation on animation; cap exit duration at ~250ms so the app never feels unresponsive
- ⚡ Exit animation should always resolve faster than entrance (asymmetric timing) so back/forward feels snappy

---

## Anti-Patterns (Do NOT Use)

- ❌ Heavy chrome
- ❌ Slow response feedback

### Additional Forbidden Patterns

- ❌ **Emojis as icons** — Use SVG icons (Heroicons, Lucide, Simple Icons)
- ❌ **Missing cursor:pointer** — All clickable elements must have cursor:pointer
- ❌ **Layout-shifting hovers** — Avoid scale transforms that shift layout
- ❌ **Low contrast text** — Maintain 4.5:1 minimum contrast ratio
- ❌ **Instant state changes** — Always use transitions (150-300ms)
- ❌ **Invisible focus states** — Focus states must be visible for a11y

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Heroicons/Lucide)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile
