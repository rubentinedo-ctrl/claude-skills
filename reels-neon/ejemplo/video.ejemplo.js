// EJEMPLO COMPLETO de reels-neon: «Este reel lo hizo Claude Code» (51 s, 9 escenas, CTA «Comenta REEL»).
// Úsalo como referencia de cómo se monta un vídeo: tiempos desde la voz → escenas → subtítulos → sonidos.
// Es SOLO una referencia: no copies sus textos, su mascota, su firma ni su @usuario a los reels del usuario.
// Para verlo dentro de un proyecto:  cp -R <skill>/ejemplo ./ejemplo && node render.mjs --video ejemplo/video.ejemplo.js --every 2
// Mascota de ejemplo: Iva, de TinergIA. Fotos de ejemplo: generadas con IA.
import { C, W, H, MONO, clamp, lerp, E, rgba, sm, ap, back, out, typed, norm, tiempos, font, tx, tw, head, glass, pop, rise, check, pill, cover, mascota,
  ring, linkIcon, star, fondo, escenas, destellos, karaoke, firma, marcaAgua } from '../neon.js';
import { SC } from './timing.ejemplo.js';

const { B, kw, WORDS, VOEND } = tiempos(SC);
const END = VOEND + 3.0;
const M = pose => `ejemplo/mascota/${pose}.png`;            // poses recortadas de la mascota
const F = n => `ejemplo/img/${n}.jpg`;                      // fotos
const FIRMA = { foto: 'ejemplo/firma/avatar.png', nombre: 'Rubén Tinedo', usuario: '@rubentinedo.ia', lema: 'Inteligencia artificial aplicada', logo: 'ejemplo/firma/logo-tinergia.png', logoTexto: 'Fundador de' };

// momentos clave: la palabra exacta en que pasa cada cosa
const T = {
  claude: kw(0, 'claude'), solo: kw(0, 'solo'), fin: kw(0, 'fin'),
  plant: kw(1, 'plantilla'), mov: kw(1, 'movimiento'), code: kw(1, 'codigo'),
  tema: kw(2, 'tema'), inv: kw(2, 'investiga'), guion: kw(2, 'guion'), estilo: kw(2, 'estilo'),
  voz: kw(3, 'voz'), sinc: kw(3, 'sincroniza'), exacta: kw(3, 'exacta'),
  imgs: kw(4, 'imagenes'), mezcla: kw(4, 'mezcla'), revisa: kw(4, 'revisa'), editor: kw(4, 'editor'),
  antes: kw(5, 'antes'), dia: kw(5, 'dia'), ahora: kw(5, 'ahora'), cafe: kw(5, 'cafe'),
  pasos: kw(6, 'pasos'),
  abre: kw(7, 'abre'), pega: kw(8, 'pega'), enlace: kw(8, 'enlace'), inst: kw(8, 'instalala'),
  hazme: kw(9, 'hazme'), quieras: kw(9, 'quieras'),
  comenta: kw(10, 'comenta'), reel: kw(10, 'reel'), gratis: kw(10, 'gratis'),
};
T.endc = VOEND + 0.25;

// ================= ESCENAS =================
// 0 · Gancho: «Este reel no lo edité yo. Lo hizo Claude Code, solo, de principio a fin.»
function s0(c, t, K) { cover(c, K.images[F('escritorio')], 0, 0, W, H, 1.1 + 0.12 * clamp(t / B(1)), 0, -30);
  const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgba(4,11,22,0.9)'); g.addColorStop(0.3, 'rgba(4,11,22,0.35)'); g.addColorStop(0.62, 'rgba(4,11,22,0.4)'); g.addColorStop(1, 'rgba(4,11,22,0.95)'); c.fillStyle = g; c.fillRect(0, 0, W, H);
  head(c, t, 0.08, [{ s: 'Este reel lo hizo' }, { s: 'Claude Code', pill: true, at: T.claude - 0.12 }], { y: 290, size: 82 });
  const steps = ['Guion', 'Voz', 'Animación', 'Render'], cw = 222, gap = 10, x0 = 540 - (4 * cw + 3 * gap) / 2;
  steps.forEach((st, i) => { const at = lerp(T.solo - 0.1, T.fin, i / 3), p = ap(t, at, 0.3);
    pop(c, x0 + i * (cw + gap) + cw / 2, 1010, p, c2 => { glass(c2, -cw / 2, -40, cw, 80, { r: 40, gb: 26 }); check(c2, -cw / 2 + 36, 0, 17, ap(t, at + 0.12, 0.25)); tx(c2, st, -cw / 2 + 62, 10, 28, { w: 700 }); }); });
  const pp = clamp((t - T.solo) / (T.fin + 0.35 - T.solo));
  if (pp > 0) { const x = 140, y = 1100, w = 800; c.save(); c.fillStyle = rgba(C.blue, 0.16); c.beginPath(); c.roundRect(x, y, w, 14, 7); c.fill();
    const gg = c.createLinearGradient(x, 0, x + w, 0); gg.addColorStop(0, C.bdark); gg.addColorStop(1, C.cyan); c.shadowColor = C.cyan; c.shadowBlur = 20; c.fillStyle = gg; c.beginPath(); c.roundRect(x, y, w * sm(pp), 14, 7); c.fill(); c.restore();
    tx(c, pp >= 1 ? 'Reel terminado' : 'Creando el reel…', x, y + 58, 26, { f: MONO, w: 500, color: pp >= 1 ? C.green : C.muted }); tx(c, `${Math.round(sm(pp) * 100)}%`, x + w, y + 58, 26, { f: MONO, w: 500, align: 'right', color: C.ink }); }
  mascota(c, K, M('saluda'), 865, 1335, 290, ap(t, 0.45, 0.5), t); }

