// GALERÍA DE PIEZAS GENÉRICAS de neon.js (sin voz, sin mascota, sin fotos). Sirve para ver qué hay y copiar el uso.
// Los textos y números son de relleno: en un reel real, escribe los del tema y usa solo cifras reales.
// Verla:  node render.mjs --video piezas.demo.js --every 1   ·   o en el navegador: index.html?video=piezas.demo.js
import { C, W, H, MONO, ap, lerp, sm, tx, head, glass, check, pill, fondo, escenas, destellos, movil, icono, NOMBRES_ICONOS, xmark, numero, tarjeta,
  lista, comparativa, barras, burbujas, flecha, sello, cartel, parrafo } from './neon.js';

const D = 4;                      // segundos por escena
const at = (i, x) => i * D + x;   // segundo x dentro de la escena i

function sIconos(c, t) { head(c, t, 0.1, [{ s: 'Iconos' }, { s: 'para cualquier tema', pill: true, at: 0.4 }], { y: 300, size: 76 });
  NOMBRES_ICONOS.forEach((n, i) => { const x = 150 + (i % 6) * 156, y = 560 + Math.floor(i / 6) * 175;
    icono(c, n, x, y, 70, { disco: true, p: ap(t, 0.5 + i * 0.05, 0.35) }); tx(c, n, x, y + 88, 20, { f: MONO, w: 500, align: 'center', color: C.muted }); }); }
function sNumero(c, t) { head(c, t, at(1, 0.1), [{ s: 'Número grande' }, { s: 'que cuenta', pill: true, at: at(1, 0.4) }], { y: 300, size: 80 });
  numero(c, t, 540, 860, 260, 3, at(1, 0.6), { label: 'PASOS' }); sello(c, 540, 1300, 'LISTO', ap(t, at(1, 2.2), 0.4)); }
function sLista(c, t) { head(c, t, at(2, 0.1), [{ s: 'Lista con checks' }], { y: 300, size: 80 });
  lista(c, t, 120, 480, 840, [{ s: 'Primera idea, en una línea', at: at(2, 0.5) }, { s: 'Segunda idea, en su palabra', at: at(2, 0.9) }, { s: 'Tercera idea, con su check', at: at(2, 1.3) }]);
  lista(c, t, 120, 880, 840, [{ s: 'Lo que conviene evitar', at: at(2, 2.0) }], { icono: 'x' }); }
function sComp(c, t) { head(c, t, at(3, 0.1), [{ s: 'Antes' }, { s: 'y ahora', pill: true, at: at(3, 0.4) }], { y: 300, size: 80 });
  comparativa(c, t, 60, 480, 960, { titulo: 'Antes', items: [{ s: 'Cómo se hacía', at: at(3, 0.7) }, { s: 'Lo que fallaba', at: at(3, 1.0) }] },
    { titulo: 'Ahora', items: [{ s: 'Cómo se hace ahora', at: at(3, 1.6) }, { s: 'Lo que mejora', at: at(3, 1.9) }] }); }
function sBarras(c, t) { head(c, t, at(4, 0.1), [{ s: 'Barras' }, { s: 'que crecen', pill: true, at: at(4, 0.4) }], { y: 300, size: 80 });
  barras(c, t, 140, 560, 800, 700, [{ label: 'A', v: 1, col: '#64748B' }, { label: 'B', v: 2, col: C.bdark }, { label: 'C', v: 4, col: C.cyan, valor: '★' }], at(4, 0.6));
  tx(c, 'Ejemplo ilustrativo, sin datos reales', 540, 1400, 24, { f: MONO, w: 500, align: 'center', color: C.muted }); }
function sChat(c, t, K) { head(c, t, at(5, 0.1), [{ s: 'Chat dentro' }, { s: 'de un móvil', pill: true, at: at(5, 0.4) }], { y: 300, size: 80 });
  movil(c, K, null, 250, 470, 580, 960, t, 0, '', (c2, x, y, w, h) => { c2.fillStyle = '#0E2038'; c2.fillRect(x, y, w, 96); icono(c2, 'usuario', x + 60, y + 50, 44, { disco: true });
    tx(c2, 'Contacto', x + 110, y + 60, 30, { w: 700 });
    burbujas(c2, t, x + 24, y + 130, w - 48, [{ de: 'yo', s: 'Hola, ¿tenéis hueco mañana?', at: at(5, 0.6) }, { de: 'otro', s: 'Sí, a primera hora. ¿Te va bien?', at: at(5, 1.6) }, { de: 'yo', s: '¡Perfecto, gracias!', at: at(5, 2.8) }], { size: 40, alto: 780 }); }); }
function sTarjetas(c, t) { head(c, t, at(6, 0.1), [{ s: 'Tarjetas' }, { s: 'con icono', pill: true, at: at(6, 0.4) }], { y: 300, size: 80 });
  [['idea', 'Título de la tarjeta', 'Una línea que lo explica'], ['calendario', 'Otra tarjeta', 'Con su icono y su texto'], ['estrella', 'La tercera', 'Entran escalonadas']].forEach(([ic, ti, te], i) =>
    tarjeta(c, 90, 490 + i * 250, 900, 210, { icono: ic, titulo: ti, texto: te, p: ap(t, at(6, 0.6 + i * 0.35), 0.4) }));
  flecha(c, 540, 1280, 540, 1420, ap(t, at(6, 2), 0.5)); }
function sCta(c, t) { head(c, t, at(7, 0.1), [{ s: 'Comenta' }], { y: 470, size: 88 }); cartel(c, t, 540, 660, 'PALABRA', at(7, 0.5));
  [['Lo que recibe', at(7, 1.2)], ['Cómo le llega', at(7, 1.5)]].forEach(([s, a], i) => { const p = ap(t, a, 0.35); if (p > 0) { glass(c, 290, 1000 + i * 120, 500, 96, { r: 48 }); check(c, 340, 1048 + i * 120, 22, p); tx(c, s, 376, 1058 + i * 120, 30, { w: 700, alpha: p }); } }); }

const SCN = [sIconos, sNumero, sLista, sComp, sBarras, sChat, sTarjetas, sCta].map((f, i) => [i * D, f]);
export default { dur: SCN.length * D, fps: 30, images: [],
  render(K, t) { const c = K.ctx; fondo(c, t); escenas(c, t, K, SCN, SCN.length * D); destellos(c, t, SCN.slice(1).map(s => s[0])); } };
