# Aivel AI Site

Публичный продуктовый сайт Aivel:

- для бизнеса — проверяемые сигналы о важных изменениях и надёжный учёт;
- для крупных компаний — ИИ-агенты для финансовых и бухгалтерских процессов;
- для владельцев бухгалтерских компаний — модель партнёрства с Aivel.

Сайт построен на Next.js 16, React 19 и TypeScript. Публичная статическая версия размещается
бесплатно на GitHub Pages:

<https://adavydov.github.io/aivel-ai-site/>

## Локальный запуск

```powershell
npm install
npm run dev
```

По умолчанию сайт доступен на `http://localhost:3000`.

## Проверка

```powershell
npm run lint
npm run typecheck
npm run build
```

## Статическая сборка для GitHub Pages

```powershell
$env:STATIC_EXPORT = "true"
$env:NEXT_PUBLIC_STATIC_EXPORT = "true"
$env:NEXT_PUBLIC_BASE_PATH = "/aivel-ai-site"
$env:NEXT_PUBLIC_SITE_URL = "https://adavydov.github.io/aivel-ai-site"
npm run build
node scripts/prepare-github-pages.mjs out
```

В статической версии анкета партнёрства формирует подготовленное письмо. Серверная передача
обращений доступна только при обычном Next.js-развёртывании и настройке переменных из
`.env.example`.

## Структура

- `src/app` — страницы и метаданные;
- `src/components` — общие компоненты и навигация;
- `src/data` — опубликованные продуктовые факты и тексты;
- `public` — изображения, логотипы и видео;
- `scripts` — локальная и публикационная проверка;
- `docs/product` — продуктовые решения и варианты сюжета сайта.

Ветка `main` содержит исходный код. Ветка `gh-pages` содержит только проверенный статический
артефакт, который обслуживает GitHub Pages.
