---
name: reels-neon
description: >-
  Crea reels verticales 9:16 (Instagram, TikTok, Shorts) en estilo «neón con mascota», todo por código:
  fondo marino con brillo azul, tarjetas de cristal, una escena por frase con destello de luz, mascota 3D
  que acompaña cada idea, fotos realistas con IA, terminal/chat/código animados, subtítulos karaoke,
  voz sincronizada palabra a palabra, música, efectos y CTA «Comenta PALABRA». Úsala cuando pidan
  «hazme un reel sobre X» o «un reel animado de X» (aunque no nombren el estilo), «un reel neón»,
  «un reel como el de la skill de reels»,
  «reel con mascota y tarjetas que brillan», «un reel que ofrezca mi guía o
  skill», o quieran convertir un tema, tutorial o producto en un reel animado sin grabarse. También para
  cambiar escenas, colores, mascota, voz o música de un reel hecho con esta skill.
metadata:
  autor: Rubén Tinedo · TinergIA (@rubentinedo.ia)
  version: "1.0"
---

# Reels neón: reels animados por código

Conviertes un tema en un reel de 40–55 s que parece hecho por un estudio de motion graphics. `<skill>` es
la carpeta de esta skill. Habla en el idioma del usuario y sin jerga.

**Así funciona:**
- Cada frase de la voz es una escena. Cada escena tiene un titular arriba, una pieza visual en el centro (tarjeta, terminal, fotos, reloj…) y, a veces, la mascota.
- Las animaciones caen en la palabra exacta en que se dicen.
- Todo se dibuja en `video.js` con las piezas de `neon.js`.
- `render.mjs` lo convierte en MP4 y `audio/mezcla.py` pone la voz, la música y los efectos.

El ejemplo completo es `plantilla/video.ejemplo.js`. Léelo entero antes de escribir el primer vídeo: es un reel real terminado («Este reel lo hizo Claude Code») con todos los patrones.

## 1 · Preguntas (rápidas)
Si el pedido ya trae tema y objetivo, no hagas una entrevista larga: decide con valores sensatos y enseña un resumen de 5 líneas. Pregunta solo lo que cambia el vídeo, con un máximo de 4 preguntas y la opción recomendada primero:
- **Tema y la UNA idea** que debe llevarse quien lo ve. Pide enlaces o notas si hay datos.
- **CTA:** la palabra para comentar (`Comenta GUIA`, `Comenta REEL`…) y qué recibe quien comenta.
- **Firma final:** nombre, @usuario, lema y logo o foto. Si no hay, el reel cierra con el CTA.
- **Mascota:**
  - su personaje o logo (se generan las poses, ver `references/imagenes.md`);
  - ninguna;
  - o la de ejemplo solo para probar.
- **Voz:**
  - ElevenLabs con su voz (API key + voice_id);
  - un audio que ya tenga;
  - u otra herramienta.
  Ver `references/voz.md`.
- **Color de acento:** azul neón por defecto. Se cambia con `paleta({ blue: '#…', cyan: '#…' })`.

## 2 · Guion
Escribe `guion.txt`, **una frase por línea, una línea por escena**: entre 8 y 11 líneas, unas 120–150 palabras.
- **Gancho:** primera línea, en menos de 2 s. Que choque o prometa algo concreto.
- **Valor:** una idea por línea, en orden de historia: problema → cómo funciona → pasos → resultado.
- **CTA:** la última línea dice la palabra exacta, «Comenta X y te mando…».
- Cada línea empieza con una palabra distinta a la del inicio de la línea siguiente; sirve para cortar la voz.
- Escribe los números como se dicen («tres pasos») y evita siglas que la voz lea raro.
- No inventes cifras. Lo que no sepas con certeza, dilo sin número.

Enseña el guion con la idea visual de cada línea. Espera el visto bueno, salvo que haya pedido hacerlo directo.

## 3 · Montar el proyecto
**La primera vez, comprueba el equipo:** `node -v` (18 o más), `ffmpeg -version` y `python3 -c "import numpy, PIL"`. Si falta algo, di qué es y ofrécete a instalarlo con el gestor de paquetes del sistema (en Mac, `brew`). Si un instalador pide la contraseña del ordenador, la escribe el usuario.

```bash
cp -R <skill>/plantilla ./<nombre-del-reel> && cd ./<nombre-del-reel>
npm install && npx playwright install chromium        # una vez por proyecto
python3 -m pip install numpy pillow                   # si no los tiene
```
Pon `guion.txt` en la carpeta.

