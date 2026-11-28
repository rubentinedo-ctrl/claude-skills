// neon.js — piezas del estilo «neón» para reels 9:16 (1080×1920).
// Fondo marino con rejilla y partículas, tarjetas de cristal con borde que brilla, títulos con píldora,
// iconos, números, listas, comparativas, gráficas, chats, fotos con Ken Burns, subtítulos karaoke,
// destello entre escenas y firma final. La mascota es opcional (solo si el usuario trae la suya).
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
  // kw(escena, 'palabra', n) → segundo en que se dice la n-ésima vez esa palabra en esa escena (sin tildes ni mayúsculas:
  // 'despues' encuentra «después»). Busca primero la palabra exacta; si no está, la que empieza así («explica» → «explicas»).
  const at = (i, w) => B(i) + w.s - (i ? 0 : B(i));
  const kw = (i, word, n = 1) => { const q = norm(word); for (const exact of [true, false]) { let c = 0;
      for (const w of SC[i].words) if ((exact ? norm(w.w) === q : norm(w.w).startsWith(q)) && ++c === n) { if (!exact) console.warn(`kw: «${word}» no está tal cual en la escena ${i}; uso «${w.w}»`); return at(i, w); } }
    console.warn('kw: no encuentro', i, word); return B(i) + 0.5; };
  const WORDS = SC.flatMap((sc, i) => sc.words.map(w => ({ w: w.w, s: (i ? sc.start : 0) + w.s, fin: i + 1 < SC.length ? SC[i + 1].start : Infinity })));
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
// check verde: col es el color del círculo; la marca va en color de fondo, salvo que pases marca: '#hex' (p. ej. sobre una píldora verde).
export function check(c, x, y, r, p, col = C.green, marca = C.bg) { pop(c, x, y, p, c2 => { c2.save(); c2.shadowColor = rgba(col, 0.8); c2.shadowBlur = 16; c2.fillStyle = col; c2.beginPath(); c2.arc(0, 0, r, 0, 7); c2.fill(); c2.restore();
  c2.strokeStyle = marca; c2.lineWidth = r * 0.24; c2.lineCap = c2.lineJoin = 'round'; c2.beginPath(); c2.moveTo(-r * 0.42, 0); c2.lineTo(-r * 0.1, r * 0.32); c2.lineTo(r * 0.44, -r * 0.3); c2.stroke(); }); }
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
// Sin foto (src = null) la pantalla queda marina; contenido(c, x, y, w, h) dibuja lo que quieras dentro (recortado a la pantalla).
export function movil(c, K, src, x, y, w, h, t, prog = 0, label = '', contenido = null) {
  c.save(); c.shadowColor = rgba(C.cyan, 0.7); c.shadowBlur = 50; c.fillStyle = '#000'; c.beginPath(); c.roundRect(x - 12, y - 12, w + 24, h + 24, 46); c.fill(); c.restore();
  const img = src && K.images[src];
  if (img) { cover(c, img, x, y, w, h, 1.25 + 0.05 * Math.sin(t * 0.5), 0, 0, 36); c.fillStyle = 'rgba(4,11,22,0.25)'; c.beginPath(); c.roundRect(x, y, w, h, 36); c.fill(); }
  else { const g = c.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, '#0B1C33'); g.addColorStop(1, '#06101F'); c.fillStyle = g; c.beginPath(); c.roundRect(x, y, w, h, 36); c.fill(); }
  if (contenido) { c.save(); c.beginPath(); c.roundRect(x, y, w, h, 36); c.clip(); contenido(c, x, y, w, h); c.restore(); }
  if (prog <= 0 && !label) return;
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
// centro: oscuridad de la parte central (0,35 por defecto); súbela (0,6–0,7) si la foto tiene zonas claras y hay texto encima.
export function velo(c, fuerte = 1, centro = 0.35) { const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, `rgba(4,11,22,${0.9 * fuerte})`); g.addColorStop(0.3, `rgba(4,11,22,${centro * fuerte})`); g.addColorStop(0.62, `rgba(4,11,22,${(centro + 0.05) * fuerte})`); g.addColorStop(1, 'rgba(4,11,22,0.95)'); c.fillStyle = g; c.fillRect(0, 0, W, H); }

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
    if (!nx || /[.,?:!]$/.test(w.w) || cur.length >= maxW || len > maxC || nx.s - w.e > 0.35 || nx.fin !== w.fin) { ch.push(cur); cur = []; } });
  // cada bloque se apaga antes del cambio de escena, para que no quede sobre el destello de la siguiente
  const CH = ch.map((ws, i) => ({ ws, a: ws[0].s - 0.04, b: Math.min(i + 1 < ch.length ? Math.min(ch[i + 1][0].s - 0.04, ws[ws.length - 1].e + 0.45) : ws[ws.length - 1].e + 0.6, (ws[0].fin ?? Infinity) - 0.12) }));
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

