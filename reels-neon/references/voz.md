# Voz y tiempos

El reel se sincroniza con la voz: cada escena empieza con su frase y cada animación cae en su palabra.
Para eso hacen falta el audio y **el tiempo de cada palabra**.

## Opción A: ElevenLabs por API (recomendada)
1. Crea `.env` en la carpeta del proyecto con `ELEVENLABS_API_KEY=...`. Nunca la pegues en el chat ni la subas a ningún sitio.
2. Ejecuta `python3 audio/voz.py <VOICE_ID> toma [modelo]`. El modelo por defecto es `eleven_multilingual_v2`; prueba `eleven_v3` si tu cuenta lo tiene.
   - Lee `guion.txt` y escribe `audio/toma.mp3` y `audio/toma.json`.
   - Usa el endpoint `with-timestamps`, así que no hace falta Whisper.
3. Si quieres elegir entre dos tomas: `python3 audio/voz.py <VOICE_ID> tomaB`.

El `voice_id` está en ElevenLabs › Voices › tu voz › «Copy voice ID». Una voz clonada suena a ti.

## Opción B: otra herramienta o un audio que ya tengas
1. Pon el audio en `audio/toma.mp3`. Debe decir exactamente el texto de `guion.txt`.
2. Saca los tiempos con Whisper (gratis, en local):
   ```bash
   pip install -U openai-whisper
   whisper audio/toma.mp3 --model medium --language es --word_timestamps True --output_format json --output_dir audio
   ```
   Así queda `audio/toma.json`. En un Mac con Intel/AMD, si da un error de OpenMP, antepón `KMP_DUPLICATE_LIB_OK=TRUE`.
3. Repasa la transcripción. Si Whisper oye mal una palabra, el audio puede estar bien: corrígela con `arreglos`.

## Cortar por escenas
`python3 audio/tiempos.py toma` hace lo siguiente:
- busca en la toma la primera palabra de cada línea de `guion.txt`;
- corta en el silencio más profundo justo antes;
- deja 0,3 s de respiración entre escenas;
- y escribe `audio/vo.wav`, `audio/words.json` y `timing.js`.

Revisa la tabla que imprime: cada fila debe empezar con su frase.

### `audio/cortes.json` (solo si hace falta)
```json
{ "tomas": { "8": "tomaA" },
  "ventanas": { "toma": { "5": [25.6, 26.35] } },
  "arreglos": { "narracion": "narración", "Pegue": "Pega" } }
```
- **`tomas`:** saca una escena de otra toma (contando desde 0). Sirve cuando en una toma una frase suena mejor.
- **`ventanas`:** dónde buscar el silencio de un corte, en segundos de esa toma. Úsalo cuando una escena empieza con la última palabra de la anterior.
- **`arreglos`:** corrige palabras de los subtítulos.

## Consejos de guion para la voz
- **Duración:** de 40 a 55 s de voz. Unas 2,7 palabras por segundo dan unas 130 palabras.
- **Siglas:** escribe «inteligencia artificial» en vez de «IA», porque algunas voces dicen «ía».
- **Números:** en letra si se leen («tres pasos»). Los números de lista («Uno:», «Dos:») funcionan bien: `tiempos.py` entiende «1» y «uno».
- **Palabras en inglés:** la palabra del CTA en mayúsculas («Comenta REEL»). Comprueba en la transcripción que se pronuncia bien.