## 4 · Voz y tiempos
1. **Generar la voz.** Con ElevenLabs por API, `python3 audio/voz.py <VOICE_ID> toma` crea `audio/toma.mp3` y `audio/toma.json` (cada palabra con su tiempo). Hay otras opciones en `references/voz.md`.
2. **Cortar por escenas.** `python3 audio/tiempos.py toma` corta la voz por escenas, deja respiraciones y escribe:
   - `audio/vo.wav`;
   - `audio/words.json`;
   - `timing.js` (inicio, duración y palabras de cada escena).
3. **Revisar.** Mira la tabla que imprime: cada escena debe empezar con su frase. Si un corte cae mal, usa `audio/cortes.json` (ver `references/voz.md`).

## 5 · Imágenes
- **Mascota.** Hacen falta 4–6 poses con la misma figura: saluda, señala, piensa, sostiene algo, se asoma. Se recortan con `python3 herramientas/recortar.py mascota/*.png` y quedan en `mascota/<pose>-cut.png`.
- **Fotos realistas.** Opcionales, unas 2–6: una a pantalla completa para el gancho, otras para galerías.
- Prompts y herramientas en `references/imagenes.md`. Si no hay generador de imágenes, el reel funciona solo con piezas de código.

## 6 · Escribir `video.js`
Copia la estructura de `video.ejemplo.js`:
1. `import` de `neon.js` y de `./timing.js`.
2. `const { B, kw, WORDS, VOEND } = tiempos(SC)` y `END = VOEND + 3`.
3. La tabla `T` con los momentos clave, siempre desde la voz: `kw(escena, 'palabra')`. No pongas segundos a mano.
4. Una función por escena, `sX(c, t, K)`, con su titular (`head`) y su pieza central. Las recetas están en `references/escenas.md`.
5. `SCN = [[B(0), s0], [B(1), s1], …]`, `FLASH` y `karaoke(WORDS)`.
6. El objeto exportado, con `dur`, `images` (todas las rutas que uses), `render` y `sonidos`.

Reglas del estilo (más en `references/estilo.md`):
- **Zonas de pantalla:**
  - titular entre y 250 y 470;
  - pieza central entre y 480 y 1400;
  - **subtítulos en y 1590: deja libre la franja de 1490 a 1660**;
  - marca de agua en y 1860.
- **Animación:** cada escena tiene movimiento continuo (algo que se teclea, llena, recorre o flota) y al menos un «momento» en su palabra clave (píldora, sello, check, destello).
- **Variedad:** no repitas la misma pieza central dos escenas seguidas. Alterna tarjeta, foto a pantalla completa, terminal y número grande.
- **Mascota:** como mucho en una de cada dos escenas. Nunca tapa texto ni la franja de subtítulos.
- **Lo que debe verse:** si algo tiene que verse, que aparezca al menos 1 s antes del cambio de escena.

## 7 · Revisión (obligatoria antes del render)
```bash
node render.mjs --every 1.5 && python3 contact.py stills contact.jpg 6
```
Abre `contact.jpg` y busca:
- texto cortado o encimado;
- píldoras que se tocan;
- la mascota tapando algo;
- escenas vacías;
- subtítulos sobre una pieza.

Para revisar un instante concreto: `node render.mjs --stills 12.3,12.6`. Corrige y vuelve a mirar. Los errores típicos están en `references/estilo.md`.

## 8 · Música y render
- **Música:**
  - la suya, en `audio/music.mp3` (recomendado);
  - una básica generada por código: `python3 audio/musica.py <segundos>`;
  - o ninguna.
- **Render:** `./build.sh <nombre>` crea `<nombre>.mp4` (máster) y `<nombre>-movil.mp4` (ligero, para el móvil).
  - Incluye los efectos sintetizados (whoosh, pop, impact, type, title) que declaras en `sonidos()`.
  - La música baja sola mientras hay voz.
  - El volumen final queda en −14 LUFS.
  - Tarda alrededor de 1 minuto por cada minuto de vídeo.

## 9 · Entregar
- Envía el `-movil.mp4` y di dónde está el máster.
- Resume en 3–4 líneas qué muestra cada parte.
- Propón un **copy corto**: 2–4 líneas que den curiosidad sin repetir el guion, el CTA con la palabra y hasta 5 hashtags.
- Añade la **respuesta automática para el DM**.
- Si el CTA promete algo (guía, skill, plantilla) que aún no existe, dilo claramente.