// 1 · «Y no es una plantilla: cada movimiento que ves es código.»
const CODE = [
  [['const ', C.kw], ['iva ', C.ink], ['= ', C.muted], ['await ', C.kw], ['pose', C.fn], ['(', C.muted], ["'saluda'", C.str], [');', C.muted]],
  [['escena', C.ink], ['.', C.muted], ['en', C.fn], ['(', C.muted], ["'código'", C.str], [', () => {', C.muted]],
  [['  iva', C.ink], ['.', C.muted], ['pop', C.fn], ['({ ', C.muted], ['brillo', C.ink], [': ', C.muted], ["'#47B3E3'", C.str], [' });', C.muted]],
  [['  tarjeta', C.ink], ['.', C.muted], ['entra', C.fn], ['({ ', C.muted], ['desde', C.ink], [': ', C.muted], ["'abajo'", C.str], [' });', C.muted]],
  [['  destello', C.ink], ['.', C.muted], ['en', C.fn], ['(', C.muted], ['palabra', C.fn], ['(', C.muted], ["'código'", C.str], ['));', C.muted]],
  [['  camara', C.ink], ['.', C.muted], ['zoom', C.fn], ['(', C.muted], ['1.2', C.num], [', ', C.muted], ['0.6', C.num], [');', C.muted]],
  [['});', C.muted]]];
const CODE_N = CODE.reduce((s, l) => s + l.reduce((a, [x]) => a + x.length, 0) + 1, 0);
function s1(c, t, K) { head(c, t, B(1) + 0.05, [{ s: 'No es una' }, { s: 'plantilla', c: C.red, at: T.plant - 0.1 }, { s: 'Es código', pill: true, at: T.code - 0.1 }], { y: 250, size: 78 });
  // la plantilla tachada
  const pT = ap(t, B(1) + 0.15, 0.4), gone = ap(t, T.mov - 0.15, 0.35);
  if (pT > 0 && gone < 1) { c.save(); c.globalAlpha *= clamp(pT * 1.5) * (1 - gone); c.translate(540, 880); const sk = t > T.plant + 0.15 && t < T.plant + 0.45 ? Math.sin(t * 90) * 8 : 0; c.translate(sk, 0); c.scale(1 - 0.25 * gone, 1 - 0.25 * gone);
    glass(c, -320, -230, 640, 460, { col: C.muted, sa: 0.5, glow: 0.1 }); tx(c, 'PLANTILLA', -280, -170, 26, { f: MONO, w: 500, color: C.muted });
    c.fillStyle = 'rgba(143,163,184,0.18)'; [[-280, -130, 560, 120], [-280, 10, 270, 180], [10, 10, 270, 80], [10, 110, 270, 80]].forEach(([x, y, w, h]) => { c.beginPath(); c.roundRect(x, y, w, h, 14); c.fill(); });
    const px = ap(t, T.plant + 0.1, 0.25); if (px > 0) { c.save(); const e = back(px); c.scale(e, e); c.strokeStyle = C.red; c.lineWidth = 26; c.lineCap = 'round'; c.shadowColor = C.red; c.shadowBlur = 30;
      c.beginPath(); c.moveTo(-170, -170); c.lineTo(170, 170); c.moveTo(170, -170); c.lineTo(-170, 170); c.stroke(); c.restore(); }
    c.restore(); }
  // el editor de código que se escribe
  const pc = ap(t, T.mov - 0.1, 0.45);
  rise(c, pc, 90, c2 => { glass(c2, 70, 560, 940, 640); [C.red, C.yellow, C.green].forEach((col, i) => { c2.fillStyle = col; c2.beginPath(); c2.arc(112 + i * 30, 604, 9, 0, 7); c2.fill(); });
    tx(c2, 'video.js', 540, 614, 24, { f: MONO, w: 500, align: 'center', color: C.muted }); c2.fillStyle = rgba(C.blue, 0.18); c2.fillRect(72, 640, 936, 2);
    const t0 = T.mov + 0.05, dur = Math.max(1.3, B(2) - 0.6 - t0), n = Math.floor(clamp((t - t0) / dur) * CODE_N); let k = 0, cy = 0, cx = 0;
    CODE.forEach((ln, li) => { const y = 704 + li * 52; tx(c2, String(li + 1), 108, y, 24, { f: MONO, w: 400, color: 'rgba(143,163,184,0.45)', align: 'right' }); let x = 140;
      for (const [s, col] of ln) { const vis = s.slice(0, Math.max(0, Math.min(s.length, n - k))); if (vis) { tx(c2, vis, x, y, 27, { f: MONO, w: 500, color: col }); } if (n - k > 0) { cx = x + tw(c2, vis, 27, { f: MONO, w: 500 }); cy = y; } x += tw(c2, s, 27, { f: MONO, w: 500 }); k += s.length; } k += 1; });
    if (Math.floor(t * 3) % 2 || n < CODE_N) { c2.fillStyle = C.cyan; c2.fillRect(cx + 2, cy - 26, 3, 32); }
    // vista previa: lo que hace ese código
    glass(c2, 110, 1068, 860, 104, { r: 20, gb: 0, fill: 'rgba(4,11,22,0.7)', sa: 0.35 }); tx(c2, 'vista previa', 132, 1096, 18, { f: MONO, w: 500, color: C.muted });
    const u = ((t - t0) * 0.9) % 1, bx = lerp(190, 890, E.back ? clamp(E.out(u < 0.5 ? u * 2 : 2 - u * 2)) : u);
    c2.save(); c2.shadowColor = C.cyan; c2.shadowBlur = 24; c2.fillStyle = C.cyan; c2.beginPath(); c2.arc(bx, 1130, 18, 0, 7); c2.fill(); c2.restore();
    for (let i = 1; i < 6; i++) { c2.fillStyle = rgba(C.cyan, 0.12 * (6 - i) / 5); c2.beginPath(); c2.arc(bx - (u < 0.5 ? 1 : -1) * i * 26, 1130, 18 - i * 2, 0, 7); c2.fill(); } });
  mascota(c, K, M('asoma'), 0, 1350, 300, ap(t, B(1) + 0.5, 0.45), t, { right: true, slide: 260, noGlow: true, still: true }); }

