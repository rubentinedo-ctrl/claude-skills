// neon.js — piezas del estilo «Neón con mascota» para reels 9:16 (1080×1920).
// Fondo marino con rejilla y partículas, tarjetas de cristal con borde que brilla, títulos con píldora,
// mascota con halo, fotos con Ken Burns, subtítulos karaoke, destello entre escenas y firma final.
// Todo se dibuja en un canvas 2D; cada función recibe el contexto `c` y el tiempo `t` en segundos.

// ---------- paleta (cámbiala con paleta({...}) al principio de tu video.js) ----------
export const C = { bg: '#040B16', ink: '#F8FAFC', muted: '#8FA3B8', faint: 'rgba(248,250,252,0.36)', blue: '#47B3E3', cyan: '#22D3EE', bdark: '#1F7FAF',
  green: '#8EC640', red: '#F34242', yellow: '#FDDE19', claude: '#D97757', kw: '#C792EA', str: '#C3E88D', fn: '#82AAFF', num: '#F78C6C' };
export const paleta = o => Object.assign(C, o);
export const W = 1080, H = 1920, MONO = '"JetBrains Mono"';

// ---------- utilidades ----------
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, t) => a + (b - a) * t;
export const E = { out: t => 1 - Math.pow(1 - t, 3), inOut: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  back: t => { const k = 1.7; return 1 + (k + 1) * Math.pow(t - 1, 3) + k * Math.pow(t - 1, 2); } };
export const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
export const sm = p => { p = clamp(p); return p * p * p * (p * (p * 6 - 15) + 10); };    // suave (smootherstep)
export const ap = (t, at, d = 0.35) => clamp((t - at) / d);                                // progreso 0→1 desde «at» en «d» s
export const back = p => E.back(clamp(p));                                                // con rebote
export const out = p => E.out(clamp(p));
export const typed = (s, t, t0, cps = 26) => s.slice(0, Math.max(0, Math.min(s.length, Math.floor((t - t0) * cps))));  // texto que se teclea

// ---------- tiempos desde la voz (timing.js) ----------
export const norm = w => String(w).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
export function tiempos(SC) {
  const B = i => SC[i].start;
  // kw(escena, 'palabra', n) → segundo en que se dice la n-ésima palabra que empieza así en esa escena
  const kw = (i, word, n = 1) => { let c = 0; for (const w of SC[i].words) if (norm(w.w).startsWith(norm(word)) && ++c === n) return B(i) + w.s - (i ? 0 : B(i)); console.warn('kw: no encuentro', i, word); return B(i) + 0.5; };
  const WORDS = SC.flatMap((sc, i) => sc.words.map(w => ({ w: w.w, s: (i ? sc.start : 0) + w.s })));
  WORDS.forEach((w, i) => { w.e = i + 1 < WORDS.length ? Math.min(WORDS[i + 1].s, w.s + 0.6) : w.s + 0.6; });
  const VOEND = WORDS.length ? WORDS[WORDS.length - 1].e + 0.15 : 0;
  return { B, kw, WORDS, VOEND };
}

// ---------- texto ----------
export const font = (size, o = {}) => `${o.w || 800} ${size}px ${o.f || 'Inter'}`;
export function tx(c, s, x, y, size, o = {}) { c.save(); c.font = font(size, o); c.fillStyle = o.color || C.ink; c.textAlign = o.align || 'left'; c.textBaseline = 'alphabetic';
  if (o.alpha != null) c.globalAlpha *= o.alpha; if (o.glow) { c.shadowColor = o.glow; c.shadowBlur = o.gb || 24; } c.fillText(s, x, y); c.restore(); }
export function tw(c, s, size, o = {}) { c.save(); c.font = font(size, o); const w = c.measureText(s).width; c.restore(); return w; }