// =====================================================================================================
// PIEZAS GENÉRICAS (sirven para cualquier tema; no necesitan mascota ni fotos)
// =====================================================================================================

// ---------- texto en varias líneas ----------
export function envolver(c, s, maxW, size, o = {}) { const out = []; let cur = '';
  for (const w of String(s).split(/\s+/)) { const tryS = cur ? cur + ' ' + w : w; if (cur && tw(c, tryS, size, o) > maxW) { out.push(cur); cur = w; } else cur = tryS; }
  if (cur) out.push(cur); return out; }
// párrafo ajustado a maxW; devuelve el alto usado
export function parrafo(c, s, x, y, maxW, size, o = {}) { const L = envolver(c, s, maxW, size, o), lh = size * (o.lh || 1.3);
  L.forEach((l, i) => tx(c, l, x, y + i * lh, size, o)); return L.length * lh; }

// ---------- iconos de línea: icono(c, 'nombre', x, y, tamaño, {col, lw, disco, p}) ----------
// disco: true dibuja un círculo de cristal detrás · p: progreso de aparición (con rebote) · moneda: '€' para el icono dinero
const ICONOS = {
  check: c => { c.beginPath(); c.moveTo(-0.55, 0.02); c.lineTo(-0.15, 0.42); c.lineTo(0.6, -0.42); c.stroke(); },
  x: c => { c.beginPath(); c.moveTo(-0.45, -0.45); c.lineTo(0.45, 0.45); c.moveTo(0.45, -0.45); c.lineTo(-0.45, 0.45); c.stroke(); },
  alerta: c => { c.beginPath(); c.moveTo(0, -0.75); c.lineTo(0.8, 0.65); c.lineTo(-0.8, 0.65); c.closePath(); c.stroke(); c.beginPath(); c.moveTo(0, -0.22); c.lineTo(0, 0.2); c.stroke(); c.beginPath(); c.arc(0, 0.42, 0.05, 0, 7); c.stroke(); },
  reloj: c => { c.beginPath(); c.arc(0, 0, 0.78, 0, 7); c.stroke(); c.beginPath(); c.moveTo(0, -0.45); c.lineTo(0, 0); c.lineTo(0.32, 0.2); c.stroke(); },
  usuario: c => { c.beginPath(); c.arc(0, -0.32, 0.32, 0, 7); c.stroke(); c.beginPath(); c.moveTo(-0.7, 0.8); c.quadraticCurveTo(-0.7, 0.12, 0, 0.12); c.quadraticCurveTo(0.7, 0.12, 0.7, 0.8); c.stroke(); },
  grupo: c => { c.beginPath(); c.arc(-0.3, -0.25, 0.26, 0, 7); c.stroke(); c.beginPath(); c.moveTo(-0.85, 0.72); c.quadraticCurveTo(-0.85, 0.12, -0.3, 0.12); c.quadraticCurveTo(0.25, 0.12, 0.25, 0.72); c.stroke();
    c.beginPath(); c.arc(0.42, -0.38, 0.22, 0, 7); c.stroke(); c.beginPath(); c.moveTo(0.42, -0.04); c.quadraticCurveTo(0.88, -0.04, 0.88, 0.5); c.stroke(); },
  chat: c => { c.beginPath(); c.roundRect(-0.8, -0.65, 1.6, 1.1, 0.3); c.stroke(); c.beginPath(); c.moveTo(-0.35, 0.45); c.lineTo(-0.55, 0.8); c.lineTo(-0.05, 0.45); c.stroke(); [-0.38, 0, 0.38].forEach(x => { c.beginPath(); c.arc(x, -0.1, 0.06, 0, 7); c.fill(); }); },
  movil: c => { c.beginPath(); c.roundRect(-0.48, -0.85, 0.96, 1.7, 0.18); c.stroke(); c.beginPath(); c.moveTo(-0.14, 0.6); c.lineTo(0.14, 0.6); c.stroke(); },
  calendario: c => { c.beginPath(); c.roundRect(-0.78, -0.6, 1.56, 1.4, 0.15); c.stroke(); c.beginPath(); c.moveTo(-0.78, -0.2); c.lineTo(0.78, -0.2); c.moveTo(-0.4, -0.8); c.lineTo(-0.4, -0.45); c.moveTo(0.4, -0.8); c.lineTo(0.4, -0.45); c.stroke();
    for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) { c.beginPath(); c.arc(-0.42 + i * 0.42, 0.12 + j * 0.36, 0.06, 0, 7); c.fill(); } },
  grafica: c => { c.beginPath(); c.moveTo(-0.8, -0.8); c.lineTo(-0.8, 0.8); c.lineTo(0.85, 0.8); c.stroke(); c.beginPath(); c.moveTo(-0.55, 0.45); c.lineTo(-0.15, 0.05); c.lineTo(0.15, 0.3); c.lineTo(0.7, -0.4); c.stroke();
    c.beginPath(); c.moveTo(0.38, -0.42); c.lineTo(0.72, -0.42); c.lineTo(0.72, -0.08); c.stroke(); },
  dinero: (c, u) => { c.beginPath(); c.arc(0, 0, 0.78, 0, 7); c.stroke(); c.save(); c.scale(1 / u, 1 / u); c.shadowBlur = 0; c.font = `800 ${1.05 * u}px Inter`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(c.dinero || '$', 0, 0.06 * u); c.restore(); },
  estrella: c => { c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 0.36 : 0.85; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); c.stroke(); },
  corazon: c => { c.beginPath(); c.moveTo(0, 0.75); c.bezierCurveTo(-1.1, 0, -0.75, -0.95, 0, -0.35); c.bezierCurveTo(0.75, -0.95, 1.1, 0, 0, 0.75); c.stroke(); },
  play: c => { c.beginPath(); c.arc(0, 0, 0.8, 0, 7); c.stroke(); c.beginPath(); c.moveTo(-0.22, -0.38); c.lineTo(0.42, 0); c.lineTo(-0.22, 0.38); c.closePath(); c.fill(); },
  camara: c => { c.beginPath(); c.roundRect(-0.85, -0.45, 1.15, 0.9, 0.15); c.stroke(); c.beginPath(); c.moveTo(0.3, -0.12); c.lineTo(0.85, -0.42); c.lineTo(0.85, 0.42); c.lineTo(0.3, 0.12); c.stroke(); },
  mundo: c => { c.beginPath(); c.arc(0, 0, 0.8, 0, 7); c.stroke(); c.beginPath(); c.ellipse(0, 0, 0.34, 0.8, 0, 0, 7); c.moveTo(-0.8, 0); c.lineTo(0.8, 0); c.stroke(); },
  idea: c => { c.beginPath(); c.arc(0, -0.22, 0.55, Math.PI * 0.8, Math.PI * 2.2); c.lineTo(0.24, 0.5); c.lineTo(-0.24, 0.5); c.closePath(); c.stroke(); c.beginPath(); c.moveTo(-0.2, 0.72); c.lineTo(0.2, 0.72); c.stroke(); },
  escudo: c => { c.beginPath(); c.moveTo(0, -0.85); c.lineTo(0.72, -0.55); c.quadraticCurveTo(0.7, 0.45, 0, 0.88); c.quadraticCurveTo(-0.7, 0.45, -0.72, -0.55); c.closePath(); c.stroke();
    c.beginPath(); c.moveTo(-0.3, 0); c.lineTo(-0.06, 0.25); c.lineTo(0.34, -0.22); c.stroke(); },
  rayo: c => { c.beginPath(); c.moveTo(0.15, -0.9); c.lineTo(-0.5, 0.12); c.lineTo(0, 0.12); c.lineTo(-0.15, 0.9); c.lineTo(0.5, -0.12); c.lineTo(0, -0.12); c.closePath(); c.stroke(); },
  documento: c => { c.beginPath(); c.moveTo(-0.6, -0.85); c.lineTo(0.25, -0.85); c.lineTo(0.62, -0.48); c.lineTo(0.62, 0.85); c.lineTo(-0.6, 0.85); c.closePath(); c.stroke();
    c.beginPath(); [-0.25, 0.1, 0.45].forEach(y => { c.moveTo(-0.32, y); c.lineTo(0.34, y); }); c.stroke(); },
  lupa: c => { c.beginPath(); c.arc(-0.15, -0.15, 0.55, 0, 7); c.stroke(); c.beginPath(); c.moveTo(0.25, 0.25); c.lineTo(0.78, 0.78); c.stroke(); },
  carrito: c => { c.beginPath(); c.moveTo(-0.9, -0.65); c.lineTo(-0.6, -0.65); c.lineTo(-0.35, 0.35); c.lineTo(0.6, 0.35); c.lineTo(0.8, -0.35); c.lineTo(-0.5, -0.35); c.stroke();
    [-0.25, 0.5].forEach(x => { c.beginPath(); c.arc(x, 0.65, 0.1, 0, 7); c.stroke(); }); },
  ubicacion: c => { c.beginPath(); c.moveTo(0, 0.9); c.bezierCurveTo(-0.95, -0.1, -0.6, -0.9, 0, -0.9); c.bezierCurveTo(0.6, -0.9, 0.95, -0.1, 0, 0.9); c.stroke(); c.beginPath(); c.arc(0, -0.3, 0.22, 0, 7); c.stroke(); },
  megafono: c => { c.beginPath(); c.moveTo(-0.75, -0.25); c.lineTo(-0.25, -0.25); c.lineTo(0.65, -0.75); c.lineTo(0.65, 0.75); c.lineTo(-0.25, 0.25); c.lineTo(-0.75, 0.25); c.closePath(); c.stroke();
    c.beginPath(); c.moveTo(-0.45, 0.25); c.lineTo(-0.3, 0.75); c.stroke(); },
  diente: c => { c.beginPath(); c.moveTo(-0.55, -0.7); c.bezierCurveTo(-0.85, -0.6, -0.8, 0.0, -0.55, 0.2); c.lineTo(-0.38, 0.8); c.quadraticCurveTo(-0.25, 0.92, -0.15, 0.75); c.lineTo(0, 0.2);
    c.lineTo(0.15, 0.75); c.quadraticCurveTo(0.25, 0.92, 0.38, 0.8); c.lineTo(0.55, 0.2); c.bezierCurveTo(0.8, 0.0, 0.85, -0.6, 0.55, -0.7); c.quadraticCurveTo(0.25, -0.82, 0, -0.62); c.quadraticCurveTo(-0.25, -0.82, -0.55, -0.7); c.stroke(); },
  casa: c => { c.beginPath(); c.moveTo(-0.85, -0.02); c.lineTo(0, -0.8); c.lineTo(0.85, -0.02); c.moveTo(-0.62, -0.22); c.lineTo(-0.62, 0.8); c.lineTo(0.62, 0.8); c.lineTo(0.62, -0.22); c.stroke();
    c.beginPath(); c.roundRect(-0.18, 0.3, 0.36, 0.5, 0.06); c.stroke(); },
  cubiertos: c => { c.beginPath(); c.moveTo(-0.4, -0.85); c.lineTo(-0.4, 0.85); [-0.62, -0.18].forEach(x => { c.moveTo(x, -0.85); c.lineTo(x, -0.3); }); c.moveTo(-0.62, -0.3); c.quadraticCurveTo(-0.4, -0.05, -0.18, -0.3); c.stroke();
    c.beginPath(); c.moveTo(0.42, 0.85); c.lineTo(0.42, -0.85); c.quadraticCurveTo(0.78, -0.5, 0.7, 0.05); c.lineTo(0.42, 0.05); c.stroke(); },
  pesa: c => { c.beginPath(); c.moveTo(-0.45, 0); c.lineTo(0.45, 0); c.stroke(); [-1, 1].forEach(d => { c.beginPath(); c.roundRect(d * 0.45 - (d > 0 ? 0 : 0.22), -0.5, 0.22, 1, 0.06); c.roundRect(d * 0.67 - (d > 0 ? 0 : 0.18), -0.3, 0.18, 0.6, 0.05); c.stroke(); }); },
  maletin: c => { c.beginPath(); c.roundRect(-0.85, -0.4, 1.7, 1.2, 0.15); c.stroke(); c.beginPath(); c.moveTo(-0.3, -0.4); c.lineTo(-0.3, -0.7); c.lineTo(0.3, -0.7); c.lineTo(0.3, -0.4); c.moveTo(-0.85, 0.1); c.lineTo(0.85, 0.1); c.stroke(); },
  ojo: c => { c.beginPath(); c.moveTo(-0.9, 0); c.quadraticCurveTo(0, -0.85, 0.9, 0); c.quadraticCurveTo(0, 0.85, -0.9, 0); c.stroke(); c.beginPath(); c.arc(0, 0, 0.26, 0, 7); c.fill(); },
  enlace: c => { c.rotate(-Math.PI / 4); c.beginPath(); c.roundRect(-0.85, -0.3, 0.95, 0.6, 0.3); c.stroke(); c.beginPath(); c.roundRect(-0.1, -0.3, 0.95, 0.6, 0.3); c.stroke(); },
};
export const NOMBRES_ICONOS = Object.keys(ICONOS);
export function icono(c, nombre, x, y, s, o = {}) { const f = ICONOS[nombre]; if (!f) { console.warn('icono desconocido:', nombre, '· usa uno de', NOMBRES_ICONOS.join(', ')); return; }
  const col = o.col || C.cyan, p = o.p ?? 1; if (p <= 0) return;
  c.save(); c.translate(x, y); const e = o.p != null ? back(p) : 1; c.scale(e, e); c.globalAlpha *= clamp(p * 2);
  if (o.disco) { c.save(); c.shadowColor = rgba(col, 0.6); c.shadowBlur = s * 0.5; c.fillStyle = 'rgba(9,24,44,0.92)'; c.beginPath(); c.arc(0, 0, s * 0.82, 0, 7); c.fill(); c.restore();
    c.strokeStyle = rgba(col, 0.7); c.lineWidth = 3; c.beginPath(); c.arc(0, 0, s * 0.82, 0, 7); c.stroke(); s *= 0.95; }
  const u = s / 2; c.scale(u, u); c.strokeStyle = c.fillStyle = col; c.lineWidth = (o.lw || 0.13); c.lineCap = c.lineJoin = 'round';
  c.shadowColor = rgba(col, 0.75); c.shadowBlur = 14; c.dinero = o.moneda; f(c, u); c.restore(); }