// 2 · «Yo solo le digo el tema. Claude investiga, escribe el guion y me pregunta el estilo.»
const PROMPT = ['Hazme un reel sobre', 'el café de especialidad'];
const SCRIPT = ['1 · Gancho: ¿por qué tu café sabe amargo?', '2 · El problema: agua y molienda', '3 · La solución, en tres pasos', '4 · Cierre: comenta CAFÉ'];
function s2(c, t, K) { head(c, t, B(2) + 0.05, [{ s: 'Tú solo das' }, { s: 'el tema', pill: true, at: T.tema - 0.12 }], { y: 250, size: 80, x: 90, align: 'left' });
  mascota(c, K, M('piensa'), 870, 320, 290, ap(t, B(2) + 0.3, 0.5), t);
  rise(c, ap(t, B(2) + 0.1, 0.45), 70, c2 => { glass(c2, 60, 500, 960, 860);
    star(c2, 104, 548, 14, C.claude); tx(c2, 'Claude Code', 128, 557, 24, { f: MONO, w: 500, color: C.claude }); c2.fillStyle = rgba(C.blue, 0.15); c2.fillRect(62, 585, 956, 2);
    // el prompt
    const t0 = B(2) + 0.25; let n = Math.floor((t - t0) * 30); tx(c2, '›', 100, 652, 40, { color: C.claude });
    PROMPT.forEach((ln, i) => { const vis = ln.slice(0, Math.max(0, Math.min(ln.length, n))); n -= ln.length; tx(c2, vis, 136, 650 + i * 46, 34, { w: 600 }); });
    // investiga
    const pi = ap(t, T.inv - 0.05, 0.3); if (pi > 0) { c2.save(); c2.globalAlpha *= pi; const done = t > T.inv + 0.9;
      done ? check(c2, 112, 786, 15, 1) : ring(c2, 112, 786, 11, t); tx(c2, done ? 'Investigó 6 fuentes' : 'Investigando…', 140, 797, 30, { w: 700, color: done ? C.ink : C.cyan });
      ['artículo', 'estudio', 'guía', 'vídeo'].forEach((s, i) => pop(c2, 168 + i * 196, 855, ap(t, T.inv + 0.15 + i * 0.12, 0.3), c3 => { glass(c3, -86, -26, 172, 52, { r: 14, gb: 0, sa: 0.45 }); tx(c3, s, 0, 9, 22, { f: MONO, w: 500, align: 'center', color: C.muted }); }));
      c2.restore(); }
    // guion
    const pg = ap(t, T.guion - 0.05, 0.3); if (pg > 0) { c2.save(); c2.globalAlpha *= pg; const done = t > T.estilo - 0.2;
      done ? check(c2, 112, 944, 15, 1) : ring(c2, 112, 944, 11, t); tx(c2, 'Escribiendo el guion', 140, 955, 30, { w: 700, color: done ? C.ink : C.cyan });
      let m = Math.floor((t - T.guion - 0.1) * 46); SCRIPT.forEach((ln, i) => { const vis = ln.slice(0, Math.max(0, Math.min(ln.length, m))); m -= ln.length; tx(c2, vis, 140, 1004 + i * 40, 25, { w: 500, f: 'Inter', color: C.muted }); });
      c2.restore(); }
    // pregunta de estilo
    pop(c2, 540, 1258, ap(t, T.estilo - 0.25, 0.35), c3 => { glass(c3, -440, -74, 880, 148, { col: C.cyan, sa: 0.9, glow: 0.45, fill: 'rgba(12,34,60,0.96)' });
      tx(c3, '¿Qué estilo quieres?', -400, -22, 28, { w: 700 });
      const sel = ap(t, T.estilo + 0.4, 0.25); ['Neón', 'Pizarra', 'Realista'].forEach((s, i) => { const x = -300 + i * 270, on = i === 0 && sel > 0;
        c3.save(); if (on) { c3.shadowColor = C.blue; c3.shadowBlur = 24 * sel; } c3.fillStyle = on ? rgba(C.blue, sel) : 'rgba(143,163,184,0.14)'; c3.beginPath(); c3.roundRect(x - 115, 6, 230, 52, 26); c3.fill(); c3.restore();
        tx(c3, s, x, 42, 26, { w: 700, align: 'center', color: on && sel > 0.5 ? C.bg : C.ink }); }); }); }); }

