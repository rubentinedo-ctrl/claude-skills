#!/bin/bash
# Render final de reels-neon: vídeo + efectos + voz + música → <nombre>.mp4 (máster) y <nombre>-movil.mp4 (ligero).
# Uso: ./build.sh <nombre> [video.js]
set -e
N="${1:-reel}"; V="${2:-video.js}"
node render.mjs --video "$V" --out "_$N-mudo.mp4"
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "_$N-mudo.mp4")
python3 audio/mezcla.py "$DUR"
ffmpeg -y -v error -i "_$N-mudo.mp4" -i audio/_mezcla.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart "$N.mp4"
ffmpeg -y -v error -i "$N.mp4" -c:v libx264 -preset medium -crf 25 -maxrate 4M -bufsize 8M -c:a aac -b:a 128k -movflags +faststart "$N-movil.mp4"
rm -f "_$N-mudo.mp4"
LUFS=$(ffmpeg -nostats -i "$N.mp4" -af ebur128 -f null - 2>&1 | awk '/I:/{v=$2} END{print v}')
echo "LISTO: $N.mp4 ($(du -h "$N.mp4" | cut -f1)) · $N-movil.mp4 ($(du -h "$N-movil.mp4" | cut -f1)) · ${DUR}s · volumen ${LUFS} LUFS (objetivo −14)"
