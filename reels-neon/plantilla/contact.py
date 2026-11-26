# Hoja de contacto: junta los fotogramas de stills/ en una sola imagen para revisarlos de un vistazo.
# Uso: python3 contact.py [carpeta=stills] [salida=contact.jpg] [columnas=5]
import glob, sys
from PIL import Image, ImageDraw
d = sys.argv[1] if len(sys.argv) > 1 else 'stills'; out = sys.argv[2] if len(sys.argv) > 2 else 'contact.jpg'; cols = int(sys.argv[3]) if len(sys.argv) > 3 else 5
fs = sorted(glob.glob(f'{d}/*.jpg'))
if not fs: sys.exit('No hay fotogramas en ' + d)
w = 640; ims = [Image.open(f).convert('RGB') for f in fs]; h = int(w * ims[0].height / ims[0].width); rows = (len(ims) + cols - 1) // cols
sheet = Image.new('RGB', (cols * (w + 8) + 8, rows * (h + 8) + 8), (12, 12, 12)); dr = ImageDraw.Draw(sheet)
for i, (f, im) in enumerate(zip(fs, ims)):
    x, y = 8 + (i % cols) * (w + 8), 8 + (i // cols) * (h + 8); sheet.paste(im.resize((w, h)), (x, y))
    dr.rectangle([x, y, x + 120, y + 34], fill=(0, 0, 0)); dr.text((x + 8, y + 8), f.split('_')[-1][:-4] + ' s', fill=(255, 220, 0))
sheet.save(out, quality=86); print(out, sheet.size)