// 3 · «Genera la narración con mi voz clonada, y sincroniza cada animación con la palabra exacta.»
const SYNC = (() => { const i0 = SC[3].words.findIndex(w => norm(w.w).startsWith('cada')); return SC[3].words.slice(i0 < 0 ? 0 : i0, (i0 < 0 ? 0 : i0) + 6).map(w => ({ w: w.w.replace(/[.,]/g, ''), s: B(3) + w.s })); })();
function s3(c, t, K) { head(c, t, B(3) + 0.05, [{ s: 'Con mi voz' }, { s: 'clonada', pill: true, at: T.voz - 0.12 }], { y: 250, size: 80, x: 90, align: 'left' });
  mascota(c, K, M('base'), 880, 320, 280, ap(t, B(3) + 0.3, 0.5), t);
  rise(c, ap(t, B(3) + 0.1, 0.45), 70, c2 => { glass(c2, 60, 500, 960, 330); tx(c2, 'VOZ · RUBÉN · CLONADA', 100, 556, 22, { f: MONO, w: 500, color: C.blue });
    const act = 0.35 + 0.65 * clamp((t - B(3)) / 0.4) * (t < VOEND ? 1 : 0.2), ph = ((t - B(3)) * 0.22) % 1;
    for (let i = 0; i < 56; i++) { const x = 104 + i * 15.6, hh = (0.18 + 0.82 * Math.abs(Math.sin(i * 1.31 + t * 9) * Math.cos(i * 0.47 - t * 4.3))) * 100 * act, past = i / 56 < ph;
      c2.fillStyle = past ? C.cyan : rgba(C.blue, 0.45); c2.beginPath(); c2.roundRect(x, 700 - hh, 8, hh * 2, 4); c2.fill(); }
    c2.save(); c2.strokeStyle = C.ink; c2.lineWidth = 3; c2.shadowColor = C.cyan; c2.shadowBlur = 14; const px = 104 + ph * 874; c2.beginPath(); c2.moveTo(px, 592); c2.lineTo(px, 806); c2.stroke(); c2.restore(); });
  // línea de tiempo: palabras ↔ animaciones
  rise(c, ap(t, T.sinc - 0.1, 0.45), 70, c2 => { glass(c2, 60, 870, 960, 470); tx(c2, 'PALABRA  ↔  ANIMACIÓN', 100, 926, 22, { f: MONO, w: 500, color: C.blue });
    const x0 = 110, x1 = 970, ta = SYNC.length ? SYNC[0].s - 0.3 : T.sinc, tb = SYNC.length ? SYNC[SYNC.length - 1].s + 0.5 : T.exacta + 0.5;
    c2.strokeStyle = 'rgba(143,163,184,0.3)'; c2.lineWidth = 2; for (let i = 0; i <= 16; i++) { const x = lerp(x0, x1, i / 16); c2.beginPath(); c2.moveTo(x, 952); c2.lineTo(x, i % 4 ? 962 : 972); c2.stroke(); }
    SYNC.forEach((w, i) => { const x = lerp(x0 + 40, x1 - 40, (w.s - ta) / (tb - ta)), on = t >= w.s - 0.02, yy = i % 2 ? 1060 : 1010;
      c2.save(); c2.font = font(24, { w: 700 }); const ww = c2.measureText(w.w).width + 26; c2.restore();
      c2.save(); if (on) { c2.shadowColor = C.blue; c2.shadowBlur = 20; } c2.fillStyle = on ? C.blue : 'rgba(143,163,184,0.16)'; c2.beginPath(); c2.roundRect(x - ww / 2, yy - 24, ww, 44, 12); c2.fill(); c2.restore();
      tx(c2, w.w, x, yy + 7, 24, { w: 700, align: 'center', color: on ? C.bg : C.muted }); tx(c2, w.s.toFixed(2) + 's', x, yy + 46, 16, { f: MONO, w: 500, align: 'center', color: on ? C.cyan : 'rgba(143,163,184,0.5)' });
      c2.strokeStyle = on ? rgba(C.cyan, 0.7) : 'rgba(143,163,184,0.2)'; c2.lineWidth = 2; c2.setLineDash([5, 6]); c2.beginPath(); c2.moveTo(x, yy + 54); c2.lineTo(x, 1215); c2.stroke(); c2.setLineDash([]);
      const kp = ap(t, w.s, 0.3); c2.save(); c2.translate(x, 1240); c2.rotate(Math.PI / 4); const s = 15 * (1 + 0.6 * (1 - kp) * (on ? 1 : 0)); if (on) { c2.shadowColor = C.cyan; c2.shadowBlur = 26 * (1.2 - kp); }
      c2.fillStyle = on ? C.cyan : 'rgba(143,163,184,0.35)'; c2.fillRect(-s, -s, s * 2, s * 2); c2.restore(); });
    tx(c2, 'animación', 100, 1300, 18, { f: MONO, w: 500, color: C.muted });
    const ph = clamp((t - ta) / (tb - ta)); if (ph > 0 && ph < 1) { const px = lerp(x0 + 40, x1 - 40, ph); c2.save(); c2.strokeStyle = C.ink; c2.lineWidth = 3; c2.shadowColor = C.cyan; c2.shadowBlur = 14; c2.beginPath(); c2.moveTo(px, 945); c2.lineTo(px, 1270); c2.stroke(); c2.restore(); } }); }

// 4 · «Crea imágenes realistas, mezcla la música y los efectos, y revisa cada fotograma como un editor.»
const PHOTOS = ['cocina', 'ciudad', 'robot', 'surf'];
function phaseA(c, t, K) { head(c, t, B(4) + 0.05, [{ s: 'Crea imágenes' }, { s: 'realistas', pill: true, at: T.imgs + 0.1 }], { y: 250, size: 80 });
  PHOTOS.forEach((n, i) => { const x = i % 2 ? 556 : 84, y = i < 2 ? 500 : 960, w = 440, h = 440, at = T.imgs + 0.05 + i * 0.16, p = ap(t, at, 0.7); if (p <= 0) return;
    c.save(); c.globalAlpha *= clamp(p * 3); c.shadowColor = rgba(C.blue, 0.5); c.shadowBlur = 40; c.fillStyle = '#000'; c.beginPath(); c.roundRect(x, y, w, h, 26); c.fill(); c.restore();
    c.save(); c.globalAlpha *= clamp(p * 3); const bl = (1 - out(p)) * 22; if (bl > 0.3) c.filter = `blur(${bl}px)`; cover(c, K.images[F(n)], x, y, w, h, 1.18 - 0.1 * out(p) + 0.02 * Math.max(0, t - at), 0, 0, 26); c.filter = 'none';
    if (p < 1) { const sy = y + h * out(p); c.shadowColor = C.cyan; c.shadowBlur = 30; c.fillStyle = C.cyan; c.fillRect(x, sy - 2, w, 4); }
    c.restore(); c.save(); c.strokeStyle = rgba(C.blue, 0.6); c.lineWidth = 2.5; c.beginPath(); c.roundRect(x, y, w, h, 26); c.stroke(); c.restore();
    if (p >= 1) pop(c, x + 60, y + 40, ap(t, at + 0.7, 0.25), c2 => { c2.fillStyle = 'rgba(4,11,22,0.75)'; c2.beginPath(); c2.roundRect(-40, -18, 80, 36, 18); c2.fill(); tx(c2, 'IA', 0, 8, 20, { f: MONO, w: 500, align: 'center', color: C.cyan }); }); }); }