// ---------- ✕ roja que se dibuja (para tachar lo que está mal) ----------
export function xmark(c, x, y, s, p, col = C.red) { if (p <= 0) return; const a = clamp(p * 2), b = clamp(p * 2 - 1), sh = p < 0.6 ? Math.sin(p * 60) * 6 * (1 - p) : 0;
  c.save(); c.translate(x + sh, y); c.strokeStyle = col; c.lineWidth = s * 0.16; c.lineCap = 'round'; c.shadowColor = rgba(col, 0.9); c.shadowBlur = 24; const h = s / 2;
  c.beginPath(); c.moveTo(-h, -h); c.lineTo(-h + 2 * h * a, -h + 2 * h * a); if (b > 0) { c.moveTo(h, -h); c.lineTo(h - 2 * h * b, -h + 2 * h * b); } c.stroke(); c.restore(); }

// ---------- número grande con anillo que se llena y cuenta: numero(c, t, x, y, r, 24, at, {sufijo:'h', label:'ABIERTO', dur}) ----------
// Solo cifras que el usuario haya dado o que estén en una fuente: nunca inventes números.
export function numero(c, t, x, y, r, valor, at, o = {}) { const p = ap(t, at, o.dur || 1.0); if (t < at - 0.3) return; const col = o.col || C.cyan, e = sm(p);
  c.save(); c.globalAlpha *= clamp((t - at + 0.3) / 0.3);
  c.strokeStyle = rgba(col, 0.14); c.lineWidth = r * 0.12; c.beginPath(); c.arc(x, y, r, 0, 7); c.stroke();
  c.save(); c.strokeStyle = col; c.lineCap = 'round'; c.shadowColor = col; c.shadowBlur = 30; c.lineWidth = r * 0.12; c.beginPath(); c.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (o.parte ?? 1) * e); c.stroke(); c.restore();
  const v = o.decimales ? (valor * e).toFixed(o.decimales) : Math.round(valor * e), s = (o.prefijo || '') + v + (o.sufijo || '');
  tx(c, s, x, y + r * 0.2, r * (s.length > 3 ? 0.62 : 0.78), { align: 'center', glow: rgba(col, 0.8), gb: 30 });
  if (o.label) tx(c, o.label, x, y + r * 0.55, Math.max(18, r * 0.13), { f: MONO, w: 500, align: 'center', color: C.muted });
  c.restore(); }

