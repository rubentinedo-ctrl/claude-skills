# Skills para Claude Code · Rubén Tinedo

Skills gratuitas para **Claude Code**, hechas por **Rubén Tinedo** · [@rubentinedo.ia](https://instagram.com/rubentinedo.ia) · TinergIA.

## Cómo instalar una skill (3 pasos)
1. Abre **Claude Code**, en la app de escritorio o en la terminal.
2. Pega el enlace de la skill y escríbele **«instálala»**.
3. Pídele lo que quieras con ella. Por ejemplo: **«hazme un reel sobre…»**.

Si la skill no aparece en la conversación en la que la instalaste, abre una conversación nueva.

## Skills disponibles
| Skill | Qué hace | Enlace para instalar |
|---|---|---|
| **reels-neon** | Reels verticales animados por código en estilo neón, sobre el tema que quieras: voz sincronizada, iconos y gráficos animados, fotos de IA, subtítulos karaoke, música y efectos. | `https://github.com/rubentinedo-ctrl/claude-skills/tree/main/reels-neon` |

---

## Para Claude Code: cómo instalar una skill de este repositorio
Si el usuario te pasa un enlace de este repositorio y te pide instalar una skill, sigue estos pasos.

1. **Qué skill.** Es la carpeta que aparece en el enlace, por ejemplo `.../tree/main/reels-neon` → `reels-neon`. Si el enlace es el del repositorio entero, pregúntale cuál quiere y enséñale la tabla de arriba.
2. **Dónde va.** En `~/.claude/skills/<skill>/`; en Windows, `%USERPROFILE%\.claude\skills\<skill>\`. Si esa carpeta ya existe, pregunta antes de reemplazarla (sería una actualización).
3. **Descargarla.** Instala solo la carpeta de esa skill:
   - **Con git:**
     ```bash
     tmp=$(mktemp -d)
     git clone --depth 1 https://github.com/rubentinedo-ctrl/claude-skills.git "$tmp/repo"
     mkdir -p ~/.claude/skills
     cp -R "$tmp/repo/<skill>" ~/.claude/skills/<skill>
     rm -rf "$tmp"
     ```
   - **Sin git:**
     ```bash
     tmp=$(mktemp -d)
     curl -L https://github.com/rubentinedo-ctrl/claude-skills/archive/refs/heads/main.zip -o "$tmp/repo.zip"
     unzip -q "$tmp/repo.zip" -d "$tmp"
     mkdir -p ~/.claude/skills
     cp -R "$tmp/claude-skills-main/<skill>" ~/.claude/skills/<skill>
     rm -rf "$tmp"
     ```
     En Windows sin git, usa `Invoke-WebRequest` y `Expand-Archive` en PowerShell.
4. **Comprobar.** Debe existir `~/.claude/skills/<skill>/SKILL.md`.
5. **Requisitos.** Lee la sección «Lo que necesitas» del `README.md` de la skill.
   - Comprueba qué tiene ya el equipo, por ejemplo con `node -v`, `ffmpeg -version` y `python3 -c "import numpy, PIL"`.
   - Si falta algo, dile qué es y ofrécete a instalarlo con el gestor de paquetes de su sistema.
   - Si un instalador pide la contraseña del ordenador, la escribe el usuario.
6. **Confirmar.** Responde con **«Skill instalada»** y una línea con el primer prompt para probarla. Si no la ves disponible en esta conversación, dile que abra una nueva.