function phaseB(c, t) { head(c, t, T.mezcla - 0.1, [{ s: 'Mezcla música' }, { s: 'y efectos', pill: true, at: T.mezcla + 0.2 }], { y: 250, size: 80 });
  glass(c, 80, 500, 920, 860);
  [['VOZ', 0.82, C.cyan], ['MÚSICA', 0.46, C.blue], ['EFECTOS', 0.6, C.green]].forEach(([lab, lv, col], i) => { const x = 260 + i * 280, top = 590, bot = 1110, p = sm((t - T.mezcla - 0.1 - i * 0.12) / 0.6), lvl = lerp(0.1, lv, p);
    c.fillStyle = 'rgba(143,163,184,0.18)'; c.beginPath(); c.roundRect(x - 6, top, 12, bot - top, 6); c.fill();
    const ky = lerp(bot, top, lvl); c.fillStyle = rgba(col, 0.5); c.beginPath(); c.roundRect(x - 6, ky, 12, bot - ky, 6); c.fill();
    c.save(); c.shadowColor = col; c.shadowBlur = 24; c.fillStyle = C.ink; c.beginPath(); c.roundRect(x - 46, ky - 18, 92, 36, 10); c.fill(); c.restore(); c.fillStyle = col; c.fillRect(x - 30, ky - 2, 60, 4);
    for (let k = 0; k < 18; k++) { const on = k / 18 < lvl * (0.75 + 0.25 * Math.abs(Math.sin(t * 11 + i * 2 + k * 0.1))); const yy = bot - k * 29 - 20; c.fillStyle = on ? (k > 14 ? C.red : k > 11 ? C.yellow : col) : 'rgba(143,163,184,0.12)'; c.fillRect(x + 64, yy, 34, 20); }
    tx(c, lab, x + 20, 1170, 24, { f: MONO, w: 500, align: 'center', color: C.muted }); });
  pop(c, 540, 1268, ap(t, T.mezcla + 0.8, 0.35), c2 => { glass(c2, -260, -48, 520, 96, { r: 48, col: C.green, gb: 30 }); check(c2, -200, 0, 22, 1); tx(c2, '−14 LUFS', -160, 16, 44, { f: MONO, w: 500 }); tx(c2, 'listo', 200, 12, 26, { w: 700, color: C.green, align: 'right' }); }); }
const SHEET = ['cocina', 'ciudad', 'robot', 'surf', 'escritorio', 'cafe', 'surf', 'cocina', 'ciudad', 'robot', 'cafe', 'escritorio'];
function phaseC(c, t, K) { head(c, t, T.revisa - 0.1, [{ s: 'Revisa cada' }, { s: 'fotograma', pill: true, at: T.revisa + 0.25 }], { y: 250, size: 80 });
  glass(c, 60, 480, 960, 880); const bad = 6, fixT = T.editor;
  SHEET.forEach((n, i) => { const col = i % 4, row = Math.floor(i / 4), x = 90 + col * 228, y = 512 + row * 278, w = 212, h = 262, p = ap(t, T.revisa - 0.15 + i * 0.03, 0.3);
    if (p <= 0) return; c.save(); c.globalAlpha *= p; cover(c, K.images[F(n)], x, y, w, h, 1.15, 0, 0, 14);
    c.fillStyle = 'rgba(4,11,22,0.35)'; c.beginPath(); c.roundRect(x, y, w, h, 14); c.fill();
    c.fillStyle = C.ink; c.beginPath(); c.roundRect(x + 30, y + h - 52, w - 60, 14, 7); c.fill(); c.fillStyle = C.blue; c.beginPath(); c.roundRect(x + 56, y + h - 30, w - 112, 12, 6); c.fill();
    if (i === bad && t > T.revisa + 0.7) { const fixed = t > fixT; c.save(); c.strokeStyle = fixed ? C.green : C.red; c.lineWidth = 6; c.shadowColor = c.strokeStyle; c.shadowBlur = 24; c.beginPath(); c.roundRect(x - 4, y - 4, w + 8, h + 8, 18); c.stroke(); c.restore();
      if (!fixed) { c.fillStyle = C.red; c.beginPath(); c.roundRect(x + w - 70, y + h - 70, 120, 36, 10); c.fill(); }
      pill(c, x + w / 2, y + h + 4, fixed ? 'corregido' : 'texto cortado', 20, { col: fixed ? C.green : C.red, pad: 30 }); }
    c.restore(); });
  // lupa que recorre la hoja
  const u = clamp((t - T.revisa) / Math.max(0.8, T.editor - T.revisa)), idx = Math.min(11, Math.floor(u * 12)), lx = 90 + (idx % 4) * 228 + 106, ly = 512 + Math.floor(idx / 4) * 278 + 131;
  if (t > T.revisa && t < T.editor + 0.3) { c.save(); c.strokeStyle = C.ink; c.lineWidth = 7; c.shadowColor = C.cyan; c.shadowBlur = 24; c.beginPath(); c.arc(lx, ly, 70, 0, 7); c.stroke(); c.beginPath(); c.moveTo(lx + 50, ly + 50); c.lineTo(lx + 100, ly + 100); c.lineWidth = 14; c.lineCap = 'round'; c.stroke(); c.restore(); }
  pop(c, 850, 470, ap(t, T.editor + 0.2, 0.3), c2 => pill(c2, 0, 0, 'Revisado', 26, { col: C.green })); }
function s4(c, t, K) { const pos = sm((t - T.mezcla + 0.18) / 0.4) + sm((t - T.revisa + 0.18) / 0.4);
  [phaseA, phaseB, phaseC].forEach((fn, k) => { const dx = (k - pos) * W; if (Math.abs(dx) >= W) return; c.save(); c.translate(dx, 0); fn(c, t, K); c.restore(); }); }