// ---------- tarjeta con icono, título y texto: tarjeta(c, x, y, w, h, {icono, titulo, texto, col, p}) ----------
export function tarjeta(c, x, y, w, h, o = {}) { const p = o.p ?? 1; if (p <= 0) return; const col = o.col || C.blue;
  rise(c, p, 40, c2 => { glass(c2, x, y, w, h, { col, r: o.r ?? 28 }); let tx0 = x + 36;
    if (o.icono) { icono(c2, o.icono, x + 36 + 38, y + h / 2, 64, { col: o.colIcono || C.cyan, disco: true }); tx0 = x + 36 + 76 + 30; }
    const mw = x + w - 30 - tx0, ts = o.size || 40, bs = o.sizeTexto || 28;
    const lt = o.texto ? envolver(c2, o.texto, mw, bs, { w: 500 }) : [], hh = ts + (lt.length ? 14 + lt.length * bs * 1.3 : 0), y0 = y + (h - hh) / 2 + ts * 0.8;
    if (o.titulo) tx(c2, o.titulo, tx0, y0, ts, { w: 800 });
    lt.forEach((l, i) => tx(c2, l, tx0, y0 + 14 + (i + 1) * bs * 1.3, bs, { w: 500, color: C.muted })); }); }

// ---------- lista con checks que se encienden: lista(c, t, x, y, w, [{s, at}], {alto, gap, size, icono:'check'|'x', col}) ----------
export function lista(c, t, x, y, w, items, o = {}) { const h = o.alto || 104, g = o.gap ?? 18, size = o.size || 34, bad = o.icono === 'x';
  items.forEach((it, i) => { const yy = y + i * (h + g), p = ap(t, it.at, 0.35); if (p <= 0) return;
    rise(c, p, 30, c2 => { glass(c2, x, yy, w, h, { r: h / 2, gb: 24, col: bad ? C.red : (o.col || C.blue), sa: bad ? 0.45 : 0.7 });
      if (bad) xmark(c2, x + h / 2, yy + h / 2, h * 0.34, ap(t, it.at + 0.12, 0.3)); else check(c2, x + h / 2, yy + h / 2, h * 0.24, ap(t, it.at + 0.12, 0.3), o.col || C.green);
      tx(c2, it.s, x + h * 0.95, yy + h / 2 + size * 0.36, size, { w: 700, color: bad ? C.muted : C.ink }); }); }); }

