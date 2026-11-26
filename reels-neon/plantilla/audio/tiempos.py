# Corta la narración por escenas (una por línea de guion.txt), deja una respiración entre ellas
# y escribe audio/vo.wav, audio/words.json y timing.js (inicio, duración y palabras de cada escena).
# Uso (desde la carpeta del proyecto): python3 audio/tiempos.py <toma>
#   <toma> = nombre sin extensión de audio/<toma>.mp3 + audio/<toma>.json (de voz.py o de Whisper).
# Opcional, audio/cortes.json:
#   {"tomas": {"8": "tomaA"},                   ← escena 8 (contando desde 0) sacada de otra toma
#    "ventanas": {"tomaB": {"5": [25.6, 26.35]}}, ← dónde buscar el silencio si un corte cae mal
#    "arreglos": {"narracion": "narración"}}     ← correcciones de texto de los subtítulos
import json, os, subprocess, sys, unicodedata, wave
import numpy as np

SR = 44100; LEAD, GAP, TAIL = 0.3, 0.3, 0.6
MAIN = sys.argv[1] if len(sys.argv) > 1 else 'toma'
CFG = json.load(open('audio/cortes.json')) if os.path.exists('audio/cortes.json') else {}
SRC = {int(k): v for k, v in CFG.get('tomas', {}).items()}
FIX = CFG.get('arreglos', {})
NUM = {'uno': '1', 'dos': '2', 'tres': '3', 'cuatro': '4', 'cinco': '5', 'seis': '6', 'siete': '7', 'ocho': '8', 'nueve': '9', 'diez': '10'}
norm = lambda w: ''.join(c for c in unicodedata.normalize('NFD', w.lower()) if c.isalnum() and ord(c) < 128)
LINES = [l.strip() for l in open('guion.txt', encoding='utf-8') if l.strip()]
STARTS = [norm(l.split()[0]) for l in LINES]
same = lambda a, b: a == b or NUM.get(a) == b or NUM.get(b) == a

def load(take):
    a = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', f'audio/{take}.mp3', '-f', 's16le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True, check=True).stdout, dtype=np.int16).astype(np.float32) / 32768
    win = int(0.01 * SR); rms = np.sqrt(np.convolve(a ** 2, np.ones(win) / win, 'same'))
    words = [w for s in json.load(open(f'audio/{take}.json'))['segments'] for w in s['words']]
    idx = []; j = 0
    for k, st in enumerate(STARTS):
        while j < len(words) and not same(norm(words[j]['word']), st): j += 1
        if j >= len(words): sys.exit(f'No encuentro el inicio de la escena {k} («{LINES[k][:40]}») en {take}. Revisa que guion.txt y la voz digan lo mismo.')
        idx.append(j); j += 1
    def quiet_before(t, back=0.5):
        i0, i1 = max(0, int((t - back) * SR)), max(1, int((t - 0.02) * SR)); return (i0 + int(np.argmin(rms[i0:i1]))) / SR
    cuts = [0.0] + [quiet_before(words[i]['start']) for i in idx[1:]] + [len(a) / SR]
    for k, (lo, hi) in CFG.get('ventanas', {}).get(take, {}).items():
        i0, i1 = int(lo * SR), int(hi * SR); cuts[int(k)] = (i0 + int(np.argmin(rms[i0:i1]))) / SR
    return dict(a=a, words=words, cuts=cuts)

takes = {t: load(t) for t in {MAIN, *SRC.values()}}
out = [np.zeros(int(LEAD * SR), np.float32)]; t = LEAD; scenes = []; W = []
for k in range(len(STARTS)):
    D = takes[SRC.get(k, MAIN)]; cuts = D['cuts']
    seg = D['a'][int(cuts[k] * SR):int(cuts[k + 1] * SR)].copy(); f = int(0.008 * SR); seg[:f] *= np.linspace(0, 1, f); seg[-f:] *= np.linspace(1, 0, f)
    gap = GAP if k < len(STARTS) - 1 else TAIL; sw = []
    for w in D['words']:
        if cuts[k] <= w['end'] - 0.08 < cuts[k + 1]:          # por el final: Whisper a veces pega palabras sin pausa
            ww = w['word'].strip(); ww = FIX.get(ww, ww); s0 = max(w['start'], cuts[k] + 0.02)
            g = {'w': ww, 's': round(t + s0 - cuts[k], 3), 'e': round(t + w['end'] - cuts[k], 3)}; W.append(g); sw.append({'w': ww, 's': round(g['s'] - t if k else g['s'], 3)})
    start = t if k else 0.0
    out.append(seg); t += len(seg) / SR; out.append(np.zeros(int(gap * SR), np.float32)); t += gap
    scenes.append({'start': round(start, 3), 'dur': round(t - start, 3), 'words': sw})
y = np.concatenate(out)
with wave.open('audio/vo.wav', 'wb') as wf: wf.setnchannels(1); wf.setsampwidth(2); wf.setframerate(SR); wf.writeframes((np.clip(y, -1, 1) * 32767).astype(np.int16).tobytes())
json.dump(W, open('audio/words.json', 'w'), ensure_ascii=False)
open('timing.js', 'w').write('// generado por audio/tiempos.py — no editar a mano\nexport const SC = ' + json.dumps(scenes, ensure_ascii=False) + ';\n')
print(f'voz montada: {t:.2f} s')
for k, s in enumerate(scenes): print(f'{k:>2}  {s["start"]:6.2f}s  {s["dur"]:5.2f}s  ' + ' '.join(w['w'] for w in s['words'])[:70])