// 5 · «Lo que antes me llevaba un día entero, ahora lo reviso con un café.»
function s5(c, t, K) {
  if (t < T.ahora) { head(c, t, B(5) + 0.05, [{ s: 'Antes:' }, { s: 'un día entero', c: C.red, at: T.dia - 0.15 }], { y: 300, size: 86 });
    const p = ap(t, B(5) + 0.1, 0.45), spin = clamp((t - B(5)) / Math.max(0.6, T.ahora - B(5)));
    pop(c, 540, 900, p, c2 => { c2.strokeStyle = 'rgba(143,163,184,0.2)'; c2.lineWidth = 26; c2.beginPath(); c2.arc(0, 0, 250, 0, 7); c2.stroke();
      c2.save(); c2.strokeStyle = C.red; c2.shadowColor = C.red; c2.shadowBlur = 30; c2.lineCap = 'round'; c2.beginPath(); c2.arc(0, 0, 250, -Math.PI / 2, -Math.PI / 2 + spin * Math.PI * 2 * 0.999); c2.stroke(); c2.restore();
      const a = -Math.PI / 2 + spin * Math.PI * 8; c2.strokeStyle = C.ink; c2.lineWidth = 10; c2.lineCap = 'round'; c2.beginPath(); c2.moveTo(0, 0); c2.lineTo(Math.cos(a) * 170, Math.sin(a) * 170); c2.stroke();
      const hr = 9 + Math.floor(spin * 10), mn = Math.floor((spin * 600) % 60); tx(c2, `${String(hr).padStart(2, '0')}:${String(mn).padStart(2, '0')}`, 0, 120, 52, { f: MONO, w: 500, align: 'center' });
      tx(c2, 'editando a mano', 0, 330, 30, { w: 600, align: 'center', color: C.muted }); }); return; }
  cover(c, K.images[F('cafe')], 0, 0, W, H, 1.08 + 0.08 * clamp((t - T.ahora) / 2.5), -40, 0);
  const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgba(4,11,22,0.55)'); g.addColorStop(0.45, 'rgba(4,11,22,0.05)'); g.addColorStop(0.75, 'rgba(4,11,22,0.55)'); g.addColorStop(1, 'rgba(4,11,22,0.95)'); c.fillStyle = g; c.fillRect(0, 0, W, H);
  head(c, t, T.ahora + 0.05, [{ s: 'Ahora, lo reviso' }, { s: 'con un café', pill: true, at: T.cafe - 0.15 }], { y: 1220, size: 80 }); }

// 6 · «¿Quieres hacerlo tú? Se instala en tres pasos.»
const STEPS = ['Abre Claude Code', 'Instala la skill', 'Pide tu reel'];
function s6(c, t, K) { head(c, t, B(6) + 0.05, [{ s: '¿Quieres' }, { s: 'hacerlo tú?', c: C.cyan }], { y: 330, size: 100 });
  mascota(c, K, M('senala'), 300, 1030, 470, ap(t, B(6) + 0.25, 0.5), t);
  STEPS.forEach((s, i) => pop(c, 790, 820 + i * 150, ap(t, T.pasos - 0.1 + i * 0.14, 0.35), c2 => { glass(c2, -230, -56, 460, 112, { r: 56, gb: 30 });
    c2.save(); c2.shadowColor = C.blue; c2.shadowBlur = 20; c2.fillStyle = C.blue; c2.beginPath(); c2.arc(-174, 0, 36, 0, 7); c2.fill(); c2.restore(); tx(c2, String(i + 1), -174, 14, 38, { align: 'center', color: C.bg });
    tx(c2, s, -122, 11, 30, { w: 700 }); })); }

