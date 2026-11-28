---
name: reels-neon
description: >-
  Crea reels verticales 9:16 (Instagram, TikTok, Shorts) en estilo «neón», todo por código y sobre
  cualquier tema: fondo marino con brillo azul, tarjetas de cristal, una escena por frase con destello de
  luz, iconos, números, listas, comparativas, chats y fotos realistas con IA (mascota solo si el usuario
  trae la suya), subtítulos karaoke,
  voz sincronizada palabra a palabra, música, efectos y CTA «Comenta PALABRA». Úsala cuando pidan
  «hazme un reel sobre X» o «un reel animado de X» (aunque no nombren el estilo), «un reel neón»,
  «un reel como el de la skill de reels»,
  «reel con tarjetas que brillan», «un reel que ofrezca mi guía o
  skill», o quieran convertir un tema, tutorial o producto en un reel animado sin grabarse. También para
  cambiar escenas, colores, mascota, voz o música de un reel hecho con esta skill.
metadata:
  autor: Rubén Tinedo · TinergIA (@rubentinedo.ia)
  version: "1.1"
---

# Reels neón: reels animados por código

Conviertes un tema **cualquiera** en un reel de 40–55 s que parece hecho por un estudio de motion graphics.
`<skill>` es la carpeta de esta skill. Habla en el idioma del usuario y sin jerga.

**Así funciona:**
- Cada frase de la voz es una escena. Cada escena tiene un titular arriba y una pieza visual en el centro: iconos, número grande, lista con checks, antes/ahora, barras, chat en un móvil, tarjetas, foto… Las piezas genéricas están en `neon.js` y se ven todas en `plantilla/piezas.demo.js`.
- Las animaciones caen en la palabra exacta en que se dicen.
- Todo se dibuja en `video.js`, **escrito para este tema**: si hace falta un dibujo propio (un diente, una maceta, un coche), lo dibujas tú con formas sencillas.
- `render.mjs` lo convierte en MP4 y `audio/mezcla.py` pone la voz, la música y los efectos.

**El reel es del usuario, no de quien hizo la skill.** `ejemplo/` es un reel terminado de su autor («Este reel lo hizo Claude Code», con su mascota Iva, su firma y su @usuario). Léelo para aprender la estructura (tiempos → escenas → subtítulos → sonidos), pero **nunca** pongas en el reel del usuario sus textos, su mascota, su firma, su logo ni su @usuario.

## 1 · Preguntas (rápidas)
Si el pedido ya trae tema y objetivo, no hagas una entrevista larga: decide con valores sensatos y enseña un resumen de 5 líneas. Pregunta solo lo que cambia el vídeo, con un máximo de 4 preguntas y la opción recomendada primero:
- **Tema y la UNA idea** que debe llevarse quien lo ve. Pide enlaces o notas si hay datos.
- **CTA:** la palabra para comentar (`Comenta GUIA`, `Comenta REEL`…) y qué recibe quien comenta.
- **Firma final:** nombre, @usuario, lema y logo o foto. Si no hay, el reel cierra con el CTA y sin marca de agua.
- **Mascota: por defecto, ninguna.** El reel se sostiene con piezas e imágenes. Solo si el usuario la pide y trae su personaje o logo, se generan sus poses (ver `references/imagenes.md`). La de `ejemplo/` no se usa en reels del usuario.
- **Fotos realistas:** si tiene un generador de imágenes (o un conector), 2–6 fotos dan mucho nivel; si no, el reel va solo con piezas de código.
- **Voz:**
  - ElevenLabs con su voz (API key + voice_id);
  - un audio que ya tenga;
  - u otra herramienta.
  Ver `references/voz.md`.
- **Color de acento:** azul neón por defecto. Se cambia con `paleta({ blue: '#…', cyan: '#…' })`.