// ---------- antes / ahora en dos columnas: comparativa(c, t, x, y, w, {titulo, items:[{s,at}]}, {titulo, items}, {alto}) ----------
// Izquierda en gris con ✕ roja; derecha en azul con check verde.
export function comparativa(c, t, x, y, w, izq, der, o = {}) { const cw = (w - 28) / 2, h = o.alto || 96, size = o.size || 30;
  [[izq, x, true], [der, x + cw + 28, false]].forEach(([col, cx, bad]) => { if (!col) return; const a0 = col.at ?? (col.items[0]?.at ?? 0) - 0.25, pt = ap(t, a0, 0.4); if (pt <= 0) return;
    rise(c, pt, 30, c2 => { glass(c2, cx, y, cw, 96, { r: 26, col: bad ? '#64748B' : C.blue, sa: bad ? 0.5 : 0.8, glow: bad ? 0.08 : 0.3 });
      tx(c2, col.titulo, cx + cw / 2, y + 62, 38, { align: 'center', color: bad ? C.muted : C.ink, w: 800 }); });
    col.items.forEach((it, i) => { const yy = y + 120 + i * (h + 16), p = ap(t, it.at, 0.35); if (p <= 0) return;
      rise(c, p, 24, c2 => { glass(c2, cx, yy, cw, h, { r: 22, gb: 18, col: bad ? '#64748B' : C.blue, sa: bad ? 0.35 : 0.6, glow: bad ? 0.06 : 0.22, fill: bad ? 'rgba(15,23,36,0.85)' : undefined });
        if (bad) xmark(c2, cx + 40, yy + h / 2, 26, ap(t, it.at + 0.1, 0.3)); else check(c2, cx + 40, yy + h / 2, 18, ap(t, it.at + 0.1, 0.3));
        const L = envolver(c2, it.s, cw - 92, size, { w: 600 }); L.slice(0, 2).forEach((l, k) => tx(c2, l, cx + 72, yy + h / 2 + size * 0.36 + (k - (L.length > 1 ? 0.5 : 0)) * size * 1.2, size, { w: 600, color: bad ? C.muted : C.ink })); }); }); }); }