// título: líneas que suben; {s, c (color), pill (píldora), at (segundo en que entra)}
export function head(c, t, t0, lines, o = {}) { const size = o.size || 84, x = o.x ?? 540, al = o.align || 'center', lh = size * (o.lh || 1.24);
  lines.forEach((ln, i) => { const at = ln.at ?? (t0 + i * 0.12), p = ap(t, at, 0.45); if (p <= 0) return; const y = o.y + i * lh;
    c.save(); c.globalAlpha *= clamp(p * 1.5); c.translate(0, (1 - out(p)) * 34);
    if (ln.pill) { const w = tw(c, ln.s, size) + 52, px = al === 'center' ? x - w / 2 : x - 10, e = back(p);
      c.save(); c.translate(px + w / 2, y - size * 0.35); c.scale(e, e); c.shadowColor = rgba(ln.c || C.blue, 0.85); c.shadowBlur = 44; c.fillStyle = ln.c || C.blue; c.beginPath(); c.roundRect(-w / 2, -size * 0.68, w, size * 1.36, 24); c.fill(); c.restore();
      tx(c, ln.s, px + 26, y, size, { color: C.bg }); }
    else tx(c, ln.s, x, y, size, { align: al, color: ln.c || C.ink, glow: ln.c ? rgba(ln.c, 0.7) : 'rgba(0,0,0,0.5)', gb: ln.c ? 30 : 18 });
    c.restore(); }); }

// ---------- piezas ----------
export function glass(c, x, y, w, h, o = {}) { const r = o.r ?? 28;
  c.save(); c.shadowColor = rgba(C.blue, o.glow ?? 0.28); c.shadowBlur = o.gb ?? 46; c.fillStyle = o.fill || 'rgba(9,24,44,0.88)'; c.beginPath(); c.roundRect(x, y, w, h, r); c.fill(); c.restore();
  c.save(); const g = c.createLinearGradient(x, y, x, y + h), sa = o.sa ?? 0.7; g.addColorStop(0, rgba(o.col || C.blue, sa)); g.addColorStop(1, rgba(o.col || C.blue, sa * 0.25));
  c.strokeStyle = g; c.lineWidth = o.lw || 2.5; c.beginPath(); c.roundRect(x, y, w, h, r); c.stroke(); c.restore(); }
export function pop(c, x, y, p, fn) { if (p <= 0) return; const e = back(p); c.save(); c.translate(x, y); c.scale(e, e); c.globalAlpha *= clamp(p * 2); fn(c); c.restore(); }
export function rise(c, p, dy, fn) { if (p <= 0) return; c.save(); c.globalAlpha *= clamp(p * 1.6); c.translate(0, (1 - out(p)) * dy); fn(c); c.restore(); }
export function check(c, x, y, r, p, col = C.green) { pop(c, x, y, p, c2 => { c2.save(); c2.shadowColor = rgba(col, 0.8); c2.shadowBlur = 16; c2.fillStyle = col; c2.beginPath(); c2.arc(0, 0, r, 0, 7); c2.fill(); c2.restore();
  c2.strokeStyle = C.bg; c2.lineWidth = r * 0.24; c2.lineCap = c2.lineJoin = 'round'; c2.beginPath(); c2.moveTo(-r * 0.42, 0); c2.lineTo(-r * 0.1, r * 0.32); c2.lineTo(r * 0.44, -r * 0.3); c2.stroke(); }); }
export function pill(c, x, y, s, size, o = {}) { const w = tw(c, s, size, o) + (o.pad ?? 44), h = size * 1.75; c.save();
  if (o.fill !== false) { c.shadowColor = rgba(o.col || C.blue, 0.7); c.shadowBlur = 30; c.fillStyle = o.col || C.blue; c.beginPath(); c.roundRect(x - w / 2, y - h / 2, w, h, h / 2); c.fill(); }
  else glass(c, x - w / 2, y - h / 2, w, h, { r: h / 2, gb: 20 });
  c.restore(); tx(c, s, x, y + size * 0.36, size, { ...o, align: 'center', color: o.color || (o.fill === false ? C.ink : C.bg) }); return w; }
// foto que llena un rectángulo (z = zoom para Ken Burns, ox/oy = desplazamiento, r = esquinas)
export function cover(c, img, x, y, w, h, z = 1, ox = 0, oy = 0, r = 0) { if (!img) return; const s = Math.max(w / img.width, h / img.height) * z, iw = img.width * s, ih = img.height * s;
  c.save(); c.beginPath(); r ? c.roundRect(x, y, w, h, r) : c.rect(x, y, w, h); c.clip(); c.drawImage(img, x + (w - iw) / 2 + ox, y + (h - ih) / 2 + oy, iw, ih); c.restore(); }