## 2 · Guion
Escribe `guion.txt` en la carpeta del reel (si aún no existe, haz antes el paso 3), **una frase por línea, una línea por escena**: entre 8 y 11 líneas, unas 110–140 palabras (con las respiraciones entre escenas salen 45–55 s). Los subtítulos saldrán con el texto exacto de este archivo (tildes, mayúsculas, «Uno:»), así que escríbelo bien.
- **Gancho:** la primera línea, corta (se dice en 2–3 s). Que choque, nombre a quién va dirigido o abra una pregunta que el reel cierra al final: eso retiene hasta el último segundo.
- **Valor:** una idea por línea, en orden de historia: problema → cómo funciona → pasos → resultado.
- **CTA:** la última línea dice la palabra exacta, «Comenta X y te mando…».
- Escribe los números como se dicen («tres pasos») y evita siglas que la voz lea raro: «inteligencia artificial», no «IA», también en pantalla.
- La palabra del CTA va en mayúsculas y escrita como se pronuncia en el país del usuario («Comenta VÍDEO» en España). El cartel neón es texto dibujado y puede decirla sin tilde.
- No inventes cifras. Lo que no sepas con certeza, dilo sin número.

Escribe también `STORYBOARD.md` (por línea: la frase y la idea visual concreta de su escena) y enséñaselo. Espera el visto bueno, salvo que haya pedido hacerlo directo.

## 3 · Montar el proyecto
**La primera vez, comprueba el equipo:** `node -v` (18 o más), `ffmpeg -version` y `python3 -c "import numpy, PIL"`. Si la voz no viene de ElevenLabs por API (opción B o C de `references/voz.md`), también `whisper --help`. Si falta algo, di qué es y ofrécete a instalarlo con el gestor de paquetes del sistema (en Mac, `brew`). Si un instalador pide la contraseña del ordenador, la escribe el usuario.

```bash
cp -R <skill>/plantilla ./<nombre-del-reel> && cd ./<nombre-del-reel>
npm install && npx playwright install chromium        # una vez por proyecto
python3 -m pip install numpy pillow                   # si no los tiene
```
Pon `guion.txt` en la carpeta. La plantilla trae sus fuentes (Inter y JetBrains Mono) en `fuentes/`: el render no depende de internet.

## 4 · Voz y tiempos
1. **Generar la voz.** Con ElevenLabs por API, `python3 audio/voz.py <VOICE_ID> toma` crea `audio/toma.mp3` y `audio/toma.json` (cada palabra con su tiempo). Con un conector de ElevenLabs u otro audio, pasa la voz por Whisper. Todo en `references/voz.md`.
2. **Cortar por escenas.** `python3 audio/tiempos.py toma` alinea la voz con `guion.txt`, la corta por escenas en los silencios, deja respiraciones y escribe:
   - `audio/vo.wav`;
   - `audio/words.json`;
   - `timing.js` (inicio, duración y palabras de cada escena).
3. **Revisar.** Mira la tabla y los `AVISO` que imprime. Si un corte suena mal, usa `audio/cortes.json` (ver `references/voz.md`).

## 5 · Imágenes
- **Fotos realistas.** Opcionales, unas 2–6: una a pantalla completa para el gancho, otras para galerías o para el «ahora» de un antes/ahora. Van en `img/`.
- **Mascota (solo si el usuario trae la suya).** 4–6 poses con la misma figura: saluda, señala, piensa, sostiene algo, se asoma. Se recortan con `python3 herramientas/recortar.py mascota/*.png` y quedan en `mascota/<pose>-cut.png`.
- Prompts y herramientas en `references/imagenes.md`. Si no hay generador de imágenes, el reel funciona solo con piezas de código.

