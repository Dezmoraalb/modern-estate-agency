import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from './Icon';
import { reviewTabs, reviews, type ReviewCategory } from '../data/site';
import { openQuiz } from '../lib/quiz';

export default function ReviewsTabs({ baseUrl = '/' }: { baseUrl?: string }) {
  const [tab, setTab] = useState<ReviewCategory>('houses');
  const items = reviews.filter((r) => r.category === tab);
  const meta = reviewTabs.find((t) => t.id === tab)!;

  return (
    <div>
      <div role="tablist" aria-label="Категорії оглядів" className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 md:mx-0 md:px-0 mb-8 md:mb-10">
        {reviewTabs.map((t) => {
          const on = t.id === tab;
          const count = reviews.filter((r) => r.category === t.id).length;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={on}
              onClick={() => setTab(t.id)}
              className={`shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm transition-all ${
                on ? 'bg-white text-black border-white font-semibold' : 'border-white/15 text-white/70 hover:border-white/40 hover:text-white'
              }`}
            >
              {t.label}
              <span className={`text-[11px] ${on ? 'text-black/50' : 'text-white/35'}`}>{count}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex md:grid md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory no-scrollbar -mx-5 px-5 md:mx-0 md:px-0 pb-2"
        >
          {items.map((r) => (
            <article key={r.code + r.category} className="reel-card group snap-start shrink-0 w-[68vw] sm:w-[44vw] md:w-auto">
              <a
                href={`https://www.instagram.com/reel/${r.code}/`}
                target="_blank"
                rel="noopener"
                className="block relative aspect-[9/16] rounded-2xl overflow-hidden border border-white/10 bg-white/5"
                aria-label={`Дивитися огляд: ${r.title} — Instagram`}
              >
                <img
                  src={`${baseUrl}assets/reels/${r.code}.webp`}
                  alt={r.title}
                  loading="lazy"
                  decoding="async"
                  width={360}
                  height={640}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/0 group-hover:ring-champagne/40 rounded-2xl transition" />
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/55 backdrop-blur text-[11px] text-white/90">
                    <Icon name="instagram" className="w-3.5 h-3.5" /> Reels
                  </span>
                  {r.views && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/55 backdrop-blur text-[11px] text-white/90">
                      <Icon name="eye" className="w-3.5 h-3.5" /> {r.views}
                    </span>
                  )}
                </div>
              </a>
              <div className="pt-4 px-0.5">
                <div className="flex items-center gap-1.5 text-champagne text-[11px] uppercase tracking-[0.16em] mb-1.5">
                  <Icon name="pin" className="w-3.5 h-3.5" /> {r.place}
                </div>
                <h3 className="!text-[16px] !leading-snug font-semibold text-white mb-2.5 min-h-[2.6em]">{r.title}</h3>
                <div className="flex flex-wrap gap-1">
                  {r.specs.slice(0, 3).map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded-md bg-white/[0.07] text-[11px] text-white/65">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  openQuiz({
                    goal: 'Купити',
                    type: r.type,
                    location: r.location ? [r.location] : undefined,
                    note: `Схоже на: ${r.title}`,
                    source: `Відеоогляд «${r.title}» → «Хочу схожий»`,
                  })
                }
                className="mt-4 w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 text-sm text-white/80 hover:border-champagne/60 hover:text-champagne hover:bg-champagne/[0.06] transition-all"
              >
                <Icon name="sparkle" className="w-4 h-4" /> Хочу схожий
              </button>
            </article>
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
        <a
          href={meta.highlight}
          target="_blank"
          rel="noopener"
          className="group inline-flex items-center gap-2 text-sm text-white/80 hover:text-champagne transition-colors"
        >
          <span className="w-9 h-9 rounded-full p-[1.5px] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]">
            <span className="w-full h-full rounded-full bg-black flex items-center justify-center">
              <Icon name="instagram" className="w-4 h-4" />
            </span>
          </span>
          Більше в Instagram: «{meta.highlightLabel}»
          <Icon name="external" className="w-4 h-4 opacity-50 group-hover:opacity-100" />
        </a>
        <span className="text-white/30 text-sm hidden sm:inline">·</span>
        <span className="text-white/45 text-sm">Не все потрапляє в Instagram — частину об’єктів покажемо лише за вашим запитом.</span>
      </div>
    </div>
  );
}
