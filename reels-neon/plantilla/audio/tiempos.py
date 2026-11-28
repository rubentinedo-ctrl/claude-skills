# Corta la narración por escenas (una por línea de guion.txt), deja una respiración entre ellas
# y escribe audio/vo.wav, audio/words.json y timing.js (inicio, duración y palabras de cada escena).
# Uso (desde la carpeta del proyecto): python3 audio/tiempos.py <toma>
#   <toma> = nombre sin extensión de audio/<toma>.mp3 + audio/<toma>.json (de voz.py o de Whisper).
#
# Los subtítulos salen del TEXTO DE guion.txt (con sus tildes, mayúsculas y «Uno:»), no de lo que oye
# Whisper: el script alinea cada palabra del guion con la palabra de la voz y le pone su tiempo.
# Así no hace falta corregir «1.» → «Uno:», «plantas» → «PLANTAS» ni «aleja la» → «aléjala».
#
# Opcional, audio/cortes.json:
#   {"tomas": {"8": "tomaA"},                   ← escena 8 (contando desde 0) sacada de otra toma
#    "ventanas": {"tomaB": {"5": [25.6, 26.35]}}, ← dónde buscar el silencio si un corte cae mal
#    "arreglos": {"narracion": "narración"}}     ← correcciones de texto de los subtítulos (casi nunca hace falta)
import difflib, json, os, subprocess, sys, unicodedata, wave
import numpy as np

SR = 44100; LEAD, GAP, TAIL = 0.3, 0.3, 0.6
MAIN = sys.argv[1] if len(sys.argv) > 1 else 'toma'
CFG = json.load(open('audio/cortes.json')) if os.path.exists('audio/cortes.json') else {}
SRC = {int(k): v for k, v in CFG.get('tomas', {}).items()}
FIX = CFG.get('arreglos', {})
NUMW = {'1': 'uno', '2': 'dos', '3': 'tres', '4': 'cuatro', '5': 'cinco', '6': 'seis', '7': 'siete', '8': 'ocho', '9': 'nueve', '10': 'diez'}
norm = lambda w: ''.join(c for c in unicodedata.normalize('NFD', w.lower()) if c.isalnum() and ord(c) < 128)
key = lambda w: NUMW.get(norm(w), norm(w))

LINES = [l.strip() for l in open('guion.txt', encoding='utf-8') if l.strip()]
G = [(k, w) for k, l in enumerate(LINES) for w in l.split() if norm(w)]      # palabras del guion: (línea, texto)
FIRST = [next(i for i, g in enumerate(G) if g[0] == k) for k in range(len(LINES))]
warn = []

def align(words):
    """Tiempo (inicio, fin) de cada palabra del guion según las palabras que reconoció la voz."""
    a, b = [key(g[1]) for g in G], [key(w['word']) for w in words]
    T = [None] * len(G)
    for op, i1, i2, j1, j2 in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes():
        if op == 'equal':
            for d in range(i2 - i1): T[i1 + d] = (words[j1 + d]['start'], words[j1 + d]['end'])
        elif op == 'replace':                      # p. ej. «aléjala» ↔ «aleja la», «Uno:» ↔ «1.»
            s, e = words[j1]['start'], words[j2 - 1]['end']; L = [max(1, len(a[i])) for i in range(i1, i2)]; acc = 0
            for n, i in enumerate(range(i1, i2)): T[i] = (s + (e - s) * acc / sum(L), s + (e - s) * (acc + L[n]) / sum(L)); acc += L[n]
    miss = [i for i, x in enumerate(T) if x is None]
    if len(miss) > len(G) * 0.15: sys.exit(f'La voz no coincide con guion.txt ({len(miss)} de {len(G)} palabras sin encontrar). Revisa que digan lo mismo.')
    for i in miss:                                 # palabras que la voz no reconoció: entre sus vecinas
        p = next((T[j][1] for j in range(i - 1, -1, -1) if T[j]), 0.0); q = next((T[j][0] for j in range(i + 1, len(T)) if T[j]), p + 0.4)
        T[i] = (p, max(p + 0.05, q))
    return T

