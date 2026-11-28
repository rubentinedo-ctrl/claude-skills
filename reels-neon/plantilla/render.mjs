// Render de reels-neon.
//   node render.mjs                         → vídeo mudo _mudo.mp4 + audio/sonidos.json
//   node render.mjs --stills 1,5.5,9        → añade fotogramas sueltos a stills/ (no borra los que hay)
//   node render.mjs --every 1.5             → vacía stills/ y saca un fotograma cada 1,5 s
//   --video otro.js   (por defecto video.js)    --out nombre.mp4
import { chromium } from 'playwright';
import http from 'http'; import fs from 'fs'; import path from 'path'; import { spawn } from 'child_process';

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const root = process.cwd(), video = arg('--video', 'video.js');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.json': 'application/json', '.wav': 'audio/wav', '.mp3': 'audio/mpeg' };
const srv = http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (!(p === root || p.startsWith(root + path.sep)) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(p).toLowerCase()] || 'application/octet-stream' }); fs.createReadStream(p).pipe(res);
});
await new Promise(r => srv.listen(0, '127.0.0.1', r));   // solo en este ordenador
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
page.on('console', m => { if (['warning', 'error'].includes(m.type())) console.log('[página]', m.text()); });
page.on('pageerror', e => console.log('[error en video.js]', e.message));
await page.goto(`http://127.0.0.1:${srv.address().port}/index.html?video=${encodeURIComponent(video)}&render=1`);
await page.waitForFunction(() => window.VIDEO, null, { timeout: 90000 });
const { dur, fps } = await page.evaluate(() => window.VIDEO);
const grab = async (t, q = 0.92) => Buffer.from(await page.evaluate(([t, q]) => { window.renderAt(t); return document.getElementById('stage').toDataURL('image/jpeg', q).split(',')[1]; }, [t, q]), 'base64');

const stills = arg('--stills'), every = arg('--every');
if (stills || every) {
  const ts = stills ? stills.split(',').map(Number) : Array.from({ length: Math.floor(dur / +every) + 1 }, (_, i) => +(i * +every).toFixed(2));
  if (every) fs.rmSync('stills', { recursive: true, force: true });   // --every rehace la tanda; --stills añade sin borrar
  fs.mkdirSync('stills', { recursive: true });
  for (const t of ts) fs.writeFileSync(`stills/s_${t.toFixed(2).padStart(6, '0')}.jpg`, await grab(t, 0.85));
  console.log(`${ts.length} fotogramas → stills/  (duración ${dur.toFixed(2)} s)`);
} else {
  const out = arg('--out', '_mudo.mp4'), n = Math.round(dur * fps);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let i = 0; i < n; i++) {
    const b = await grab(i / fps); if (!ff.stdin.write(b)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 30 === 0) process.stdout.write(`\rfotograma ${i}/${n}`);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r));
  fs.mkdirSync('audio', { recursive: true });
  fs.writeFileSync('audio/sonidos.json', JSON.stringify(await page.evaluate(() => window.getCues()), null, 1));
  console.log(`\nvídeo mudo: ${out} (${dur.toFixed(2)} s)`);
}
await browser.close(); srv.close();