// ---------- barras que crecen: barras(c, t, x, y, w, h, [{label, v, col, valor:'texto'}], at, {max}) ----------
export function barras(c, t, x, y, w, h, datos, at, o = {}) { const n = datos.length, gap = o.gap ?? 28, bw = (w - gap * (n - 1)) / n, max = o.max || Math.max(...datos.map(d => d.v));
  c.save(); c.strokeStyle = rgba(C.blue, 0.25); c.lineWidth = 2; c.beginPath(); c.moveTo(x, y + h); c.lineTo(x + w, y + h); c.stroke(); c.restore();
  datos.forEach((d, i) => { const p = sm(ap(t, at + i * (o.paso ?? 0.18), o.dur || 0.7)), bh = h * d.v / max * p, bx = x + i * (bw + gap), col = d.col || C.blue; if (p <= 0) return;
    c.save(); const g = c.createLinearGradient(0, y + h - bh, 0, y + h); g.addColorStop(0, col); g.addColorStop(1, rgba(col, 0.25)); c.shadowColor = rgba(col, 0.7); c.shadowBlur = 26; c.fillStyle = g;
    c.beginPath(); c.roundRect(bx, y + h - bh, bw, bh, [14, 14, 0, 0]); c.fill(); c.restore();
    if (d.valor) tx(c, d.valor, bx + bw / 2, y + h - bh - 18, 34, { align: 'center', alpha: p });
    if (d.label) tx(c, d.label, bx + bw / 2, y + h + 46, 26, { f: MONO, w: 500, align: 'center', color: C.muted }); }); }

