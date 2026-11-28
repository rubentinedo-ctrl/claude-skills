# Fotos realistas y mascota (las dos opcionales)

Sirve cualquier generador de imágenes: ChatGPT, Gemini (Nano Banana), Higgsfield, Freepik/Magnific (tiene imágenes gratis cada día), Midjourney… Si el entorno tiene un conector de imágenes, úsalo. Si no, dale al usuario los prompts para que los genere y guarde los archivos en la carpeta.

## Mascota (solo si el usuario la pide y trae su personaje o logo)
Por defecto el reel no lleva mascota. Nunca uses la de `ejemplo/` en un reel del usuario.

1. **Pose base.** Si tiene logo o personaje, úsalo como imagen de referencia. Si no, describe uno sencillo y simpático.
   > Premium 3D character render of [descripción: cuerpo, cabeza, colores, accesorios, logo en el pecho]. Cute chibi 3D, Pixar-like proportions, soft glossy materials, strong neon cyan rim light and blue glow around the silhouette. Front view, friendly idle pose. Very dark navy background (#050E1C) with a faint blue glow. Full body centered with empty space around. No text.
2. **Resto de poses.** Siempre **con la base como referencia**, repitiendo los rasgos fijos:
   > Same exact 3D character as the reference image: [rasgos fijos: «NO legs, floats on a hover thruster», «both eyes identical»…], same materials, colours and neon glow, same dark navy background. New pose: …
   - **saluda:** waving hello with one arm raised high, head tilted, happy.
   - **señala:** three-quarter view, one arm raised pointing confidently to the upper right.
   - **piensa:** one hand under the chin, head tilted, a small glowing question mark above.
   - **sostiene:** holding a small glowing holographic orb between both hands.
   - **se asoma:** peeks in from behind the right edge of the frame, only half the head and one hand visible.
3. Guarda las poses en `mascota/` y recórtalas con `python3 herramientas/recortar.py mascota/*.png`, que crea `*-cut.png`. Revisa el recorte sobre un fondo claro.
4. En `video.js`: `const M = p => \`mascota/${p}-cut.png\``. Pon esas rutas en `images`.

**Fallos típicos:**
- Le salen piernas o cambian los ojos: repite los rasgos fijos y vuelve a generar esa pose.
- El halo del propulsor se pierde al recortar: no pasa nada, `mascota()` dibuja su propio halo.

## Fotos realistas
- **Para qué:** el gancho (foto a pantalla completa), galerías de «resultados» y el «ahora» de un antes/ahora.
- **Formato:** 9:16 para pantalla completa y 3:4 o 1:1 para cuadrículas.
- **Prompt base:**
  > Photorealistic cinematic photo of [escena], [luz: blue ambient neon / golden hour / dramatic warm light], shallow depth of field, high detail, no readable text, no logos.
- **Sin caras reconocibles:** pide «no face visible» y usa manos, siluetas o espaldas.
- **Ambientación, no prueba:** las fotos de IA son ilustrativas. No las presentes como «resultado real de un cliente».
- **Dónde van:** `img/` (jpg de unos 1000–1600 px de ancho), con las rutas en `images`.
