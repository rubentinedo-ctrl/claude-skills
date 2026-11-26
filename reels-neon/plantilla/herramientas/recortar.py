# Quita el fondo a las poses de tu mascota (o a cualquier imagen) → PNG transparente recortado al borde.
# Uso: python3 herramientas/recortar.py mascota/*.png     (crea <nombre>-cut.png al lado de cada una)
# Necesita una vez: pip install "rembg[cpu]" pillow   (descarga un modelo de ~170 MB la primera vez)
import os, sys
from PIL import Image
from rembg import remove, new_session
s = new_session('u2net')
for f in sys.argv[1:]:
    if f.endswith('-cut.png'): continue
    im = Image.open(f).convert('RGB'); cut = remove(im, session=s)
    bb = cut.getchannel('A').point(lambda a: 255 if a > 20 else 0).getbbox(); cut = cut.crop(bb) if bb else cut
    o = os.path.splitext(f)[0] + '-cut.png'; cut.save(o); print(o, cut.size)
