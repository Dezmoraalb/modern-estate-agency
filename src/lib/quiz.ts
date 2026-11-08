// Звʼязок між кнопками сторінки й анкетою (Astro-острови — окремі React-корені, тож через window-подію).

export type QuizPreset = {
  goal?: string;
  type?: string;
  location?: string[];
  note?: string; // додається до коментаря в заявці, напр. «THE YARD»
  source?: string; // що натиснула людина — летить у Telegram як «Звідки»
};

export const QUIZ_EVENT = 'me:quiz';

export function openQuiz(preset: QuizPreset = {}) {
  window.dispatchEvent(new CustomEvent<QuizPreset>(QUIZ_EVENT, { detail: preset }));
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  // блок може бути ще в анімації появи (translateY) — показуємо одразу і рахуємо позицію без transform
  el.closest('.reveal')?.classList.add('is-visible');
  let top = 0;
  for (let e: HTMLElement | null = el; e; e = e.offsetParent as HTMLElement | null) top += e.offsetTop;
  top -= innerWidth < 768 ? 84 : 110;
  const lenis = (window as any).__lenis;
  if (lenis) lenis.scrollTo(top, { duration: 1.1, force: true });
  else window.scrollTo({ top, behavior: 'smooth' });
}

export function formatPhone(raw: string): string {
  const plus = raw.trim().startsWith('+');
  let d = raw.replace(/\D/g, '');
  if (d.length <= 2) return (plus ? '+' : '') + d;
  if (plus && !d.startsWith('38')) return '+' + d.slice(0, 15); // іноземний номер — без маски
  if (d.startsWith('0')) d = '38' + d;
  else if (d.startsWith('80')) d = '3' + d;
  else if (!d.startsWith('38')) d = '380' + d;
  d = d.slice(0, 12);
  const p = d.slice(2);
  return ['+38', p.slice(0, 3), p.slice(3, 6), p.slice(6, 8), p.slice(8, 10)].filter(Boolean).join(' ');
}

export function phoneValid(v: string) {
  const d = v.replace(/\D/g, '');
  return d.startsWith('380') ? d.length === 12 : d.length >= 10 && d.length <= 15;
}