## 6 · Escribir `video.js`
Primero mira `plantilla/piezas.demo.js` (`node render.mjs --video piezas.demo.js --every 1`) para ver las piezas genéricas. Después escribe `video.js` con la estructura de `ejemplo/video.ejemplo.js`:
1. `import` de `neon.js` y de `./timing.js`.
2. `const { B, kw, WORDS, VOEND } = tiempos(SC)` y `END = VOEND + 3`.
3. La tabla `T` con los momentos clave, siempre desde la voz: `kw(escena, 'palabra')`, sin tildes y contando escenas desde 0. Si la palabra sale dos veces en la frase, `kw(escena, 'palabra', 2)`. No pongas segundos a mano. Si la consola avisa «kw: … no está tal cual», revisa ese momento.
4. Una función por escena, `sX(c, t, K)`, con su titular (`head`) y su pieza central, pensada para lo que dice esa frase. Las recetas están en `references/escenas.md`.
5. `SCN = [[B(0), s0], [B(1), s1], …]`, `FLASH` y `karaoke(WORDS)`.
6. El objeto exportado, con `dur`, `images` (todas las rutas que uses), `render` y `sonidos`. En `render`, `marcaAgua(c, '@usuario')` solo con el @ del usuario; si no dio ninguno, no la pongas.
7. **Cierre:** con firma, `END = VOEND + 3` y la firma entra tras la voz: copia su foto y su logo a `firma/` y llama a `firma(c, t, K, VOEND + 0.35, { foto: 'firma/foto.png', nombre, usuario: '@…', lema, logo: 'firma/logo.png', logoTexto: 'Fundador de' })` (todos los campos son opcionales; pon las rutas en `images`). Sin firma, el CTA se queda hasta el final y `END = VOEND + 2`.
8. Los textos de `piezas.demo.js` son de relleno: escribe los tuyos para el tema.

Reglas del estilo (más en `references/estilo.md`):
- **Zonas de pantalla:**
  - titular entre y = 250 e y = 470;
  - pieza central entre y 480 y 1400;
  - **subtítulos en y 1590: deja libre la franja de 1490 a 1660**;
  - marca de agua en y 1860.
- **Animación:** cada escena tiene movimiento continuo (algo que se teclea, llena, recorre o flota) y al menos un «momento» en su palabra clave (píldora, sello, check, destello).
- **Variedad:** no repitas la misma pieza central dos escenas seguidas. Alterna foto a pantalla completa, número grande, lista, antes/ahora, chat en el móvil, iconos, tarjetas y dibujos propios del tema.
- **Mascota (si la hay):** como mucho en una de cada dos escenas. Nunca tapa texto ni la franja de subtítulos.
- **Lo que debe verse:** si algo tiene que verse, que aparezca al menos 1 s antes del cambio de escena.
- **Gancho (escena 0):** el titular ya está en el primer fotograma, sin esperar a la voz; su píldora o su momento entran antes de 0,6 s. En el resto de escenas, cada palabra clave entra cuando la voz la dice.

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

Para revisar un instante concreto: `node render.mjs --stills 12.3,12.6`; salen en `sueltos/` (`python3 contact.py sueltos sueltos.jpg 4 540`). Corrige y vuelve a mirar. Los errores típicos están en `references/estilo.md`.

## 8 · Música y render
- **Música:**
  - la suya, en `audio/music.mp3` (recomendado);
  - una básica generada por código: `python3 audio/musica.py` (sin argumentos dura lo que la voz más 4 s);
  - o ninguna.
- **Render:** `./build.sh <nombre>` crea `<nombre>.mp4` (máster) y `<nombre>-movil.mp4` (ligero, para el móvil).
  - Incluye los efectos sintetizados (whoosh, pop, impact, type, title) que declaras en `sonidos()`.
  - La música baja sola mientras hay voz.
  - El volumen final queda en −14 LUFS; `build.sh` lo muestra al terminar.
  - Tarda alrededor de 1 minuto por cada minuto de vídeo.

## 9 · Entregar
- Envía el `-movil.mp4` y di dónde está el máster.
- Resume en 3–4 líneas qué muestra cada parte.
- Propón un **copy corto**: 2–4 líneas que den curiosidad sin repetir el guion, el CTA con la palabra y hasta 5 hashtags.
- Añade la **respuesta automática para el DM**.
- Si el CTA promete algo (guía, skill, plantilla) que aún no existe, dilo claramente.

## 10 · Cambios y segundas versiones
Antes de rehacer, guarda la versión aprobada: `guion.txt`, `video.js`, `timing.js`, `audio/toma.*`, `audio/vo.wav`, `audio/words.json` y los mp4 con sufijo `-v1` (o en `v1/`). `tiempos.py` y `build.sh` sobrescriben. Si solo cambia lo visual, no regeneres la voz: edita `video.js`, revisa y vuelve a `./build.sh <nombre>-v2`.