// mascota (PNG recortado): aparece con rebote, flota y tiene halo. o.right: pegada al borde derecho (pose «se asoma»).
export function mascota(c, K, src, x, y, h, p, t, o = {}) { const img = K.images[src]; if (!img || p <= 0) return; const w = h * img.width / img.height;
  if (o.right) x = W - w / 2 + 6; const e = o.slide ? 1 : back(p), fl = o.still ? 0 : Math.sin(t * 2.3 + (o.ph || 0)) * 9;
  c.save(); c.globalAlpha *= clamp(p * 2); c.translate(x + (o.slide ? (1 - out(p)) * o.slide : 0), y + fl); c.scale(e, e);
  if (!o.noGlow) { const g = c.createRadialGradient(0, h * 0.5, 0, 0, h * 0.5, h * 0.34); g.addColorStop(0, rgba(C.cyan, 0.6)); g.addColorStop(1, rgba(C.cyan, 0)); c.fillStyle = g; c.beginPath(); c.ellipse(0, h * 0.52, h * 0.34, h * 0.09, 0, 0, 7); c.fill(); }
  c.shadowColor = rgba(C.blue, 0.7); c.shadowBlur = 38; c.drawImage(img, -w / 2, -h / 2, w, h); c.restore(); }
export function ring(c, x, y, r, t, col = C.cyan) { c.save(); c.strokeStyle = col; c.lineWidth = r * 0.28; c.lineCap = 'round'; c.beginPath(); c.arc(x, y, r, t * 7, t * 7 + 4.2); c.stroke(); c.restore(); }   // «cargando»
export function linkIcon(c, x, y, s, col) { c.save(); c.strokeStyle = col; c.lineWidth = s * 0.14; c.lineCap = 'round'; c.translate(x, y); c.rotate(-Math.PI / 4);
  c.beginPath(); c.roundRect(-s * 0.55, -s * 0.2, s * 0.6, s * 0.4, s * 0.2); c.stroke(); c.beginPath(); c.roundRect(-s * 0.05, -s * 0.2, s * 0.6, s * 0.4, s * 0.2); c.stroke(); c.restore(); }
export function star(c, x, y, r, col) { c.save(); c.fillStyle = col; c.translate(x, y); c.beginPath(); for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8, rr = i % 2 ? r * 0.32 : r; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } c.closePath(); c.fill(); c.restore(); }
// ventana tipo macOS (terminal, editor…): devuelve la y donde empieza el contenido
export function ventana(c, x, y, w, h, titulo, o = {}) { glass(c, x, y, w, h, { fill: o.fill || 'rgba(5,13,25,0.96)', r: 24, ...o });
  [C.red, C.yellow, C.green].forEach((col, i) => { c.fillStyle = col; c.beginPath(); c.arc(x + 40 + i * 30, y + 36, 9, 0, 7); c.fill(); });
  tx(c, titulo, x + w / 2, y + 45, 22, { f: MONO, w: 500, align: 'center', color: C.muted }); c.fillStyle = rgba(C.blue, 0.15); c.fillRect(x + 2, y + 70, w - 4, 2); return y + 74; }
// móvil con una foto dentro y barra de progreso
export function movil(c, K, src, x, y, w, h, t, prog = 0, label = '') {
  c.save(); c.shadowColor = rgba(C.cyan, 0.7); c.shadowBlur = 50; c.fillStyle = '#000'; c.beginPath(); c.roundRect(x - 12, y - 12, w + 24, h + 24, 46); c.fill(); c.restore();
  cover(c, K.images[src], x, y, w, h, 1.25 + 0.05 * Math.sin(t * 0.5), 0, 0, 36); c.fillStyle = 'rgba(4,11,22,0.25)'; c.beginPath(); c.roundRect(x, y, w, h, 36); c.fill();
  if (label) tx(c, label, x + w / 2, y + 100, 34, { align: 'center', glow: rgba(C.cyan, 0.9), gb: 30 });
  c.fillStyle = 'rgba(255,255,255,0.3)'; c.fillRect(x + 24, y + h - 40, w - 48, 6); c.fillStyle = C.cyan; c.fillRect(x + 24, y + h - 40, (w - 48) * clamp(prog), 6); }

