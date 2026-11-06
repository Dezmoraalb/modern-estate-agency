import { useEffect, useState } from 'react';
import Icon from './Icon';
import { contacts } from '../data/site';
import { openQuiz } from '../lib/quiz';

// Мобільна панель «подзвонити / Telegram / підібрати» + плаваюча кнопка на десктопі.
// Ховається, поки видно хіро або саму анкету — щоб не дублювати.
export default function StickyCta() {
  const [heroVisible, setHeroVisible] = useState(true);
  const [quizVisible, setQuizVisible] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('hero-section');
    const quiz = document.getElementById('pidbir');
    const footer = document.getElementById('kontakty');
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.target === hero) setHeroVisible(e.isIntersecting);
          if (e.target === quiz) setQuizVisible(e.isIntersecting);
          if (e.target === footer) setFooterVisible(e.isIntersecting);
        }),
      { threshold: 0.15 },
    );
    hero && io.observe(hero);
    quiz && io.observe(quiz);
    footer && io.observe(footer);
    return () => io.disconnect();
  }, []);

  const hidden = heroVisible || quizVisible || footerVisible;
  const open = () => openQuiz({ source: 'Плаваюча кнопка' });

  return (
    <>
      <div
        className={`md:hidden fixed bottom-0 inset-x-0 z-[60] px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 bg-gradient-to-t from-black via-black/90 to-transparent transition-transform duration-500 ${
          hidden ? 'translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="flex gap-2">
          <a href={contacts.phoneHref} aria-label="Зателефонувати" className="w-14 h-14 shrink-0 rounded-2xl border border-white/15 bg-black/70 backdrop-blur flex items-center justify-center text-white">
            <Icon name="phone" className="w-5 h-5" />
          </a>
          <a
            href={contacts.telegram}
            target="_blank"
            rel="noopener"
            aria-label="Написати в Telegram"
            className="w-14 h-14 shrink-0 rounded-2xl border border-white/15 bg-black/70 backdrop-blur flex items-center justify-center text-[#5ab8ee]"
          >
            <Icon name="telegram" className="w-5 h-5" />
          </a>
          <button onClick={open} className="btn-gold flex-1 h-14 rounded-2xl font-semibold inline-flex items-center justify-center gap-2">
            Підібрати об’єкт <Icon name="arrow" className="w-5 h-5" />
          </button>
        </div>
      </div>

      <button
        onClick={open}
        className={`hidden md:inline-flex fixed bottom-8 right-8 z-[60] btn-gold h-14 pl-6 pr-5 rounded-full font-semibold items-center gap-2 shadow-[0_20px_60px_-15px_rgba(225,205,166,0.45)] transition-all duration-500 ${
          hidden ? 'opacity-0 translate-y-6 pointer-events-none' : 'opacity-100 translate-y-0'
        }`}
      >
        <span className="relative flex w-2.5 h-2.5 mr-1">
          <span className="absolute inline-flex h-full w-full rounded-full bg-black/40 animate-ping" />
          <span className="relative inline-flex rounded-full w-2.5 h-2.5 bg-black/70" />
        </span>
        Підібрати за 1 хвилину <Icon name="arrow" className="w-5 h-5" />
      </button>
    </>
  );
}
