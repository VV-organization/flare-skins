# Drops

Магазин скинов, пополнение Steam и карты Apple. Новый визуал по Trionn, bleibtgleich, Boc и Hobro; структура и сценарии адаптированы из Frags.

## Разработка

Node.js 24, `npm ci`, `npm run dev`. Локальный адрес http://127.0.0.1:5197.

- `npm test`: денежная модель, Steam validation, фильтры, подбор, интеграционные границы.
- `npm run typecheck` / `npm run lint`: статические проверки.
- `npm run build`: Next.js production build.
- `npm run build:pages`: static export в out-pages с base path /flare-skins-site. Серверные API остаются в исходниках; исключаются только во временной копии статической сборки.

Исходники: https://github.com/VV-organization/flare-skins (private).
Публичная публикация пока не выполнена: автоматическая проверка разрешений запросила явное согласие на публичный репозиторий. Готовая сборка находится в out-pages; предполагаемый адрес после разрешения — https://vv-organization.github.io/flare-skins-site/.

## Реализация

Главная, каталог с поиском и фильтрами, 68 карточек скинов, быстрый просмотр, отдельная корзина, кабинет, формы Steam/баланса, конвертер, подбор по цвету и бюджету, регион/номинал Apple. Steam первым после hero, слева от баланса; конвертер перед FAQ. Адаптивность и reduced-motion.

## Границы готовности

Каталог — датированный снимок Frags с сохранёнными source-полями, не подтверждение актуальных цен/наличия. Корзина, открытие кабинета и trade-URL хранятся на устройстве в изолированных flare-ключах. Локальное открытие кабинета не является Steam-авторизацией. Steam ID не придумывается, баланс 0, истории пустые.

Платежи, Steam OpenID, вендор/выдача скинов и поставщик Apple не подключены. Операции ничего не списывают и сообщают о недоступности. Серверная проверка Steam читает официальный публичный XML профиля, проверяет соответствие Steam ID; это не проверка возможности пополнения. GitHub Pages не запускает серверные API.

Регионы/номиналы Apple — предварительные варианты интерфейса, без выдуманной рублёвой цены или кода. Название и курс утверждены пользователем: 1 ₽ = 1,8 Drops, Steam +5% сверху; перед коммерческим запуском подтвердить условия и лимиты.

## Документы и источники

project-prompts.md — семь адаптированных промтов. PROJECT.md — требования. DESIGN_DIRECTION.md и reference-evidence/review.md — применение референсов. REQUIREMENTS_AUDIT.md — проверки и ограничения.

Oswald + GolosText: SIL OFL, лицензии public/fonts/Oswald-OFL.txt и public/fonts/GolosText-OFL.txt. Изображения скинов из локального снимка Frags с сохранёнными URL происхождения; не генерировались и не перекрашивались.

## GitHub Pages

Public URL: https://vv-organization.github.io/flare-skins/

Pushes to `codex/flare-storefront` run `.github/workflows/pages.yml`: Node 24, lockfile installation, lint, tests, isolated static export and Pages deployment. Use Actions → Deploy Drops to GitHub Pages → Run workflow for a manual redeploy.

Local equivalent: `npm ci && npm run lint && npm test && npm run build:pages`.
The export goes to ignored `out-pages/`; its base path is `/flare-skins`.
The source API routes stay in the repository but are excluded from the isolated Pages export. GitHub Pages does not execute the checkout/top-up/Steam server routes; production financial integrations require a separate backend. No provider secrets belong in the static client.