// ---------- chat (WhatsApp, Instagram, web): burbujas(c, t, x, y, w, [{de:'otro'|'yo', s, at}], {alto, size}) ----------
// Dentro de un movil() de ~580 px usa size 40–46: con menos, el texto se ve diminuto en el teléfono.
// Antes de cada mensaje de «otro» salen 3 puntos «escribiendo…». Si no caben, los mensajes suben solos.
export function burbujas(c, t, x, y, w, msgs, o = {}) { const size = o.size || 30, pad = 26, lh = size * 1.3, maxB = w * 0.78, H0 = o.alto || 900; const items = [];
  let yy = 0; for (const m of msgs) { const L = envolver(c, m.s, maxB - pad * 2, size, { w: 500 }), bh = L.length * lh + pad * 1.4, bw = Math.max(...L.map(l => tw(c, l, size, { w: 500 }))) + pad * 2; items.push({ m, L, bh, bw, y: yy }); yy += bh + 18; }
  const vis = items.filter(it => t >= it.m.at - (it.m.de === 'otro' ? 0.7 : 0)); if (!vis.length) return; const last = vis[vis.length - 1], bottom = last.y + last.bh, shift = Math.max(0, bottom - H0);
  c.save(); c.beginPath(); c.rect(x - 20, y - 10, w + 40, H0 + 20); c.clip(); c.translate(0, -shift);
  for (const it of vis) { const mine = it.m.de === 'yo', bx = mine ? x + w - it.bw : x, by = y + it.y, col = mine ? C.bdark : '#13243C';
    if (t < it.m.at) { c.save(); c.fillStyle = col; c.beginPath(); c.roundRect(bx, by, 130, 70, 26); c.fill(); for (let k = 0; k < 3; k++) { c.fillStyle = rgba(C.ink, 0.35 + 0.5 * Math.max(0, Math.sin(t * 9 - k))); c.beginPath(); c.arc(bx + 38 + k * 27, by + 35, 8, 0, 7); c.fill(); } c.restore(); continue; }
    pop(c, bx + (mine ? it.bw : 0), by + it.bh / 2, ap(t, it.m.at, 0.3), c2 => { const ox = mine ? -it.bw : 0; c2.save(); c2.shadowColor = rgba(mine ? C.blue : '#000000', 0.5); c2.shadowBlur = 20; c2.fillStyle = col;
      c2.beginPath(); c2.roundRect(ox, -it.bh / 2, it.bw, it.bh, 26); c2.fill(); c2.restore(); it.L.forEach((l, k) => tx(c2, l, ox + pad, -it.bh / 2 + pad * 0.7 + size + k * lh, size, { w: 500 })); }); }
  c.restore(); }

