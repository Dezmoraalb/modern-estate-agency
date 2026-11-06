import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from './Icon';
import { LEAD_ENDPOINT, contactMethods, contacts, quizSteps } from '../data/site';
import { QUIZ_EVENT, formatPhone, phoneValid, scrollToId, type QuizPreset } from '../lib/quiz';

type Answers = Record<string, string | string[]>;
type Status = 'idle' | 'sending' | 'done' | 'error';

const STORE = 'me-quiz-v1';
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

function load(): any {
  try {
    return JSON.parse(localStorage.getItem(STORE) || 'null');
  } catch {
    return null;
  }
}

export default function LeadQuiz() {
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [contact, setContact] = useState('Дзвінок');
  const [comment, setComment] = useState('');
  const [showComment, setShowComment] = useState(false);
  const [note, setNote] = useState('');
  const [source, setSource] = useState('');
  const [website, setWebsite] = useState('');
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [highlight, setHighlight] = useState(false);
  const startedAt = useRef(Date.now());
  const titleRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const answersRef = useRef(answers);
  answersRef.current = answers;
  const statusRef = useRef<Status>('idle');
  statusRef.current = status;

  const goal = answers.goal as string | undefined;
  const steps = useMemo(() => quizSteps.filter((s) => !s.when || s.when(goal)), [goal]);
  const total = steps.length + 1; // + контакти
  const isContact = step >= steps.length;
  const current = steps[step];
  const few = !!current && current.options(goal).length <= 3; // 3 великі плитки: на мобільному — список

  // відновлюємо незавершену анкету
  useEffect(() => {
    const s = load();
    if (s && !s.done) {
      setAnswers(s.answers || {});
      setStep(Math.min(s.step || 0, quizSteps.length));
      setName(s.name || '');
      setPhone(s.phone || '');
      setContact(s.contact || 'Дзвінок');
    }
    try {
      const params = new URLSearchParams(location.search);
      const utm: Record<string, string> = {};
      UTM_KEYS.forEach((k) => params.get(k) && (utm[k] = params.get(k)!));
      if (Object.keys(utm).length) sessionStorage.setItem('me-utm', JSON.stringify(utm));
    } catch {}
  }, []);

  useEffect(() => {
    if (status === 'done') return;
    try {
      localStorage.setItem(STORE, JSON.stringify({ answers, step, name, phone, contact }));
    } catch {}
  }, [answers, step, name, phone, contact, status]);

  // фокус на заголовок кроку — для клавіатури й скрінрідерів
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    titleRef.current?.focus({ preventScroll: true });
  }, [step, status]);

  // кнопки на сторінці відкривають анкету з уже вибраними відповідями
  useEffect(() => {
    const onPreset = (e: Event) => {
      const p = (e as CustomEvent<QuizPreset>).detail || {};
      const next: Answers = {};
      if (p.goal) next.goal = p.goal;
      if (p.type) next.type = p.type;
      if (p.location?.length) next.location = p.location;
      // після відправленої заявки — нова анкета з чистого аркуша (ім’я й телефон лишаємо)
      const prev = statusRef.current === 'done' ? {} : answersRef.current;
      const merged = { ...prev, ...next };
      if (p.goal && p.goal !== prev.goal) {
        delete merged.budget;
        if (p.goal !== 'Купити') delete merged.payment;
      }
      const visible = quizSteps.filter((s) => !s.when || s.when(merged.goal as string));
      const firstEmpty = visible.findIndex((s) => {
        const v = merged[s.id];
        return !v || (Array.isArray(v) && !v.length);
      });
      setAnswers(merged);
      setDir(1);
      setStep(firstEmpty === -1 ? visible.length : firstEmpty);
      if (statusRef.current === 'done') setComment('');
      setNote(p.note || '');
      setSource(p.source || '');
      setStatus((s) => (s === 'done' ? 'idle' : s));
      scrollToId('anketa');
      setHighlight(true);
      setTimeout(() => setHighlight(false), 1400);
    };
    window.addEventListener(QUIZ_EVENT, onPreset);
    return () => window.removeEventListener(QUIZ_EVENT, onPreset);
  }, []);

  const go = (to: number) => {
    setDir(to > step ? 1 : -1);
    setStep(Math.max(0, Math.min(to, steps.length)));
  };

  const pick = (id: string, value: string, multi?: boolean) => {
    if (multi) {
      setAnswers((a) => {
        const cur = Array.isArray(a[id]) ? (a[id] as string[]) : [];
        return { ...a, [id]: cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value] };
      });
      return;
    }
    setAnswers((a) => {
      const next = { ...a, [id]: value };
      if (id === 'goal' && a.goal !== value) {
        delete next.budget;
        if (value !== 'Купити') delete next.payment;
      }
      return next;
    });
    setTimeout(() => {
      setDir(1);
      setStep((s) => s + 1);
    }, 220);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!name.trim() || !phoneValid(phone)) return;
    setStatus('sending');

    const visibleAnswers: Answers = {};
    const labels: Record<string, string> = {};
    steps.forEach((s) => {
      const v = answers[s.id];
      if (v && (!Array.isArray(v) || v.length)) {
        visibleAnswers[s.id] = v;
        labels[s.id] = s.label;
      }
    });
    let utm = {};
    try {
      utm = JSON.parse(sessionStorage.getItem('me-utm') || '{}');
    } catch {}

    try {
      const res = await fetch(LEAD_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: visibleAnswers,
          labels,
          name: name.trim(),
          phone,
          contact,
          comment: [note, comment.trim()].filter(Boolean).join(' · '),
          source: source || 'Анкета на сайті',
          utm,
          referrer: document.referrer,
          page: location.href,
          startedAt: startedAt.current,
          website,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('done');
      try {
        localStorage.removeItem(STORE);
        (window as any).dataLayer?.push({ event: 'lead_submit', lead_goal: goal, lead_type: answers.type });
        (window as any).fbq?.('track', 'Lead');
        (window as any).gtag?.('event', 'generate_lead');
      } catch {}
    } catch {
      setStatus('error');
    }
  };

  const reset = () => {
    setAnswers({});
    setComment('');
    setNote('');
    setSource('');
    setTouched(false);
    setStatus('idle');
    setDir(-1);
    setStep(0);
    startedAt.current = Date.now();
  };

  const summary = steps
    .map((s, i) => ({ i, v: answers[s.id] }))
    .filter((x) => x.v && (!Array.isArray(x.v) || x.v.length))
    .map((x) => ({ i: x.i, text: Array.isArray(x.v) ? (x.v as string[]).join(', ') : (x.v as string) }));

  const nameError = touched && !name.trim();
  const phoneError = touched && !phoneValid(phone);
  const cta = goal === 'Продати' ? 'Отримати консультацію' : goal === 'Орендувати' ? 'Отримати варіанти' : 'Отримати підбірку';

  return (
    <div
      className={`quiz-card relative rounded-[1.75rem] border bg-[#0b0b0b]/85 backdrop-blur-xl shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] transition-[border-color,box-shadow] duration-700 ${
        highlight ? 'border-champagne/60 shadow-[0_0_0_6px_rgba(225,205,166,0.08),0_40px_120px_-40px_rgba(0,0,0,0.9)]' : 'border-white/10'
      }`}
    >
      <div className="absolute inset-x-10 -top-px h-px bg-gradient-to-r from-transparent via-champagne/70 to-transparent" />

      {status === 'done' ? (
        <div className="p-7 md:p-10 text-center min-h-[460px] flex flex-col items-center justify-center" aria-live="polite">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className="w-16 h-16 rounded-full bg-gold-gradient flex items-center justify-center text-black mb-6"
          >
            <Icon name="check" className="w-8 h-8" strokeWidth={2.2} />
          </motion.div>
          <h3 ref={titleRef} tabIndex={-1} className="font-display !text-3xl md:!text-4xl text-white mb-3 outline-none">
            Дякуємо{name.trim() ? `, ${name.trim().split(' ')[0]}` : ''}!
          </h3>
          <p className="text-white/60 font-light max-w-sm mb-8 leading-relaxed">
            Заявку отримали. Менеджер зв’яжеться з вами {contact === 'Дзвінок' ? 'телефоном' : `у ${contact}`} найближчим часом.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <a
              href="https://www.instagram.com/modern_estate_agency/reels/"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-white/15 text-white/90 text-sm hover:border-champagne/60 hover:text-champagne transition-colors"
            >
              <Icon name="instagram" className="w-4 h-4" /> Поки дивіться огляди
            </a>
            <button onClick={reset} className="px-6 py-3.5 rounded-full text-white/50 text-sm hover:text-white transition-colors">
              Нова анкета
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6 md:p-9">
          {/* прогрес */}
          <div className="flex items-center justify-between mb-5">
            <button
              type="button"
              onClick={() => go(step - 1)}
              disabled={step === 0}
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-white/50 hover:text-white disabled:opacity-0 transition"
            >
              <Icon name="back" className="w-4 h-4" /> Назад
            </button>
            <span className="text-xs uppercase tracking-[0.18em] text-white/40">
              Крок <span className="text-champagne">{Math.min(step + 1, total)}</span> з {total}
            </span>
          </div>
          <div className="flex gap-1.5 mb-8" aria-hidden="true">
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} className="h-[3px] flex-1 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gold-gradient transition-all duration-500 ease-out"
                  style={{ width: i < step ? '100%' : i === step ? '45%' : '0%' }}
                />
              </div>
            ))}
          </div>

          <div className="relative min-h-[360px]">
            <AnimatePresence mode="wait" custom={dir} initial={false}>
              {!isContact && current ? (
                <motion.fieldset
                  key={current.id + (goal || '')}
                  custom={dir}
                  initial={{ opacity: 0, x: dir * 28 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: dir * -28 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <legend className="sr-only">{current.title(goal)}</legend>
                  <h3 ref={titleRef} tabIndex={-1} className="font-display !text-[1.85rem] md:!text-[2.3rem] !leading-[1.1] text-white outline-none">
                    {current.title(goal)}
                  </h3>
                  <p className="text-white/40 text-sm mt-2 mb-6 h-5">{current.hint || (current.multi ? '' : 'оберіть один варіант')}</p>

                  <div
                    className={`grid gap-2.5 ${
                      few ? 'grid-cols-1 sm:grid-cols-3' : current.options(goal).some((o) => o.icon) ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2'
                    }`}
                  >
                    {current.options(goal).map((o) => {
                      const v = answers[current.id];
                      const on = Array.isArray(v) ? v.includes(o.value) : v === o.value;
                      return (
                        <button
                          type="button"
                          key={o.value}
                          aria-pressed={on}
                          onClick={() => pick(current.id, o.value, current.multi)}
                          className={`opt group relative text-left rounded-2xl border px-4 py-4 transition-all duration-200 active:scale-[0.98] ${
                            on ? 'border-champagne/70 bg-champagne/[0.09] text-white' : 'border-white/10 bg-white/[0.025] text-white/80 hover:border-white/25 hover:bg-white/[0.05]'
                          } ${
                            o.icon
                              ? few
                                ? 'min-h-[74px] flex items-center gap-4 sm:min-h-[168px] sm:flex-col sm:items-start sm:justify-between sm:gap-0'
                                : 'min-h-[104px] flex flex-col justify-between'
                              : 'min-h-[58px] flex items-center'
                          }`}
                        >
                          {o.icon && (
                            <Icon
                              name={o.icon}
                              className={`w-6 h-6 shrink-0 ${few ? 'sm:mb-3' : 'mb-3'} transition-colors ${on ? 'text-champagne' : 'text-white/45 group-hover:text-white/70'}`}
                            />
                          )}
                          <span className="block">
                            <span className="block text-[15px] font-medium leading-tight pr-5">{o.value}</span>
                            {o.hint && <span className="block text-xs text-white/40 mt-1 font-light">{o.hint}</span>}
                          </span>
                          <span
                            className={`absolute top-3 right-3 w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                              on ? 'bg-champagne border-champagne text-black scale-100' : 'border-white/20 scale-90 opacity-0 group-hover:opacity-100'
                            }`}
                          >
                            {on && <Icon name="check" className="w-3 h-3" strokeWidth={3} />}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {(current.multi || current.id === 'timing') && (
                    <div className="flex items-center justify-between mt-6">
                      <button type="button" onClick={() => go(step + 1)} className="text-sm text-white/40 hover:text-white/80 transition">
                        Пропустити
                      </button>
                      {current.multi && (
                        <button
                          type="button"
                          onClick={() => go(step + 1)}
                          disabled={!(answers[current.id] as string[] | undefined)?.length}
                          className="btn-gold inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold disabled:opacity-30 disabled:pointer-events-none"
                        >
                          Далі <Icon name="arrow" className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </motion.fieldset>
              ) : (
                <motion.form
                  key="contact"
                  onSubmit={submit}
                  noValidate
                  initial={{ opacity: 0, x: dir * 28 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: dir * -28 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h3 ref={titleRef} tabIndex={-1} className="font-display !text-[1.85rem] md:!text-[2.3rem] !leading-[1.1] text-white outline-none">
                    Куди надіслати {goal === 'Продати' ? 'відповідь' : 'варіанти'}?
                  </h3>
                  <p className="text-white/40 text-sm mt-2 mb-5">Останній крок — і менеджер вже працює над вашим запитом</p>

                  {(summary.length > 0 || note) && (
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {note && <span className="px-3 py-1.5 rounded-full text-xs bg-champagne/15 text-champagne border border-champagne/30">{note}</span>}
                      {summary.map((s) => (
                        <button
                          type="button"
                          key={s.i}
                          onClick={() => go(s.i)}
                          title="Змінити"
                          className="px-3 py-1.5 rounded-full text-xs text-white/70 bg-white/[0.04] border border-white/10 hover:border-white/30 transition"
                        >
                          {s.text}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-3">
                    <label className="block">
                      <span className="sr-only">Ваше ім’я</span>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="given-name"
                        placeholder="Ваше ім’я"
                        aria-invalid={nameError}
                        className={`field ${nameError ? 'field-error' : ''}`}
                      />
                    </label>
                    <label className="block">
                      <span className="sr-only">Телефон</span>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(formatPhone(e.target.value))}
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="+38 0__ ___ __ __"
                        aria-invalid={phoneError}
                        className={`field ${phoneError ? 'field-error' : ''}`}
                      />
                    </label>
                  </div>
                  {(nameError || phoneError) && (
                    <p className="text-[13px] text-rose-300/90 mt-2">{nameError ? 'Як до вас звертатися?' : 'Перевірте номер телефону'}</p>
                  )}

                  <div className="mt-4">
                    <span className="block text-xs uppercase tracking-[0.18em] text-white/40 mb-2">Як зручніше зв’язатися</span>
                    <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-white/[0.03] border border-white/10">
                      {contactMethods.map((m) => (
                        <button
                          type="button"
                          key={m}
                          onClick={() => setContact(m)}
                          aria-pressed={contact === m}
                          className={`py-2.5 rounded-xl text-[13px] transition ${contact === m ? 'bg-white text-black font-semibold' : 'text-white/60 hover:text-white'}`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  {showComment ? (
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={2}
                      maxLength={500}
                      placeholder="Що важливо: кількість кімнат, школа поруч, ремонт…"
                      className="field mt-3 resize-none"
                    />
                  ) : (
                    <button type="button" onClick={() => setShowComment(true)} className="mt-3 inline-flex items-center gap-1.5 text-sm text-white/45 hover:text-white/80 transition">
                      <Icon name="plus" className="w-4 h-4" /> Додати побажання
                    </button>
                  )}

                  {/* honeypot */}
                  <input
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    name="website"
                    aria-hidden="true"
                    className="absolute -left-[9999px] w-px h-px opacity-0"
                  />

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="btn-gold mt-5 w-full h-14 rounded-full font-semibold tracking-wide inline-flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {status === 'sending' ? (
                      <span className="inline-block w-5 h-5 rounded-full border-2 border-black/30 border-t-black animate-spin" />
                    ) : (
                      <>
                        {cta} <Icon name="arrow" className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  {status === 'error' && (
                    <div className="mt-4 rounded-2xl border border-rose-300/30 bg-rose-300/[0.06] p-4 text-sm text-white/80" role="alert">
                      Не вдалося надіслати — схоже, проблеми зі звʼязком. Спробуйте ще раз або напишіть нам напряму:{' '}
                      <a href={contacts.telegram} target="_blank" rel="noopener" className="text-champagne underline underline-offset-4">
                        Telegram
                      </a>{' '}
                      ·{' '}
                      <a href={contacts.phoneHref} className="text-champagne underline underline-offset-4">
                        {contacts.phone}
                      </a>
                    </div>
                  )}

                  <p className="text-[11px] text-white/30 mt-4 leading-relaxed text-center">
                    Номер бачить лише менеджер агенції. Натискаючи кнопку, ви погоджуєтесь на обробку персональних даних.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
