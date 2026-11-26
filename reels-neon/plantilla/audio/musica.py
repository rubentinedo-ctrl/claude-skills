# Música de fondo básica, generada por código (synthwave sencilla, sin derechos de terceros).
# Uso: python3 audio/musica.py <duración_s> [bpm=112] [salida=audio/music.wav]
# Para un resultado más profesional usa tu propia pista: ponla en audio/music.mp3 y no ejecutes esto.
import sys, wave, numpy as np
SR = 44100
DUR = float(sys.argv[1]) if len(sys.argv) > 1 else 50
BPM = float(sys.argv[2]) if len(sys.argv) > 2 else 112
OUT = sys.argv[3] if len(sys.argv) > 3 else 'audio/music.wav'
rng = np.random.default_rng(3)
beat = 60 / BPM; bar = beat * 4; N = int(DUR * SR); x = np.zeros(N)
hz = lambda m: 440 * 2 ** ((m - 69) / 12)
# La menor – Fa – Do – Sol
PROG = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]

def saw(f, t, h=7):
    return sum(np.sin(2 * np.pi * f * k * t) / k for k in range(1, h + 1)) * 0.6
def add(sig, at):
    i = int(at * SR); j = min(N, i + len(sig))
    if i < N: x[i:j] += sig[:j - i]
def env(n, a, d):
    t = np.arange(n) / SR; return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)

nbars = int(DUR / bar) + 1
for b in range(nbars):
    ch = PROG[b % 4]; t0 = b * bar
    # pad (acorde largo, ataque suave)
    n = int(bar * SR); t = np.arange(n) / SR
    pad = sum(saw(hz(m), t, 5) + saw(hz(m) * 1.004, t, 5) for m in ch) / 6
    add(pad * np.minimum(1, t / 0.35) * np.minimum(1, (bar - t) / 0.2) * 0.10, t0)
    # bajo en corcheas
    for k in range(8):
        n = int(beat / 2 * SR); t = np.arange(n) / SR
        add(saw(hz(ch[0] - 12), t, 4) * env(n, 0.004, 0.16) * 0.22, t0 + k * beat / 2)
    # arpegio en semicorcheas (entra a partir del 2.º compás)
    if b >= 1:
        notes = [ch[0] + 12, ch[1] + 12, ch[2] + 12, ch[1] + 12]
        for k in range(16):
            n = int(beat / 4 * SR); t = np.arange(n) / SR; f = hz(notes[k % 4])
            add(np.sign(np.sin(2 * np.pi * f * t)) * 0.5 * env(n, 0.002, 0.07) * 0.05, t0 + k * beat / 4)
    # batería
    for k in range(4):
        n = int(0.35 * SR); t = np.arange(n) / SR; f = 120 * np.exp(-t * 25) + 45
        add(np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.002, 0.12) * 0.55, t0 + k * beat)          # bombo
        if k % 2:
            n2 = int(0.22 * SR); add(rng.standard_normal(n2) * env(n2, 0.001, 0.06) * 0.16, t0 + k * beat)  # caja
        for hh in (0, 0.5):
            n3 = int(0.05 * SR); s = rng.standard_normal(n3); s -= np.convolve(s, np.ones(4) / 4, 'same')
            add(s * env(n3, 0.0005, 0.012) * 0.07, t0 + (k + hh) * beat)                                    # charles

fi, fo = int(0.4 * SR), int(2.0 * SR)
x[:fi] *= np.linspace(0, 1, fi); x[-fo:] *= np.linspace(1, 0, fo)
x /= np.max(np.abs(x)) / 0.8
with wave.open(OUT, 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype(np.int16).tobytes())
print(f'música: {OUT} · {DUR:.1f} s · {BPM:.0f} bpm')
