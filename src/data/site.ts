// Усе, що Оля може захотіти поміняти без розробника: контакти, соцмережі, огляди, питання анкети.

export const LEAD_ENDPOINT: string =
  import.meta.env.PUBLIC_LEAD_ENDPOINT || 'https://modern-estate-leads.parleerio.workers.dev/api/lead';

export const contacts = {
  phone: '097 097 77 74',
  phoneHref: 'tel:+380970977774',
  telegram: 'https://t.me/modern_estate_agency',
  whatsapp: 'https://wa.me/380970977774',
  viber: 'viber://chat?number=%2B380970977774',
  email: 'agency.modern.estate@gmail.com',
  address: 'Ірпінь, вул. Мечникова, 32',
  addressShort: 'Ірпінь, вул. Мечникова, 32',
  maps: 'https://maps.app.goo.gl/EX3TZrJv5cTuiqsr6',
};

export const socials = [
  {
    id: 'instagram',
    name: 'Instagram агенції',
    handle: '@modern_estate_agency',
    href: 'https://www.instagram.com/modern_estate_agency',
    note: '17,4 тис. підписників · нові відеоогляди щотижня',
    featured: true,
  },
  { id: 'tiktok', name: 'TikTok', handle: '@modern_estate', href: 'https://tiktok.com/@modern_estate', note: 'Короткі огляди об’єктів' },
  {
    id: 'youtube',
    name: 'YouTube',
    handle: 'Modern Estate Agency',
    href: 'https://www.youtube.com/channel/UCkbptC4QGmMU6MGiQPzK3Dg',
    note: 'Повні відеотури',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    handle: 'Modern Estate Agency',
    href: 'https://www.facebook.com/profile.php?id=61572273623361',
    note: 'Новини агенції',
  },
];

// ── Відеокаталог: огляди з Instagram ──────────────────────────────────────────
// Новий огляд = скопіювати блок, вставити код рілса (з посилання instagram.com/reel/КОД/)
// і покласти обкладинку 9:16 у public/assets/reels/КОД.webp

export type ReviewCategory = 'houses' | 'townhouses' | 'apartments' | 'coffee';

export const reviewTabs: { id: ReviewCategory; label: string; highlight: string; highlightLabel: string }[] = [
  { id: 'houses', label: 'Будинки', highlight: 'https://www.instagram.com/stories/highlights/18076491880638726/', highlightLabel: 'БУДИНКИ' },
  { id: 'townhouses', label: 'Таунхауси', highlight: 'https://www.instagram.com/stories/highlights/18051879032515699/', highlightLabel: 'ТАУНХАУСИ' },
  { id: 'apartments', label: 'Квартири та ЖК', highlight: 'https://www.instagram.com/stories/highlights/18049140170511745/', highlightLabel: 'КВАРТИРИ' },
  { id: 'coffee', label: 'Кава з забудовником', highlight: 'https://www.instagram.com/modern_estate_agency/reels/', highlightLabel: 'Reels' },
];

export type Review = {
  code: string;
  category: ReviewCategory;
  title: string;
  place: string;
  specs: string[];
  views?: string;
  type?: string; // для «Хочу схожий» — значення з кроку «type» анкети
  location?: string; // значення з кроку «location»
};

export const reviews: Review[] = [
  { code: 'DetYyv5MkI7', category: 'houses', title: 'Будинок у лісовій Бучі з басейном', place: 'Буча', specs: ['200 м²', '6 соток', 'басейн з підігрівом', 'сауна'], views: '29,4 тис.', type: 'Будинок', location: 'Буча' },
  { code: 'DeY3j6gseeh', category: 'houses', title: 'Преміальний будинок у Гореничах', place: 'Гореничі', specs: ['260 м²', '10 соток', 'басейн 4×8', 'укриття'], views: '2,5 тис.', type: 'Будинок' },
  { code: 'DfZiljYMonf', category: 'houses', title: 'Будинок з другим світлом', place: 'Ірпінь', specs: ['220 м²', '10 соток', 'тераса 90 м²', 'стелі ≈ 6 м'], type: 'Будинок', location: 'Ірпінь' },
  { code: 'DdtT-FnMoAh', category: 'houses', title: 'Будинок серед сосон', place: 'Буча', specs: ['215 м²', '8 соток', 'клінкер', 'вікна REHAU'], type: 'Будинок', location: 'Буча' },
  { code: 'DeHhvREsnK4', category: 'houses', title: 'Сучасний будинок у Дмитрівці', place: 'Дмитрівка', specs: ['160 м² + тераса', '4,5 сотки', 'стелі 3,4 м', '15 хв до метро'], views: '1,9 тис.', type: 'Будинок' },
  { code: 'DfRg5fysr4G', category: 'townhouses', title: 'THE YARD — 14 таунхаусів біля парку', place: 'Ірпінь', specs: ['116 м²', '4 кімнати', 'камін', 'ділянка від 1,44 сот.'], views: '11,5 тис.', type: 'Таунхаус', location: 'Ірпінь' },
  { code: 'DdYqiyns0vh', category: 'townhouses', title: 'THE YARD · Designed for living', place: 'Ірпінь', specs: ['вул. Університетська', 'біля парку', 'розтермінування'], type: 'Таунхаус', location: 'Ірпінь' },
  { code: 'DeyxNkiME1a', category: 'townhouses', title: 'THE YARD · хід будівництва', place: 'Ірпінь', specs: ['фундамент готовий', 'мережі прокладено'], views: '2,7 тис.', type: 'Таунхаус', location: 'Ірпінь' },
  { code: 'De9DO5nMTB0', category: 'apartments', title: 'Малоповерховий ЖК біля набережної', place: 'Ірпінь', specs: ['закрита територія', '7 км до Києва', 'комерція поруч'], views: '2 тис.', type: 'Квартира', location: 'Ірпінь' },
  { code: 'DSafWvCDIvG', category: 'apartments', title: 'ЖК Park Royal від Royal House', place: 'Буча', specs: ['25 га', '4 га власного парку', '50+ планувань'], views: '8,5 тис.', type: 'Квартира', location: 'Буча' },
  { code: 'DO0w45wjNua', category: 'coffee', title: 'Сергій Крикун, Svitlo Development', place: 'О.Краса · Loft City · Loft Affair', specs: ['Випуск 1', 'котеджне місто'], views: '13,2 тис.' },
  { code: 'DSafWvCDIvG', category: 'coffee', title: 'Park Royal від Royal House', place: 'Буча', specs: ['Випуск 2', '23 будинки', '10 кварталів'], views: '8,5 тис.', type: 'Квартира', location: 'Буча' },
];