// ---------- fondo ----------
const PART = Array.from({ length: 70 }, (_, i) => ({ x: (i * 397) % W, y: (i * 733) % H, s: 1 + (i % 3), v: 8 + (i % 5) * 7, ph: i * 1.3 }));
export function fondo(c, t) { c.fillStyle = C.bg; c.fillRect(0, 0, W, H);
  let g = c.createRadialGradient(540 + Math.sin(t * 0.4) * 140, 860, 0, 540, 860, 950); g.addColorStop(0, rgba(C.bdark, 0.42)); g.addColorStop(0.5, rgba(C.bdark, 0.1)); g.addColorStop(1, rgba(C.bg, 0)); c.fillStyle = g; c.fillRect(0, 0, W, H);
  c.save(); c.strokeStyle = rgba(C.blue, 0.06); c.lineWidth = 1; const off = (t * 14) % 60; c.beginPath();
  for (let x = 0; x <= W; x += 60) { c.moveTo(x + 0.5, 0); c.lineTo(x + 0.5, H); } for (let y = -60 + off; y <= H; y += 60) { c.moveTo(0, y); c.lineTo(W, y); } c.stroke(); c.restore();
  for (const p of PART) { const y = ((p.y - t * p.v) % H + H) % H, a = 0.3 + 0.3 * Math.sin(t * 2 + p.ph); c.fillStyle = rgba(C.cyan, a * 0.55); c.beginPath(); c.arc(p.x, y, p.s, 0, 7); c.fill(); }
  g = c.createRadialGradient(540, 960, 520, 540, 960, 1250); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.6)'); c.fillStyle = g; c.fillRect(0, 0, W, H); }
// oscurece una foto a pantalla completa para que el texto se lea arriba y abajo
export function velo(c, fuerte = 1) { const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, `rgba(4,11,22,${0.9 * fuerte})`); g.addColorStop(0.3, `rgba(4,11,22,${0.35 * fuerte})`); g.addColorStop(0.62, `rgba(4,11,22,${0.4 * fuerte})`); g.addColorStop(1, 'rgba(4,11,22,0.95)'); c.fillStyle = g; c.fillRect(0, 0, W, H); }

// ---------- montaje: una escena por frase, con empuje de zoom al entrar y fundido al salir ----------
// SCN = [[inicio, fn(c, t, K)], …]  (ordenadas). END = duración total.
export function escenas(c, t, K, SCN, END) {
  for (let i = 0; i < SCN.length; i++) { const a = SCN[i][0], b = i + 1 < SCN.length ? SCN[i + 1][0] : END + 1; if (t < a || t >= b) continue;
    const lt = t - a, dur = b - a, fin = i + 1 < SCN.length ? 1 - clamp((t - (b - 0.12)) / 0.12) : 1, z = 1 + 0.07 * (1 - out(lt / 0.55)) + 0.025 * Math.min(1, lt / dur);
    c.save(); c.globalAlpha *= fin; c.translate(540, 960); c.scale(z, z); c.translate(-540, -960); SCN[i][1](c, t, K); c.restore(); } }
// destello de luz en cada cambio de escena (y donde quieras)
export function destellos(c, t, times) { for (const tb of times) { const d = t - tb; if (d < -0.1 || d > 0.55) continue; const f = d < 0 ? 1 + d / 0.1 : Math.exp(-d * 7);
  c.save(); c.globalCompositeOperation = 'lighter'; const g = c.createRadialGradient(540, 900, 0, 540, 900, 1150); g.addColorStop(0, rgba('#FFFFFF', 0.8 * f)); g.addColorStop(0.25, rgba(C.cyan, 0.5 * f)); g.addColorStop(0.7, rgba(C.bdark, 0.16 * f)); g.addColorStop(1, 'rgba(0,0,0,0)');
  c.fillStyle = g; c.fillRect(0, 0, W, H); c.restore(); } }