// ---------- flecha que se dibuja de (x1,y1) a (x2,y2) ----------
export function flecha(c, x1, y1, x2, y2, p, col = C.cyan) { if (p <= 0) return; const e = sm(p), x = lerp(x1, x2, e), y = lerp(y1, y2, e), a = Math.atan2(y2 - y1, x2 - x1);
  c.save(); c.strokeStyle = col; c.lineWidth = 8; c.lineCap = 'round'; c.shadowColor = col; c.shadowBlur = 20; c.setLineDash([2, 18]); c.lineDashOffset = -p * 60; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x, y); c.stroke(); c.setLineDash([]);
  c.translate(x, y); c.rotate(a); c.beginPath(); c.moveTo(-26, -18); c.lineTo(0, 0); c.lineTo(-26, 18); c.stroke(); c.restore(); }

// ---------- sello que cae con golpe: sello(c, x, y, 'LISTO', p, {col, size, rot}) ----------
export function sello(c, x, y, s, p, o = {}) { if (p <= 0) return; const col = o.col || C.green, size = o.size || 44, e = 1 + 0.6 * (1 - out(clamp(p * 1.6))), w = tw(c, s, size) + 60;
  c.save(); c.translate(x, y); c.rotate(o.rot ?? -0.12); c.scale(e, e); c.globalAlpha *= clamp(p * 3); c.strokeStyle = col; c.lineWidth = 6; c.shadowColor = col; c.shadowBlur = 24;
  c.beginPath(); c.roundRect(-w / 2, -size * 0.85, w, size * 1.7, 14); c.stroke(); c.restore(); c.save(); c.translate(x, y); c.rotate(o.rot ?? -0.12); c.scale(e, e); c.globalAlpha *= clamp(p * 3);
  tx(c, s, 0, size * 0.36, size, { align: 'center', color: col, glow: rgba(col, 0.6) }); c.restore(); }

// ---------- cartel de neón con parpadeo al encenderse (CTA «Comenta PALABRA»): cartel(c, t, 540, 660, 'GUIA', at, {size}) ----------
export function cartel(c, t, x, y, palabra, at, o = {}) { if (t < at - 0.12) return; const size = o.size || (palabra.length > 6 ? 130 : 180), w = tw(c, palabra, size) + 140, h = size * 1.25;
  const fl = [1, 0.15, 0.9, 0.3, 1][Math.min(4, Math.floor((t - at + 0.12) / 0.06))];
  c.save(); const g = c.createRadialGradient(x, y, 0, x, y, w * 0.8); g.addColorStop(0, rgba(o.col || C.blue, 0.25 * fl)); g.addColorStop(1, rgba(C.blue, 0)); c.fillStyle = g; c.fillRect(x - w, y - w, w * 2, w * 2);
  c.globalAlpha *= 0.25 + 0.75 * fl; c.save(); c.strokeStyle = o.col || C.cyan; c.lineWidth = 8; c.shadowColor = o.col || C.cyan; c.shadowBlur = 50 * fl + 6; c.beginPath(); c.roundRect(x - w / 2, y - h / 2, w, h, 34); c.stroke(); c.stroke(); c.restore();
  tx(c, palabra, x, y + size * 0.36, size, { align: 'center', color: fl > 0.5 ? C.ink : 'rgba(248,250,252,0.4)', glow: rgba(o.col || C.cyan, fl), gb: 60 }); c.restore(); }