// 7-9 · Instalación: «Uno: abre Claude Code. Dos: pega el enlace de la skill y dile: instálala. Tres: escríbele, hazme un reel sobre lo que quieras.»
const TOPICS = ['el café', 'tu negocio', 'la IA', 'lo que quieras'];
function sInst(c, t, K) { const k = t >= B(9) ? 2 : t >= B(8) ? 1 : 0, doneInst = T.inst + 1.25;
  // pasos arriba
  tx(c, 'INSTALACIÓN · 3 PASOS', 540, 150, 24, { f: MONO, w: 500, align: 'center', color: C.blue });
  const xs = [220, 540, 860]; c.save(); c.strokeStyle = 'rgba(143,163,184,0.25)'; c.lineWidth = 6; c.beginPath(); c.moveTo(xs[0], 220); c.lineTo(xs[2], 220); c.stroke();
  const prog = clamp((k + (k === 1 ? clamp((t - B(8)) / (doneInst - B(8))) : k === 2 ? clamp((t - B(9)) / (T.quieras + 0.6 - B(9))) : 0)) / 2);
  c.strokeStyle = C.blue; c.shadowColor = C.blue; c.shadowBlur = 16; c.beginPath(); c.moveTo(xs[0], 220); c.lineTo(lerp(xs[0], xs[2], prog), 220); c.stroke(); c.restore();
  STEPS.forEach((s, i) => { const done = i < k || (i === 2 && t > T.quieras + 0.6), act = i === k, x = xs[i];
    c.save(); if (act || done) { c.shadowColor = done ? C.green : C.blue; c.shadowBlur = 26; } c.fillStyle = done ? C.green : act ? C.blue : '#0B1D33'; c.beginPath(); c.arc(x, 220, act ? 46 : 40, 0, 7); c.fill();
    c.strokeStyle = act || done ? 'transparent' : 'rgba(143,163,184,0.4)'; c.lineWidth = 3; c.stroke(); c.restore();
    if (done) check(c, x, 220, 30, 1, C.green); else tx(c, String(i + 1), x, 234, 40, { align: 'center', color: act ? C.bg : C.muted });
    tx(c, s, x, 310, 26, { w: 700, align: 'center', color: act ? C.ink : done ? C.green : C.muted }); });
  // terminal
  rise(c, ap(t, B(7), 0.45), 80, c2 => { const X = 50, Y = 380, Wd = 980, Ht = 880; glass(c2, X, Y, Wd, Ht, { fill: 'rgba(5,13,25,0.96)', r: 24 });
    [C.red, C.yellow, C.green].forEach((col, i) => { c2.fillStyle = col; c2.beginPath(); c2.arc(X + 40 + i * 30, Y + 36, 9, 0, 7); c2.fill(); });
    tx(c2, 'Terminal — zsh', 540, Y + 45, 22, { f: MONO, w: 500, align: 'center', color: C.muted }); c2.fillStyle = rgba(C.blue, 0.15); c2.fillRect(X + 2, Y + 70, Wd - 4, 2);
    c2.save(); c2.beginPath(); c2.rect(X + 2, Y + 74, Wd - 4, Ht - 80); c2.clip();
    // contenido con su altura; si se pasa, sube
    const rows = []; const M = { f: MONO, w: 500 };
    rows.push({ h: 56, at: B(7), d: (c3, y) => { tx(c3, '~/reels $', 90, y, 28, { ...M, color: C.green }); tx(c3, typed('claude', t, T.abre + 0.05, 14), 260, y, 28, M); } });
    rows.push({ h: 200, at: T.abre + 0.6, d: (c3, y) => { c3.save(); c3.strokeStyle = C.claude; c3.lineWidth = 2.5; c3.beginPath(); c3.roundRect(90, y - 40, 900, 170, 16); c3.stroke(); c3.restore();
      star(c3, 130, y + 4, 16, C.claude); tx(c3, 'Welcome to Claude Code', 160, y + 14, 32, { w: 700, color: C.ink }); tx(c3, '/help para ayuda', 130, y + 66, 24, { ...M, color: C.muted }); tx(c3, 'cwd: ~/reels', 130, y + 104, 24, { ...M, color: C.muted }); } });
    // paso 2: pegar enlace + «instálala»
    const sent2 = T.inst + 0.35;
    rows.push({ h: 84, at: T.abre + 0.9, d: (c3, y) => { const live = t < sent2; c3.save(); c3.strokeStyle = live ? rgba(C.blue, 0.8) : 'rgba(143,163,184,0.25)'; c3.lineWidth = 2; c3.beginPath(); c3.roundRect(90, y - 42, 900, 64, 12); c3.stroke(); c3.restore();
      tx(c3, '>', 110, y, 28, { ...M, color: C.claude }); let x = 146;
      const pp = ap(t, T.pega + 0.05, 0.25); if (pp > 0) { pop(c3, x + 150, y - 10, pp, c4 => { c4.fillStyle = rgba(C.blue, 0.22); c4.beginPath(); c4.roundRect(-150, -24, 300, 48, 10); c4.fill(); linkIcon(c4, -122, 0, 22, C.cyan); tx(c4, 'enlace-skill', -96, 9, 24, { ...M, color: C.cyan }); }); x += 314; }
      const s = typed('instálala', t, T.inst - 0.25, 30); tx(c3, s, x, y, 28, M); if (live && Math.floor(t * 3) % 2 && t > T.abre + 1) { const cx = x + tw(c3, s, 28, M); c3.fillStyle = C.ink; c3.fillRect(cx + 3, y - 26, 14, 32); } } });
    rows.push({ h: 50, at: sent2, d: (c3, y) => { const ok = t > T.inst + 0.75; ok ? check(c3, 108, y - 9, 12, 1) : ring(c3, 108, y - 9, 9, t); tx(c3, 'Descargando la skill', 134, y, 26, { ...M, color: ok ? C.ink : C.cyan }); } });
    rows.push({ h: 50, at: T.inst + 0.5, d: (c3, y) => tx(c3, '└ ~/.claude/skills/reels-neon', 134, y, 24, { ...M, color: C.muted }) });
    rows.push({ h: 50, at: T.inst + 0.7, d: (c3, y) => { const pr = clamp((t - T.inst - 0.7) / 0.5); pr >= 1 ? check(c3, 108, y - 9, 12, 1) : ring(c3, 108, y - 9, 9, t); tx(c3, 'Dependencias', 134, y, 26, M);
      c3.fillStyle = 'rgba(143,163,184,0.2)'; c3.beginPath(); c3.roundRect(380, y - 18, 400, 14, 7); c3.fill(); c3.fillStyle = C.cyan; c3.beginPath(); c3.roundRect(380, y - 18, 400 * pr, 14, 7); c3.fill(); } });
    rows.push({ h: 74, at: doneInst, d: (c3, y) => pop(c3, 300, y - 9, ap(t, doneInst, 0.3), c4 => { c4.fillStyle = rgba(C.green, 0.16); c4.beginPath(); c4.roundRect(-210, -28, 420, 56, 14); c4.fill(); check(c4, -178, 0, 15, 1); tx(c4, 'Skill instalada', -150, 10, 28, { w: 700, color: C.green }); }) });
    // paso 3: pedir el reel
    const sent3 = T.quieras + 0.45;
    rows.push({ h: 84, at: B(9), d: (c3, y) => { const live = t < sent3; c3.save(); c3.strokeStyle = live ? rgba(C.blue, 0.8) : 'rgba(143,163,184,0.25)'; c3.lineWidth = 2; c3.beginPath(); c3.roundRect(90, y - 42, 900, 64, 12); c3.stroke(); c3.restore();
      tx(c3, '>', 110, y, 28, { ...M, color: C.claude }); const base = typed('hazme un reel sobre ', t, T.hazme - 0.05, 30); tx(c3, base, 146, y, 28, M);
      if (base.length >= 20) { const ti = t >= T.quieras - 0.1 ? 3 : Math.min(2, Math.floor((t - T.hazme - 0.6) / 0.38)); if (ti >= 0) tx(c3, TOPICS[ti], 146 + tw(c3, base, 28, M), y, 28, { ...M, color: C.cyan }); } } });
    rows.push({ h: 50, at: sent3, d: (c3, y) => { const ok = t > B(10) - 0.1; ok ? check(c3, 108, y - 9, 12, 1) : ring(c3, 108, y - 9, 9, t); tx(c3, ok ? 'reel.mp4 listo' : 'Creando tu reel…', 134, y, 26, { ...M, color: ok ? C.green : C.cyan }); } });
    let total = 0; const vis = rows.filter(r => t >= r.at); vis.forEach(r => total += r.h); const off = Math.max(0, total - (Ht - 150));
    let y = Y + 140 - off; vis.forEach(r => { c2.save(); c2.globalAlpha *= ap(t, r.at, 0.15); r.d(c2, y); c2.restore(); y += r.h; });
    c2.restore(); });
  // el reel que sale
  const pf = ap(t, T.hazme + 0.9, 0.45);
  if (pf > 0) { c.save(); c.translate((1 - out(pf)) * 500, 0); const X = 770, Y = 930, w = 250, h = 445;
    c.save(); c.shadowColor = rgba(C.cyan, 0.7); c.shadowBlur = 50; c.fillStyle = '#000'; c.beginPath(); c.roundRect(X - 12, Y - 12, w + 24, h + 24, 46); c.fill(); c.restore();
    cover(c, K.images[F('surf')], X, Y, w, h, 1.25 + 0.1 * clamp((t - T.quieras) / 2), 0, 0, 36);
    c.fillStyle = 'rgba(4,11,22,0.25)'; c.beginPath(); c.roundRect(X, Y, w, h, 36); c.fill();
    tx(c, 'TU REEL', X + w / 2, Y + 100, 34, { align: 'center', glow: rgba(C.cyan, 0.9), gb: 30 });
    const pr = clamp((t - T.hazme - 0.9) / Math.max(0.5, B(10) - 0.1 - T.hazme - 0.9)); c.fillStyle = 'rgba(255,255,255,0.3)'; c.fillRect(X + 24, Y + h - 40, w - 48, 6); c.fillStyle = C.cyan; c.fillRect(X + 24, Y + h - 40, (w - 48) * pr, 6);
    c.restore(); }
  mascota(c, K, M('orbe'), 170, 1385, 250, ap(t, B(9) + 0.1, 0.45), t); }