// ---------- subtítulos karaoke: hasta 3 palabras, la que suena en píldora azul ----------
export const limpia = w => w.replace(/[.,:;!?¿¡«»"]/g, '');
export function karaoke(WORDS, o = {}) { const y = o.y ?? 1590, size = o.size ?? 56, maxW = o.maxWords ?? 3, maxC = o.maxChars ?? 17;
  const ch = []; let cur = [];
  WORDS.forEach((w, i) => { cur.push(w); const nx = WORDS[i + 1], len = cur.map(q => limpia(q.w)).join(' ').length;
    if (!nx || /[.,?:!]$/.test(w.w) || cur.length >= maxW || len > maxC || nx.s - w.e > 0.35) { ch.push(cur); cur = []; } });
  const CH = ch.map((ws, i) => ({ ws, a: ws[0].s - 0.04, b: i + 1 < ch.length ? Math.min(ch[i + 1][0].s - 0.04, ws[ws.length - 1].e + 0.45) : ws[ws.length - 1].e + 0.6 }));
  return (c, t) => { const k = CH.find(q => t >= q.a && t < q.b); if (!k) return; const sp = tw(c, ' ', size) + 22;
    const ws = k.ws.map(q => tw(c, limpia(q.w), size)), total = ws.reduce((s, w) => s + w, 0) + sp * (k.ws.length - 1), p = ap(t, k.a, 0.1), sc = 0.9 + 0.1 * back(ap(t, k.a, 0.2));
    c.save(); c.globalAlpha *= p; c.translate(540, y); c.scale(sc, sc); c.translate(-540, -y); let x = 540 - total / 2;
    k.ws.forEach((q, i) => { const nx = k.ws[i + 1], on = t >= q.s - 0.03, now = on && (!nx || t < nx.s - 0.03);
      if (now) { c.save(); c.shadowColor = rgba(C.blue, 0.9); c.shadowBlur = 30; c.fillStyle = C.blue; c.beginPath(); c.roundRect(x - 14, y - 52, ws[i] + 28, 72, 16); c.fill(); c.restore(); tx(c, limpia(q.w), x, y, size, { color: C.bg }); }
      else tx(c, limpia(q.w), x, y, size, { color: on ? C.ink : C.faint, glow: 'rgba(0,0,0,0.7)', gb: 16 });
      x += ws[i] + sp; }); c.restore(); }; }

// ---------- firma final: foto, nombre, @usuario, lema y logo ----------
// f = { foto: 'ruta.png', nombre, usuario, lema, logo: 'ruta.png', logoTexto: 'Fundador de' }
export function firma(c, t, K, at, f) { const pe = ap(t, at, 0.5); if (pe <= 0) return; const av = f.foto && K.images[f.foto];
  c.save(); c.globalAlpha *= pe;
  pop(c, 540, 700, pe, c2 => { c2.save(); c2.shadowColor = C.cyan; c2.shadowBlur = 50; c2.strokeStyle = C.cyan; c2.lineWidth = 8; c2.beginPath(); c2.arc(0, 0, 150, 0, 7); c2.stroke(); c2.restore();
    if (av) { c2.save(); c2.beginPath(); c2.arc(0, 0, 144, 0, 7); c2.clip(); const s = 288 / Math.min(av.width, av.height); c2.drawImage(av, -av.width * s / 2, -av.height * s / 2, av.width * s, av.height * s); c2.restore(); } });
  rise(c, ap(t, at + 0.2, 0.45), 30, c2 => { tx(c2, f.nombre || '', 540, 960, 76, { align: 'center' }); if (f.usuario) pill(c2, 540, 1040, f.usuario, 34, { f: MONO, w: 500, fill: false, color: C.cyan });
    if (f.lema) tx(c2, f.lema, 540, 1150, 34, { w: 500, align: 'center', color: C.muted }); });
  rise(c, ap(t, at + 0.5, 0.45), 30, c2 => { if (f.logoTexto) tx(c2, f.logoTexto, 540, 1290, 28, { w: 500, align: 'center', color: C.muted }); const lg = f.logo && K.images[f.logo];
    if (lg) { const w = 330, h = w * lg.height / lg.width; c2.drawImage(lg, 540 - w / 2, 1320, w, h); } });
  c.restore(); }
export function marcaAgua(c, s) { if (s) tx(c, s, 540, 1860, 22, { f: MONO, w: 500, align: 'center', color: 'rgba(143,163,184,0.45)' }); }
