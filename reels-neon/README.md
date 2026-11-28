# Reels neón · skill para Claude Code

Claude Code crea **reels verticales animados** (Instagram, TikTok, Shorts) en estilo neón sobre el tema que quieras:
una escena por frase con destello de luz, tarjetas de cristal, iconos, números, listas, antes/ahora, chats,
fotos realistas con IA, subtítulos karaoke, tu voz sincronizada palabra a palabra, música, efectos y CTA.
Si tienes mascota o logo, puede salir en el reel; si no, no hace falta.
Todo se genera **por código**: no hay plantillas ni editor de vídeo.

Hecha por **Rubén Tinedo** · [@rubentinedo.ia](https://instagram.com/rubentinedo.ia) · TinergIA.

## Instalación (3 pasos)
1. Abre **Claude Code**, en la app de escritorio o en la terminal.
2. Pega este enlace y escríbele **«instálala»**:
   `https://github.com/rubentinedo-ctrl/claude-skills/tree/main/reels-neon`
   Claude la copia en `~/.claude/skills/reels-neon` y comprueba lo que necesita tu ordenador.
3. Escríbele: **«hazme un reel sobre…»**.

Si no aparece en esa conversación, abre una nueva. Para hacerlo a mano, deja la carpeta `reels-neon` dentro de `~/.claude/skills/`; en Windows, dentro de `%USERPROFILE%\.claude\skills\`.

## Lo que necesitas (una sola vez)
- **Node.js 18 o superior.** Se descarga en https://nodejs.org.
- **ffmpeg:**
  - Mac: `brew install ffmpeg`;
  - Windows: `winget install ffmpeg`;
  - Linux: `sudo apt install ffmpeg`.
- **Python 3** con `numpy` y `pillow`: `python3 -m pip install numpy pillow`.
- **Para la voz:** una cuenta de ElevenLabs con tu `ELEVENLABS_API_KEY` en un archivo `.env` (recomendado). También sirve un conector de voz o cualquier audio tuyo, más Whisper: `pip install openai-whisper`.
- **Para recortar la mascota (opcional):** `python3 -m pip install "rembg[cpu]"`.
- **Para las imágenes (opcional):** cualquier generador de imágenes (ChatGPT, Gemini, Higgsfield, Freepik…).

En **Windows**, ejecuta los comandos dentro de WSL o Git Bash (`build.sh` es un script de bash).

Al instalarla, Claude revisa qué tienes y te ofrece instalar lo que falte. Si un instalador pide la contraseña del ordenador, la escribes tú.

## Qué incluye
- `SKILL.md`: las instrucciones que sigue Claude.
- `plantilla/`: lo que se copia a cada proyecto. El motor (render a MP4, mezcla de audio a −14 LUFS, efectos sintetizados y música básica generada por código), las fuentes, las piezas del estilo (`neon.js`) y una galería de piezas (`piezas.demo.js`).
- `ejemplo/`: un **reel de ejemplo completo** del autor («Este reel lo hizo Claude Code»), solo como referencia.
- `references/`: el estilo, recetas de escenas, la voz y las imágenes.

La mascota del ejemplo es Iva, de TinergIA, y no aparece en tus reels. Si quieres una mascota propia, Claude te ayuda a crearla a partir de tu logo.

---

## Para Claude Code: cómo instalar esta skill
Si el usuario te pasa este enlace y te pide instalarla:
1. **Si ya existe** `~/.claude/skills/reels-neon`, pregunta antes de reemplazarla. En Windows la ruta es `%USERPROFILE%\.claude\skills\reels-neon`.
2. **Descarga solo esta carpeta.**
   - Con git:
     ```bash
     tmp=$(mktemp -d)
     git clone --depth 1 https://github.com/rubentinedo-ctrl/claude-skills.git "$tmp/repo"
     mkdir -p ~/.claude/skills
     cp -R "$tmp/repo/reels-neon" ~/.claude/skills/reels-neon
     rm -rf "$tmp"
     ```
   - Sin git: descarga `https://github.com/rubentinedo-ctrl/claude-skills/archive/refs/heads/main.zip`, descomprímelo y copia `claude-skills-main/reels-neon` a la misma ruta.
3. **Comprueba** que exista `~/.claude/skills/reels-neon/SKILL.md`.
4. **Revisa los requisitos** de «Lo que necesitas» con `node -v`, `ffmpeg -version` y `python3 -c "import numpy, PIL"`. Si falta algo, dile qué es y ofrécete a instalarlo. Si un instalador pide la contraseña del ordenador, la escribe el usuario.
5. **Confirma** con **«Skill instalada»** y propón el primer prompt: «hazme un reel sobre…». Si no ves la skill en esta conversación, dile que abra una nueva.

