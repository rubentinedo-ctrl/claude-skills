// Motor de reels-neon: dibuja un vídeo (video.js) en un lienzo 1080×1920.
// · En el navegador: vista previa con la voz y la música (clic para reproducir).
// · Con render.mjs: dibuja fotograma a fotograma para hacer el MP4.
const q = new URLSearchParams(location.search), FILE = q.get('video') || 'video.js', RENDER = q.has('render');
const canvas = document.getElementById('stage'), ctx = canvas.getContext('2d');
const loadImg = src => new Promise(res => { const i = new Image(); i.onload = () => res(i); i.onerror = () => { console.warn('No se pudo cargar la imagen', src); res(null); }; i.src = src; });

const v = (await import('./' + FILE + '?v=' + Date.now())).default;
const images = {};
await Promise.all((v.images || []).map(async s => { const i = await loadImg(s); if (i?.decode) await i.decode().catch(() => {}); images[s] = i; }));
await Promise.all(['500 40px Inter', '600 40px Inter', '700 40px Inter', '800 40px Inter', '400 30px "JetBrains Mono"', '500 30px "JetBrains Mono"'].map(f => document.fonts.load(f).catch(() => {})));
await document.fonts.ready;

const K = { ctx, images, W: 1080, H: 1920 };
window.renderAt = t => { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0, 0, 1080, 1920); v.render(K, t); ctx.restore(); };
window.getCues = () => (v.sonidos ? v.sonidos() : []).filter(c => c && isFinite(c[1])).map(([name, at, o]) => ({ name, at: +(+at).toFixed(3), ...(o || {}) })).sort((a, b) => a.at - b.at);
window.VIDEO = { dur: v.dur, fps: v.fps || 30 };

if (!RENDER) { // vista previa
  const fixed = q.get('t'); if (fixed != null) { window.renderAt(+fixed); }
  else {
    const vo = new Audio('audio/vo.wav'), mu = new Audio('audio/music.mp3'); mu.onerror = () => { if (!mu.src.endsWith('.wav')) mu.src = 'audio/music.wav'; }; mu.volume = 0.35; let playing = false, t0 = 0, base = 0;
    const now = () => playing ? base + (performance.now() - t0) / 1000 : base;
    const sync = () => { for (const a of [vo, mu]) { a.currentTime = Math.min(now(), (a.duration || 1e9) - 0.01); playing ? a.play().catch(() => {}) : a.pause(); } };
    canvas.onclick = () => { base = now(); playing = !playing; t0 = performance.now(); sync(); };
    addEventListener('keydown', e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { base = Math.max(0, now() + (e.key === 'ArrowRight' ? 1 : -1)); t0 = performance.now(); sync(); } });
    const loop = () => { let t = now(); if (t > v.dur) { base = 0; t0 = performance.now(); t = 0; sync(); } window.renderAt(t); requestAnimationFrame(loop); }; loop();
  }
}