// 10 · CTA «Comenta REEL y te mando la skill gratis.» + firma
function sCta(c, t, K) { const fo = 1 - ap(t, T.endc, 0.3);
  if (fo > 0) { c.save(); c.globalAlpha *= fo;
    const g = c.createRadialGradient(540, 640, 0, 540, 640, 700); g.addColorStop(0, rgba(C.blue, 0.28)); g.addColorStop(1, rgba(C.blue, 0)); c.fillStyle = g; c.fillRect(0, 0, W, H);
    head(c, t, B(10) + 0.02, [{ s: 'Comenta' }], { y: 470, size: 88 });
    const fl = t < T.reel - 0.12 ? 0 : [1, 0.15, 0.9, 0.3, 1][Math.min(4, Math.floor((t - T.reel + 0.12) / 0.06))];
    c.save(); c.globalAlpha *= 0.25 + 0.75 * fl; c.save(); c.strokeStyle = C.cyan; c.lineWidth = 8; c.shadowColor = C.cyan; c.shadowBlur = 50 * fl + 6; c.beginPath(); c.roundRect(170, 545, 740, 230, 34); c.stroke(); c.stroke(); c.restore();
    tx(c, 'REEL', 540, 730, 190, { align: 'center', color: fl > 0.5 ? C.ink : 'rgba(248,250,252,0.4)', glow: rgba(C.cyan, fl), gb: 60 }); c.restore();
    mascota(c, K, M('senala'), 290, 1150, 440, ap(t, B(10) + 0.15, 0.5), t);
    [['La skill, gratis', T.gratis - 0.2], ['Te llega por mensaje', T.gratis + 0.15]].forEach(([s, at], i) => pop(c, 780, 1010 + i * 120, ap(t, at, 0.35), c2 => { glass(c2, -250, -48, 500, 96, { r: 48, gb: 26 }); check(c2, -200, 0, 22, ap(t, at + 0.15, 0.25)); tx(c2, s, -164, 10, 30, { w: 700 }); }));
    c.restore(); }
  firma(c, t, K, T.endc + 0.1, FIRMA); }

// ---------- montaje ----------
const SCN = [[0, s0], [B(1), s1], [B(2), s2], [B(3), s3], [B(4), s4], [B(5), s5], [B(6), s6], [B(7), sInst], [B(10), sCta]];
const FLASH = [...SCN.slice(1).map(s => s[0]), T.ahora, T.endc];
const subs = karaoke(WORDS);

export default {
  dur: END, fps: 30,
  images: [F('escritorio'), F('cafe'), ...PHOTOS.map(F), ...['saluda', 'asoma', 'piensa', 'base', 'senala', 'orbe'].map(M), FIRMA.foto, FIRMA.logo],
  render(K, t) { const c = K.ctx;
    fondo(c, t); escenas(c, t, K, SCN, END); destellos(c, t, FLASH); if (t < VOEND) subs(c, t); marcaAgua(c, '@rubentinedo.ia'); },
  // efectos: [nombre, segundo, opciones]  · nombres: whoosh, pop, impact, type ({dur}), title
  sonidos: () => [['title', 0.05], ['pop', T.claude], ['pop', 0.5], ...[0, 1, 2, 3].map(i => ['pop', lerp(T.solo - 0.1, T.fin, i / 3)]), ['impact', T.fin + 0.35],
    ...FLASH.map(x => ['whoosh', x - 0.08]), ['impact', T.plant + 0.1], ['pop', T.code - 0.1],
    ['pop', T.tema - 0.12], ['pop', T.inv], ['pop', T.guion], ['pop', T.estilo - 0.25], ['impact', T.estilo + 0.4],
    ['pop', T.voz - 0.12], ['pop', T.sinc], ...SYNC.map(w => ['pop', w.s]),
    ...PHOTOS.map((_, i) => ['pop', T.imgs + 0.05 + i * 0.16]), ['whoosh', T.mezcla - 0.18], ['impact', T.mezcla + 0.8], ['whoosh', T.revisa - 0.18], ['impact', T.revisa + 0.7], ['pop', T.editor], ['title', T.editor + 0.2],
    ['impact', T.dia], ['pop', T.cafe - 0.15], ...STEPS.map((_, i) => ['pop', T.pasos - 0.1 + i * 0.14]),
    ['pop', T.abre + 0.6], ['pop', T.pega + 0.05], ['impact', T.inst + 1.25], ['whoosh', T.hazme + 0.9], ['impact', B(10) - 0.1],
    ['impact', T.reel - 0.12], ['pop', T.gratis - 0.2], ['pop', T.gratis + 0.15], ['title', T.endc + 0.3],
    ['type', T.mov + 0.05, { dur: 1.6 }], ['type', B(2) + 0.25, { dur: 1.4 }], ['type', T.guion + 0.1, { dur: 1.2 }],
    ['type', T.abre + 0.05, { dur: 0.45 }], ['type', T.inst - 0.25, { dur: 0.4 }], ['type', T.hazme - 0.05, { dur: 0.8 }]],
};
