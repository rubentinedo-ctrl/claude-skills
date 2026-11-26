# Estilo «neón con mascota»: gramática visual y errores que ya cometimos

## Lo que lo hace reconocible
- **Fondo.** Marino casi negro (`#040B16`) con rejilla tenue que se desplaza, partículas cian que suben, un halo azul que respira y viñeta (`fondo()`).
- **Un solo acento.** Azul neón (`C.blue`) y cian (`C.cyan`).
  - Verde solo para checks y estados «listo».
  - Rojo solo para lo que está mal: tachar, error, «antes».
- **Tarjetas de cristal** (`glass()`): relleno marino translúcido, borde azul que se apaga hacia abajo y brillo exterior.
- **Titular** (`head()`): blanco, en Inter 800, de 78 a 100 px. La palabra clave va en **píldora azul** (`pill: true`) o en color (`c: C.red`), y entra cuando la voz la dice.
- **Etiquetas pequeñas:** en monoespaciada (JetBrains Mono) y mayúsculas, como «VOZ · CLONADA» o «INSTALACIÓN · 3 PASOS».
- **Una escena por frase.**
  - Al entrar, empuje de zoom de 1,07 a 1.
  - Antes del cambio, fundido a negro de 0,12 s.
  - En cada cambio, **destello radial** de luz (`destellos()`).
- **Mascota 3D** con halo cian y flotación suave (`mascota()`). Tiene 4–6 poses fijas y la personalidad la pone la pose, no la animación.
- **Subtítulos karaoke** (`karaoke()`): hasta 3 palabras. La que suena va en píldora azul, las ya dichas en blanco y las siguientes en gris.
- **Fotos realistas:**
  - **revelado de IA**: desenfoque que se aclara y una línea de escaneo cian;
  - Ken Burns lento;
  - a pantalla completa, siempre con `velo()` para que se lea el texto.

## Zonas de pantalla (1080×1920)
| Zona | y |
|---|---|
| Titular (1–3 líneas) | 250–470 |
| Pieza central | 480–1400 (tarjetas de x 60 a 1020) |
| Mascota | esquinas: 860,330 arriba a la derecha · 170–300,1150–1385 abajo a la izquierda · borde derecho con `right: true` |
| **Subtítulos** | **1590: la franja 1490–1660 siempre libre** |
| Marca de agua | 1860 |

## Ritmo
- **Animaciones:** cada escena tiene **algo en movimiento todo el rato** (texto tecleado, barra que se llena, forma de onda, lupa que recorre, reloj que gira). Si no, parece una diapositiva.
- **Momentos:** cada escena tiene al menos un **momento** en su palabra clave: píldora con rebote, sello, check, tachón o destello. Cada momento lleva un sonido (`pop`, `impact` o `whoosh`).
- **Entradas escalonadas:** escalona de 0,12 a 0,18 s las listas y las cuadrículas, nunca todo a la vez.
- **Variedad:** alterna tipos de escena (tarjeta → foto a pantalla completa → terminal → número grande). Nunca uses dos veces seguidas la misma.
- **Escenas largas:** si una frase dura más de 6 s y tiene 3 ideas, divídela en fases con barrido horizontal (ver `s4` del ejemplo).

## Errores que ya cometimos (y cómo se arreglaron)
- **Píldoras del karaoke que se tocan.** El espacio entre palabras debe ser `tw(' ') + 22`. Ya está así en `karaoke()`.
- **Una píldora del titular monta sobre la línea de arriba.** Usa `lh` de 1,24 o más, que es lo que hay por defecto.
- **La mascota tapa el borde de una tarjeta o el terminal.** Baja la tarjeta o encoge la mascota. Su borde inferior debe quedar por encima de y 1490.
- **Algo importante que aparece justo antes del corte** (el móvil del resultado) apenas se ve. Haz que entre al menos 1 s antes del cambio de escena.
- **Un texto que se teclea demasiado tarde** queda cortado al cambiar de escena. Empieza a teclear 0,2–0,3 s antes de la palabra.
- **Fotos de 720 px a pantalla completa:** se aguantan con velo y Ken Burns. Para escenas de detalle usa cuadrícula (440×440).
- **Poses de la mascota inconsistentes** (le salen piernas, ojos distintos): repite en el prompt los rasgos fijos y genera siempre con la pose base como referencia.
- **Cifras inventadas en pantalla:** nunca. Si es un ejemplo, que se note: «caso de ejemplo», datos genéricos.
