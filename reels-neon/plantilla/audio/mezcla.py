# Mezcla final de reels-neon: voz + música (baja sola cuando hablas) + efectos sintetizados → −14 LUFS.
# Uso (desde la carpeta del proyecto): python3 audio/mezcla.py <duración_en_s>
# Lee audio/vo.wav (si existe), audio/music.mp3 o audio/music.wav (si existe) y audio/sonidos.json (lo escribe render.mjs).
# Escribe audio/_mezcla.wav. Los efectos se generan por código: no hay archivos de sonido de terceros.
import json, os, subprocess, sys, wave
import numpy as np

SR = 48000
DUR = float(sys.argv[1]) if len(sys.argv) > 1 else 60.0
N = int(DUR * SR) + SR
rng = np.random.default_rng(7)

def load(path):
    if not os.path.exists(path): return None
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 's16le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768

def env(n, a, d):  # ataque/caída exponencial
    t = np.arange(n) / SR; return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)

def lowpass(x, k=6):  # suavizado barato (media móvil)
    return np.convolve(x, np.ones(k) / k, 'same')

def whoosh(o):
    n = int(0.5 * SR); t = np.arange(n) / SR; noise = rng.standard_normal(n)
    sweep = np.sin(np.pi * t / t[-1]) ** 2
    hi = noise - lowpass(noise, 3); lo = lowpass(noise, 24)
    mix = (lo * (1 - t / t[-1]) + hi * (t / t[-1]) * 0.6) * sweep
    return mix * 0.35
def pop(o):
    n = int(0.12 * SR); t = np.arange(n) / SR; f = 900 * np.exp(-t * 30) + 380
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.002, 0.035) * 0.35
def impact(o):
    n = int(0.7 * SR); t = np.arange(n) / SR; f = 110 * np.exp(-t * 6) + 42
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.003, 0.22)
    hit = lowpass(rng.standard_normal(n), 4) * env(n, 0.001, 0.03)
    return (body * 0.75 + hit * 0.25) * 0.6
def type_(o):
    d = float(o.get('dur', 0.8)); n = int(d * SR); x = np.zeros(n, np.float32); i = 0
    while i < n - 2000:
        m = 900; c = rng.standard_normal(m) * env(m, 0.0005, 0.004); c -= lowpass(c, 5)
        x[i:i + m] += c * rng.uniform(0.12, 0.22); i += int(SR * rng.uniform(0.045, 0.09))
    return x
def title(o):
    n = int(1.1 * SR); t = np.arange(n) / SR; x = np.zeros(n)
    for f in (523.25, 659.25, 783.99, 1046.5): x += np.sin(2 * np.pi * f * t) * (0.5 + 0.5 * np.sin(2 * np.pi * 5 * t + f))
    return x * env(n, 0.04, 0.35) * 0.08

SYN = {'whoosh': whoosh, 'pop': pop, 'impact': impact, 'type': type_, 'title': title}

out = np.zeros(N, np.float32)
vo = load('audio/vo.wav')
music = load('audio/music.mp3') if os.path.exists('audio/music.mp3') else load('audio/music.wav')

# voz
if vo is not None: out[:min(N, len(vo))] += vo[:N]
# música con «ducking»: baja ~45 % mientras hay voz
if music is not None:
    m = np.zeros(N, np.float32); m[:min(N, len(music))] = music[:N]
    m *= 0.06 / (np.sqrt(np.mean(music ** 2)) + 1e-9)          # nivel de referencia de la música
    if vo is not None:
        v = np.zeros(N, np.float32); v[:min(N, len(vo))] = np.abs(vo[:N])
        k = int(0.25 * SR); e = np.convolve(v, np.ones(k) / k, 'same'); e = np.clip(e / (np.percentile(e[e > 0], 90) + 1e-9), 0, 1) if (e > 0).any() else e
        m *= 1 - 0.45 * e
    fade = int(1.5 * SR); end = int(DUR * SR); m[end - fade:end] *= np.linspace(1, 0, fade); m[end:] = 0
    out += m
# efectos
cues = json.load(open('audio/sonidos.json')) if os.path.exists('audio/sonidos.json') else []
for c in cues:
    fn = SYN.get(c['name']);
    if not fn: continue
    s = fn(c).astype(np.float32) * float(c.get('vol', 1)); i = int(c['at'] * SR)
    if i < 0 or i >= N: continue
    j = min(N, i + len(s)); out[i:j] += s[:j - i]

out = out[:int(DUR * SR)]
out /= max(1.0, np.max(np.abs(out)) / 0.95)
with wave.open('audio/_crudo.wav', 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out * 32767).astype(np.int16).tobytes())
# −14 LUFS para Instagram/TikTok (aresample después de loudnorm: si no, algunos reproductores lo leen mudo)
# −14 LUFS: mide, sube la ganancia que falte y limita los picos a −1,5 dBTP
def medir(f):
    r = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', f, '-af', 'loudnorm=print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
    return float(json.loads(r[r.rindex('{'):r.rindex('}') + 1])['input_i'])
g = -14 - medir('audio/_crudo.wav')
for _ in range(3):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', 'audio/_crudo.wav', '-af', f'volume={g:.2f}dB,alimiter=limit=0.84:attack=3:release=60:level=disabled,aresample=48000', '-ac', '2', '-c:a', 'pcm_s16le', 'audio/_mezcla.wav'], check=True)
    d = -14 - medir('audio/_mezcla.wav')
    if abs(d) < 0.3: break
    g += d
os.remove('audio/_crudo.wav')
print(f'mezcla: audio/_mezcla.wav · {len(cues)} efectos · voz {"sí" if vo is not None else "no"} · música {"sí" if music is not None else "no"}')
