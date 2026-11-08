// POST /api/lead → повідомлення в Telegram-канал заявок.
// Фронт шле JSON { answers: {key: label|label[]}, name, phone, contact, comment, source, utm, page, referrer, startedAt, website }.
// website — honeypot (люди його не бачать), startedAt — щоб відсіяти ботів, які шлють форму за секунду.

const MAX_LEN = 600;
const RATE_LIMIT = 5; // заявок з одного IP
const RATE_WINDOW = 600; // за 10 хв

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    const cors = corsHeaders(origin, env);

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (url.pathname === '/api/health') return json({ ok: true }, 200, cors);
    if (url.pathname !== '/api/lead') return json({ ok: false, error: 'not_found' }, 404, cors);
    if (request.method !== 'POST') return json({ ok: false, error: 'method' }, 405, cors);
    if (!cors['Access-Control-Allow-Origin']) return json({ ok: false, error: 'origin' }, 403, cors);

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ ok: false, error: 'bad_json' }, 400, cors);
    }

    // Боти: тихо кажемо «ок», але нічого не шлемо.
    if (body.website) return json({ ok: true }, 200, cors);
    if (typeof body.startedAt === 'number' && Date.now() - body.startedAt < 2500) return json({ ok: true }, 200, cors);

    const name = clean(body.name, 80);
    const phone = normalizePhone(body.phone);
    if (!name || !phone) return json({ ok: false, error: 'validation' }, 422, cors);

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (await overLimit(ip, ctx)) return json({ ok: false, error: 'rate_limited' }, 429, cors);

    const id = leadId();
    const text = formatLead(id, body, name, phone, request);
    const digits = phone.replace(/\D/g, '');
    const keyboard = {
      inline_keyboard: [[
        { text: '✈️ Telegram', url: `https://t.me/+${digits}` },
        { text: '💬 WhatsApp', url: `https://wa.me/${digits}` },
      ]],
    };

    const tg = await fetch(`https://api.telegram.org/bot${env.TG_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: env.TG_CHAT_ID,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        reply_markup: keyboard,
      }),
    });

    if (!tg.ok) {
      console.error('telegram', tg.status, await tg.text());
      return json({ ok: false, error: 'delivery' }, 502, cors);
    }
    return json({ ok: true, id }, 200, cors);
  },
};

function corsHeaders(origin, env) {
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim());
  const ok =
    allowed.includes(origin) ||
    (env.ALLOWED_ORIGIN_SUFFIX && origin.startsWith('https://') && origin.endsWith(env.ALLOWED_ORIGIN_SUFFIX)) ||
    origin === 'https://modern-estate-agency.pages.dev';
  const h = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
  if (ok) h['Access-Control-Allow-Origin'] = origin;
  return h;
}

function json(data, status, headers) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

function clean(v, max = MAX_LEN) {
  if (v == null) return '';
  return String(v).replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, max);
}

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function normalizePhone(v) {
  let d = String(v || '').replace(/\D/g, '');
  if (d.length === 10 && d.startsWith('0')) d = '38' + d;
  if (d.length === 9) d = '380' + d;
  if (d.length < 10 || d.length > 15) return '';
  if (d.startsWith('380') && d.length === 12) {
    return `+380 ${d.slice(3, 5)} ${d.slice(5, 8)} ${d.slice(8, 10)} ${d.slice(10)}`;
  }
  return '+' + d;
}

function leadId() {
  const now = new Date(Date.now() + 2 * 3600 * 1000); // ≈ Київ, для коду достатньо
  const p = (n) => String(n).padStart(2, '0');
  const rnd = Math.random().toString(36).slice(2, 4).toUpperCase();
  return `ME-${p(now.getUTCDate())}${p(now.getUTCMonth() + 1)}-${p(now.getUTCHours())}${p(now.getUTCMinutes())}-${rnd}`;
}

function tag(s) {
  return '#' + s.toLowerCase().replace(/[^a-zа-яіїєґ0-9]+/gi, '_').replace(/^_|_$/g, '');
}

function formatLead(id, body, name, phone, request) {
  const answers = body.answers && typeof body.answers === 'object' ? body.answers : {};
  const labels = body.labels && typeof body.labels === 'object' ? body.labels : {};
  const icons = { goal: '🎯', type: '🏠', location: '📍', budget: '💰', payment: '💳', timing: '⏱' };

  const lines = [`🔥 <b>Нова заявка з сайту</b>  ·  <code>${id}</code>`, ''];
  lines.push(`👤 <b>${esc(name)}</b>`);
  lines.push(`📞 ${esc(phone)}`);
  const contact = clean(body.contact, 40);
  if (contact) lines.push(`💬 Зв'язок: <b>${esc(contact)}</b>`);
  lines.push('');

  const tags = [];
  for (const [key, raw] of Object.entries(answers).slice(0, 12)) {
    const value = Array.isArray(raw) ? raw.map((x) => clean(x, 60)).filter(Boolean).join(', ') : clean(raw, 120);
    if (!value) continue;
    const label = clean(labels[key] || key, 40);
    lines.push(`${icons[key] || '▫️'} ${esc(label)}: <b>${esc(value)}</b>`);
    if (['goal', 'type', 'location'].includes(key)) {
      (Array.isArray(raw) ? raw : [raw]).slice(0, 4).forEach((x) => tags.push(tag(clean(x, 30))));
    }
  }

  const comment = clean(body.comment, 600);
  if (comment) lines.push('', `📝 ${esc(comment)}`);

  const meta = [];
  const source = clean(body.source, 160);
  if (source) meta.push(`Звідки: ${esc(source)}`);
  const utm = body.utm && typeof body.utm === 'object' ? body.utm : {};
  const utmStr = Object.entries(utm)
    .slice(0, 6)
    .map(([k, v]) => `${clean(k, 20)}=${clean(v, 60)}`)
    .join(' · ');
  if (utmStr) meta.push(`UTM: ${esc(utmStr)}`);
  const ref = clean(body.referrer, 160);
  if (ref) meta.push(`Реферер: ${esc(ref)}`);
  const cf = request.cf || {};
  const geo = [cf.city, cf.country].filter(Boolean).join(', ');
  if (geo) meta.push(`Гео: ${esc(geo)}`);
  if (meta.length) lines.push('', `<i>${meta.join('\n')}</i>`);

  if (tags.length) lines.push('', [...new Set(tags)].join(' '));
  return lines.join('\n').slice(0, 4000);
}

async function overLimit(ip, ctx) {
  try {
    const cache = caches.default;
    const key = new Request(`https://rate-limit.internal/lead/${encodeURIComponent(ip)}`);
    const hit = await cache.match(key);
    const count = hit ? parseInt(await hit.text(), 10) || 0 : 0;
    if (count >= RATE_LIMIT) return true;
    ctx.waitUntil(
      cache.put(key, new Response(String(count + 1), { headers: { 'Cache-Control': `max-age=${RATE_WINDOW}` } })),
    );
    return false;
  } catch {
    return false;
  }
}
