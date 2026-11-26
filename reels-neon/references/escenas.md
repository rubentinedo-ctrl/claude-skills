# Recetas de escenas

Cada receta indica en qué función de `video.ejemplo.js` está hecha. Cópiala y cambia los textos.
Firma de una escena: `function sX(c, t, K) { … }`. `t` es el tiempo global y `T.algo` el momento de una palabra (`kw()`).

## Piezas de `neon.js`

**Texto**
- `head(c, t, t0, [{s, c?, pill?, at?}], {y, size, x?, align?, lh?})`: titular por líneas. `pill` lo pone en píldora y `at` es el segundo en que entra.
- `tx(c, s, x, y, size, {w, f, color, align, glow})` dibuja texto; `tw(...)` mide su ancho. `f: MONO` usa la monoespaciada.
- `typed(texto, t, t0, cps)`: el texto que se teclea, carácter a carácter.

**Contenedores**
- `glass(c, x, y, w, h, {r, col, sa, glow, fill})`: tarjeta de cristal.
- `pill(c, x, y, texto, size, {col, fill:false})`: etiqueta redonda.
- `ventana(c, x, y, w, h, 'Terminal — zsh')`: ventana con los tres puntos. Devuelve la y donde empieza el contenido.

**Aparición**
- `pop(c, x, y, p, fn)` (con rebote) y `rise(c, p, dy, fn)` (sube): hacen aparecer lo que dibuja `fn`.
- `p = ap(t, at, dur)` es el progreso, de 0 a 1.

**Iconos y estados**
- `check(c, x, y, r, p)`: check verde.
- `ring(c, x, y, r, t)`: indicador de «cargando».
- `star`, `linkIcon`: iconos.

**Imágenes**
- `cover(c, img, x, y, w, h, zoom, ox, oy, radio)`: foto que llena el hueco. Con un zoom que crece con `t` hace Ken Burns.
- `velo(c)`: oscurece una foto a pantalla completa.
- `mascota(c, K, ruta, x, y, alto, p, t, {right, slide, noGlow, still})`: la mascota.
- `movil(c, K, ruta, x, y, w, h, t, progreso, 'TU REEL')`: un móvil con una foto dentro.

**Montaje y cierre**
- `fondo(c, t)`, `escenas(c, t, K, SCN, END)`, `destellos(c, t, tiempos)`, `karaoke(WORDS)` y `firma(c, t, K, at, {...})`.
- `marcaAgua(c, '@usuario')`.

**Utilidades:** `clamp`, `lerp`, `sm` (suave), `out`, `back` (rebote) y `rgba(hex, alfa)`.

## Gancho con foto realista: `s0`
- Foto a pantalla completa con Ken Burns (`cover` con un zoom que crece), `velo()` y un titular de 2 líneas, la segunda en píldora.
- Abajo, chips con check que se encienden uno a uno durante una frase, más una barra de progreso.
- La mascota saluda en la esquina inferior derecha.

## «No es X, es Y» (tachar y revelar): `s1`
- Una tarjeta gris con la palabra que se niega recibe una **✕ roja** con temblor en su palabra y se encoge.
- Sube la tarjeta de lo que sí es: aquí, un editor que teclea código coloreado (`CODE`: tokens con color) y una vista previa donde una bola se mueve.
- La mascota se asoma por el borde derecho (`right: true, slide: 260`).

## Panel de chat o asistente: `s2`
- Una tarjeta grande con cabecera («Claude Code» con estrella) y el prompt tecleado.
- Luego, líneas de estado:
  1. `ring()` mientras trabaja;
  2. `check()` cuando termina;
  3. chips de fuentes escalonados;
  4. el guion que se teclea;
  5. al final, una **tarjeta de pregunta con 3 opciones**, y una se selecciona con brillo.

## Voz y sincronización: `s3`
- Una forma de onda de 56 barras animadas, con cabezal.
- Debajo, una línea de tiempo con **las palabras reales de la voz y su segundo** (de `SC`): cada palabra se enciende cuando pasa el cabezal y su rombo de fotograma clave da un pulso.

## Tres fases en una frase larga (barrido horizontal): `s4`
- `pos = sm(...) + sm(...)` desplaza las fases `phaseA/B/C` de pantalla en pantalla.
- **Fase A, galería de fotos IA:** desenfoque que se aclara, línea de escaneo y etiqueta «IA».
- **Fase B, mesa de mezcla:** faders que suben, medidores LED y la píldora «−14 LUFS · listo».
- **Fase C, hoja de fotogramas con lupa:** uno se marca en rojo («texto cortado») y luego en verde («corregido»).

## Antes / ahora: `s5`
- **Antes:** reloj grande que gira deprisa y un arco rojo que se llena, con la hora que corre en monoespaciada.
- **Ahora** (en su palabra, con destello): foto a pantalla completa y el titular abajo.

## Pregunta y pasos numerados: `s6`
- Titular grande centrado («¿Quieres hacerlo tú?»), la mascota señalando y 3 tarjetas numeradas que entran escalonadas en la palabra «pasos».

## Instalación en terminal (varias frases, una sola escena): `sInst`
- Arriba, el indicador de pasos 1-2-3: activo en azul, hecho en verde con check y línea de progreso.
- Debajo, un terminal con filas `rows` (`{h, at, d}`) que aparecen en su momento y **suben solas** cuando no caben.
- La secuencia del terminal:
  1. el comando tecleado;
  2. la caja de bienvenida;
  3. el input con un chip de enlace pegado y el texto tecleado;
  4. las líneas de progreso, con barra;
  5. la píldora «instalada»;
  6. el siguiente prompt, con temas que van cambiando.
- Al final entra un `movil()` con el resultado.

## CTA neón y firma: `sCta`
- «Comenta» arriba y la palabra en un **cartel neón** (borde cian con brillo y parpadeo de encendido en su palabra).
- La mascota señala el cartel y hay 2 píldoras con check: qué recibe y cómo le llega.
- Después de la voz, la escena se funde y entra `firma()`: foto con aro, nombre, @usuario, lema y logo.

## Otras ideas que encajan en el estilo
- **Número grande:** anillo que cuenta de 0 a N en su palabra, por ejemplo «30 segundos».
- **Comparativa en dos columnas:** «antes» en gris tachado y «ahora» en azul con check.
- **Encuesta o ranking:** filas con puntos de esfuerzo y la opción buena con el sello «LA MÁS FÁCIL».
- **Batería o medidor que baja:** sirve como metáfora de olvido o de gasto.
- **Cuadrícula de decenas de miniaturas** que se llena, para hablar de escala.
- **Mensaje de WhatsApp o email** que llega con un pop.
