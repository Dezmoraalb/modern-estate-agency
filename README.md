# Modern Estate Agency — сайт-воронка

Лендинг агенції [modern-estate-agency.com.ua](https://modern-estate-agency.com.ua): опис агенції, відеоогляди з Instagram, THE YARD і **анкета підбору**, заявки з якої миттєво падають у приватний Telegram-канал.

Стек: Astro 5 + Tailwind + React-острови (framer-motion). Хостинг — GitHub Pages (деплой автоматично з `main`, `.github/workflows/deploy.yml`), DNS — Cloudflare.

## Як ходять заявки

```
анкета (LeadQuiz.tsx) ──POST JSON──▶ Cloudflare Worker `modern-estate-leads` ──▶ Telegram Bot API ──▶ канал «Modern Estate · Заявки з сайту»
```

- Worker: `worker/` (`https://modern-estate-leads.parleerio.workers.dev/api/lead`), бот `@modern_estate_leads_bot` — адмін каналу.
- Секрети Worker'а `TG_BOT_TOKEN` і `TG_CHAT_ID` лежать лише в Cloudflare (і локально в `~/.config/modern-estate/leads.env`), у репо їх немає.
- Захист: honeypot-поле, відсів форм швидше 2,5 с, ліміт 5 заявок / 10 хв з IP, CORS лише для домену сайту, `*.modern-estate-agency.pages.dev` і localhost:4321.
- У заявці: відповіді анкети, ім'я, телефон, зручний месенджер, коментар, звідки натиснули («Хіро: Будинок», «Відеоогляд … → Хочу схожий», «THE YARD»), UTM-мітки, реферер, місто. Кнопки «Telegram» і «WhatsApp» відкривають чат з клієнтом.
- Якщо Worker недоступний — у формі показується прямий Telegram і телефон.

Додати людей у канал: відкрити канал у Telegram → «Додати учасників». Змінити канал: `cd worker && npx wrangler secret put TG_CHAT_ID`.

## Що можна міняти без розробника — `src/data/site.ts`

- **Контакти й соцмережі** — `contacts`, `socials`.
- **Відеоогляди** — масив `reviews`. Новий огляд: скопіювати блок, вставити код рілса з посилання `instagram.com/reel/КОД/`, обкладинку 9:16 покласти в `public/assets/reels/КОД.webp`. `type`/`location` — що підставиться в анкету по кнопці «Хочу схожий».
- **Питання анкети** — `quizSteps`: id кроку, підпис для Telegram, варіанти відповідей, умова показу (`when`) для «Купити / Орендувати / Продати».

## Команди

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # → dist/
cd worker && npx wrangler deploy   # оновити Worker
```

Прев'ю без викладки в прод: `npx wrangler pages deploy dist --project-name modern-estate-agency --branch preview`.
