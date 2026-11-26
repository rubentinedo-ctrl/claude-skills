# Genera la narración con ElevenLabs y guarda los tiempos de cada palabra (no hace falta Whisper).
# Uso (desde la carpeta del proyecto):
#   python3 audio/voz.py <VOICE_ID> [nombre_toma=toma] [modelo=eleven_multilingual_v2]
# Lee guion.txt (una frase/escena por línea). Necesita ELEVENLABS_API_KEY en el entorno o en un archivo .env
# (en la carpeta del proyecto o en la de la skill). Escribe audio/<toma>.mp3 y audio/<toma>.json (palabras con tiempos).
import base64, json, os, sys, urllib.request, pathlib

def key():
    if os.environ.get('ELEVENLABS_API_KEY'): return os.environ['ELEVENLABS_API_KEY']
    here = pathlib.Path(__file__).resolve()
    for d in [pathlib.Path.cwd(), *here.parents]:
        f = d / '.env'
        if f.exists():
            for line in f.read_text().splitlines():
                if line.strip().startswith('ELEVENLABS_API_KEY='): return line.split('=', 1)[1].strip().strip('"\'')
    sys.exit('Falta ELEVENLABS_API_KEY: ponla en un archivo .env (ELEVENLABS_API_KEY=...) en la carpeta del proyecto.')

if len(sys.argv) < 2: sys.exit(__doc__ or 'Uso: python3 audio/voz.py <VOICE_ID> [toma] [modelo]')
VOICE, TAKE = sys.argv[1], (sys.argv[2] if len(sys.argv) > 2 else 'toma')
MODEL = sys.argv[3] if len(sys.argv) > 3 else 'eleven_multilingual_v2'
text = ' '.join(l.strip() for l in open('guion.txt', encoding='utf-8') if l.strip())

req = urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{VOICE}/with-timestamps?output_format=mp3_44100_128',
    data=json.dumps({'text': text, 'model_id': MODEL}).encode(), headers={'xi-api-key': key(), 'Content-Type': 'application/json'})
try:
    with urllib.request.urlopen(req, timeout=300) as r: d = json.load(r)
except urllib.error.HTTPError as e:
    sys.exit(f'ElevenLabs respondió {e.code}: {e.read().decode()[:400]}')
open(f'audio/{TAKE}.mp3', 'wb').write(base64.b64decode(d['audio_base64']))

# caracteres con tiempos → palabras (mismo formato que Whisper, así tiempos.py sirve para los dos)
al = d.get('alignment') or d.get('normalized_alignment'); words = []; cur = None
for ch, s, e in zip(al['characters'], al['character_start_times_seconds'], al['character_end_times_seconds']):
    if ch.isspace():
        if cur: words.append(cur); cur = None
        continue
    if cur is None: cur = {'word': ' ' + ch, 'start': s, 'end': e}
    else: cur['word'] += ch; cur['end'] = e
if cur: words.append(cur)
json.dump({'text': text, 'segments': [{'words': words}]}, open(f'audio/{TAKE}.json', 'w'), ensure_ascii=False)
print(f'voz: audio/{TAKE}.mp3 · {len(words)} palabras · {words[-1]["end"]:.1f} s')