def load(take):
    a = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', f'audio/{take}.mp3', '-f', 's16le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True, check=True).stdout, dtype=np.int16).astype(np.float32) / 32768
    win = int(0.02 * SR); rms = np.sqrt(np.convolve(a ** 2, np.ones(win) / win, 'same'))
    words = [w for s in json.load(open(f'audio/{take}.json'))['segments'] for w in s['words'] if norm(w['word'])]
    T = align(words)

    def silence(k):
        # Busca el silencio entre la línea anterior y la primera palabra de esta, a los dos lados del inicio que
        # dio el reconocedor (Whisper a veces adelanta o atrasa el inicio unas décimas). Elige el tramo silencioso
        # más largo de la ventana y corta en su centro.
        i = FIRST[k]; s, e = T[i]; pe = T[i - 1][1]
        lo, hi = max(pe - 0.15, s - 0.5, 0), min(s + 0.35, s + (e - s) * 0.5 if e > s + 0.1 else s + 0.05)
        if hi - lo < 0.06: lo, hi = s - 0.25, s + 0.02
        i0, i1 = int(lo * SR), max(int(lo * SR) + 2, int(hi * SR)); r = rms[i0:i1]
        thr = r.min() + 0.2 * (np.percentile(r, 90) - r.min()); best, cur, bs = (0, i0), 0, 0
        for n, v in enumerate(r):
            if v <= thr: cur += 1; bs = bs if cur > 1 else n
            else: cur = 0
            if cur > best[0]: best = (cur, i0 + bs)
        cut = (best[1] + best[0] / 2) / SR
        if abs(cut - s) > 0.3: warn.append(f'escena {k}: el corte ({cut:.2f} s) cae lejos del inicio de «{G[i][1]}» ({s:.2f} s). Escúchalo; si suena mal, usa «ventanas» en audio/cortes.json.')
        return cut

    cuts = [0.0] + [silence(k) for k in range(1, len(LINES))] + [len(a) / SR]
    for k, (lo, hi) in CFG.get('ventanas', {}).get(take, {}).items():
        i0, i1 = int(lo * SR), int(hi * SR); cuts[int(k)] = (i0 + int(np.argmin(rms[i0:i1]))) / SR
    return dict(a=a, T=T, cuts=cuts)

takes = {t: load(t) for t in {MAIN, *SRC.values()}}
out = [np.zeros(int(LEAD * SR), np.float32)]; t = LEAD; scenes = []; W = []
for k in range(len(LINES)):
    D = takes[SRC.get(k, MAIN)]; cuts = D['cuts']
    seg = D['a'][int(cuts[k] * SR):int(cuts[k + 1] * SR)].copy(); f = int(0.008 * SR); seg[:f] *= np.linspace(0, 1, f); seg[-f:] *= np.linspace(1, 0, f)
    gap = GAP if k < len(LINES) - 1 else TAIL; sw = []
    for i, (line, txt) in enumerate(G):
        if line != k: continue
        s0, e0 = D['T'][i]; s0 = min(max(s0, cuts[k] + 0.02), cuts[k + 1] - 0.05); e0 = min(max(e0, s0 + 0.05), cuts[k + 1])
        ww = FIX.get(txt, txt); g = {'w': ww, 's': round(t + s0 - cuts[k], 3), 'e': round(t + e0 - cuts[k], 3)}; W.append(g)
        sw.append({'w': ww, 's': round(g['s'] - t if k else g['s'], 3)})
    start = t if k else 0.0
    out.append(seg); t += len(seg) / SR; out.append(np.zeros(int(gap * SR), np.float32)); t += gap
    scenes.append({'start': round(start, 3), 'dur': round(t - start, 3), 'words': sw})
y = np.concatenate(out)
with wave.open('audio/vo.wav', 'wb') as wf: wf.setnchannels(1); wf.setsampwidth(2); wf.setframerate(SR); wf.writeframes((np.clip(y, -1, 1) * 32767).astype(np.int16).tobytes())
json.dump(W, open('audio/words.json', 'w'), ensure_ascii=False)
open('timing.js', 'w').write('// generado por audio/tiempos.py — no editar a mano\nexport const SC = ' + json.dumps(scenes, ensure_ascii=False) + ';\n')
print(f'voz montada: {t:.2f} s')
for k, s in enumerate(scenes): print(f'{k:>2}  {s["start"]:6.2f}s  {s["dur"]:5.2f}s  ' + ' '.join(w['w'] for w in s['words'])[:70])
for w in warn: print('AVISO:', w)
print('Escucha audio/vo.wav: cada escena debe empezar limpia con su frase.' if not warn else 'Revisa los avisos antes de seguir.')
