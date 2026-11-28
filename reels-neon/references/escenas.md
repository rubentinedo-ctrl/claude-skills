# Recetas de escenas

Firma de una escena: `function sX(c, t, K) { … }`. `t` es el tiempo global y `T.algo` el momento de una palabra (`kw()`).
Las piezas genéricas se ven todas en `plantilla/piezas.demo.js`: es el mejor punto de partida para un tema cualquiera.
Las recetas del final están hechas en `ejemplo/video.ejemplo.js`, un reel sobre tecnología: copia la técnica, no el contenido.

## Piezas genéricas (cualquier tema)
- `icono(c, 'nombre', x, y, tamaño, {col, disco:true, p, moneda:'€'})`: iconos de línea con brillo. Nombres: check, x, alerta, reloj, usuario, grupo, chat, movil, calendario, grafica, dinero, estrella, corazon, play, camara, mundo, idea, escudo, rayo, documento, lupa, carrito, ubicacion, megafono, diente, casa, cubiertos, pesa, maletin, ojo, enlace (`NOMBRES_ICONOS`).
- `numero(c, t, x, y, radio, valor, at, {sufijo, prefijo, label, decimales, parte})`: número grande que cuenta con anillo. **Solo cifras que dio el usuario o que estén en una fuente.**
- `lista(c, t, x, y, w, [{s, at}], {icono:'x', alto, size})`: filas que entran con check (o con ✕ roja).
- `comparativa(c, t, x, y, w, {titulo:'Antes', items}, {titulo:'Ahora', items})`: dos columnas, gris con ✕ y azul con check.
- `barras(c, t, x, y, w, h, [{label, v, col, valor}], at)`: barras que crecen. Si no hay datos reales, rotula «ejemplo ilustrativo».
- `burbujas(c, t, x, y, w, [{de:'otro'|'yo', s, at}], {alto, size})`: chat con «escribiendo…»; suben solas si no caben.
- `movil(c, K, null, x, y, w, h, t, 0, '', (c, x, y, w, h) => { … })`: móvil con lo que dibujes dentro (un chat, una web, una agenda). Con una ruta de foto en vez de `null`, muestra la foto.
- `tarjeta(c, x, y, w, h, {icono, titulo, texto, p})`: tarjeta de cristal con icono, título y texto ajustado.
- `xmark(c, x, y, tamaño, p)`, `sello(c, x, y, 'LISTO', p)`, `flecha(c, x1, y1, x2, y2, p)`, `cartel(c, t, x, y, 'PALABRA', at)` (CTA neón).
- `envolver(c, texto, anchoMax, size)` y `parrafo(c, texto, x, y, anchoMax, size)`: texto en varias líneas.

## Recetas genéricas
- **Gancho con foto:** foto a pantalla completa con Ken Burns (`cover` con zoom que crece), `velo()`, titular de 2 líneas con la segunda en píldora y 3 chips con check abajo. Sin foto: un número grande o un icono enorme con `disco` y un `sello`.
- **El problema:** `lista` con `icono:'x'` o `comparativa` (antes en gris). Que algo tiemble o se tache en su palabra (`xmark`).
- **Cómo funciona:** un `movil` con un chat (`burbujas`) o una web dibujada dentro; o 3 `tarjeta`s escalonadas unidas con `flecha`.
- **Para quién sirve / ejemplos:** cuadrícula de iconos (`icono` con `disco`) que se encienden uno a uno, cada uno con su nombre debajo; el que se nombra en la voz crece y brilla.
- **Un nicho o caso, con lo que gana:** foto del sector a pantalla completa con Ken Burns y `velo(c, 1, 0.6)`, una etiqueta pequeña con su icono (`pill` + `icono`, p. ej. «🏠 INMOBILIARIA»), una pieza que muestre el beneficio (iconos de usuario que se encienden con check, una mini publicación con corazones que suben, un carné que pasa de «CURIOSO» a «SOCIO») y el beneficio en una píldora verde con check que entra en su palabra. Una escena por nicho vende más que una cuadrícula con todos.
- **Resultado:** `comparativa` (ahora en azul), `sello('LISTO')` o un `numero` (solo con cifras reales).
- **Dibujos propios del tema:** si el tema pide un objeto concreto (una muela, una maceta, un coche), dibújalo con formas sencillas (`roundRect`, `arc`, curvas) en el estilo: relleno marino, borde cian con brillo. Una pieza propia bien hecha vale más que tres genéricas.
- **CTA:** `head('Comenta')` + `cartel(c, t, 540, 660, 'PALABRA', T.palabra)` + 2 píldoras con check (qué recibe y cómo le llega).

## Recetas del reel de ejemplo (`ejemplo/video.ejemplo.js`)

### Piezas básicas de `neon.js`

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
- `mascota(c, K, ruta, x, y, alto, p, t, {right, slide, noGlow, still})`: la mascota (solo si el usuario trae la suya).
- `movil(c, K, ruta, x, y, w, h, t, progreso, 'TU REEL')`: un móvil con una foto dentro.

**Montaje y cierre**
- `fondo(c, t)`, `escenas(c, t, K, SCN, END)`, `destellos(c, t, tiempos)`, `karaoke(WORDS)` y `firma(c, t, K, at, {...})`.
- `marcaAgua(c, '@usuario')`.

**Utilidades:** `clamp`, `lerp`, `sm` (suave), `out`, `back` (rebote) y `rgba(hex, alfa)`.

Las recetas siguientes son del reel de ejemplo (tecnología, con mascota). Sirven como técnica; en un reel sin mascota, quita sus líneas `mascota(...)`.

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
- **Encuesta o ranking:** filas con puntos de esfuerzo y la opción buena con el sello «LA MÁS FÁCIL».
- **Batería o medidor que baja:** sirve como metáfora de olvido o de gasto.
- **Cuadrícula de decenas de miniaturas** que se llena, para hablar de escala.
- **Mensaje de WhatsApp o email** que llega con un pop.