// ── Анкета ────────────────────────────────────────────────────────────────────
// id кроку = ключ у заявці; label = як підписати рядок у Telegram.
// when — показувати крок лише для певної мети (купити / орендувати / продати).

export type Goal = 'Купити' | 'Орендувати' | 'Продати';

export type QuizOption = { value: string; icon?: string; hint?: string };
export type QuizStep = {
  id: string;
  label: string;
  title: (goal?: string) => string;
  hint?: string;
  multi?: boolean;
  optional?: boolean;
  when?: (goal?: string) => boolean;
  options: (goal?: string) => QuizOption[];
};

export const quizSteps: QuizStep[] = [
  {
    id: 'goal',
    label: 'Мета',
    title: () => 'Що вас цікавить?',
    options: () => [
      { value: 'Купити', icon: 'key', hint: 'підберемо без комісії' },
      { value: 'Орендувати', icon: 'calendar', hint: 'житло або комерція' },
      { value: 'Продати', icon: 'tag', hint: 'або здати свою' },
    ],
  },
  {
    id: 'type',
    label: 'Тип',
    title: (g) => (g === 'Продати' ? 'Що продаєте?' : g === 'Орендувати' ? 'Що хочете орендувати?' : 'Що шукаєте?'),
    options: () => [
      { value: 'Квартира', icon: 'building' },
      { value: 'Будинок', icon: 'house' },
      { value: 'Дуплекс', icon: 'duplex' },
      { value: 'Таунхаус', icon: 'townhouse' },
      { value: 'Комерційна', icon: 'store' },
      { value: 'Ділянка', icon: 'land' },
    ],
  },
  {
    id: 'location',
    label: 'Локація',
    title: (g) => (g === 'Продати' ? 'Де знаходиться об’єкт?' : 'Де шукаєте?'),
    hint: 'можна обрати кілька',
    multi: true,
    options: () => [
      { value: 'Київ' },
      { value: 'Ірпінь' },
      { value: 'Буча' },
      { value: 'Гостомель' },
      { value: 'Ворзель' },
      { value: 'Інше в області' },
    ],
  },
  {
    id: 'budget',
    label: 'Бюджет',
    title: () => 'Який бюджет розглядаєте?',
    when: (g) => g !== 'Продати',
    options: (g) =>
      g === 'Орендувати'
        ? [{ value: 'до 20 тис. ₴' }, { value: '20–35 тис. ₴' }, { value: '35–60 тис. ₴' }, { value: 'від 60 тис. ₴' }, { value: 'Ще не визначились' }]
        : [
            { value: 'до $60 тис.' },
            { value: '$60–100 тис.' },
            { value: '$100–150 тис.' },
            { value: '$150–250 тис.' },
            { value: 'від $250 тис.' },
            { value: 'Ще рахую' },
          ],
  },
  {
    id: 'payment',
    label: 'Оплата',
    title: () => 'Як плануєте купівлю?',
    hint: 'можна обрати кілька',
    multi: true,
    when: (g) => g === 'Купити' || !g,
    options: () => [
      { value: 'Власні кошти', icon: 'wallet' },
      { value: 'Розтермінування', icon: 'calendar' },
      { value: 'єОселя', icon: 'shield' },
      { value: 'Іпотека банку', icon: 'bank' },
      { value: 'єВідновлення', icon: 'doc' },
      { value: 'Продаж / обмін свого', icon: 'swap' },
    ],
  },
  {
    id: 'timing',
    label: 'Терміни',
    title: (g) => (g === 'Продати' ? 'Коли плануєте продаж?' : 'Коли плануєте?'),
    options: () => [{ value: 'Якнайшвидше' }, { value: 'Протягом 1–3 місяців' }, { value: 'За 3–6 місяців' }, { value: 'Поки придивляюсь' }],
  },
];

export const contactMethods = ['Дзвінок', 'Telegram', 'Viber', 'WhatsApp'];
