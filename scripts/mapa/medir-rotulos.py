"""Localiza los rótulos quemados en el mapa: agrupa la tinta oscura en cajas."""
from collections import deque

import numpy as np
from PIL import Image

im = Image.open('public/images/mapa-kavan-alpha.webp').convert('RGBA')
a = np.asarray(im).astype(np.int16)
rgb, alpha = a[..., :3], a[..., 3]
lum = rgb @ np.array([0.2126, 0.7152, 0.0722])

# Tinta: oscura y opaca. El umbral deja fuera el relieve y el sombreado del mar.
mask = (lum < 140) & (alpha > 120)
print('pixeles de tinta:', int(mask.sum()))

# Dilatación horizontal para que las letras de una palabra queden pegadas.
d = mask.copy()
for k in range(1, 14):
    d[:, k:] |= mask[:, :-k]
    d[:, :-k] |= mask[:, k:]
for k in range(1, 4):
    d[k:, :] |= mask[:-k, :]
    d[:-k, :] |= mask[k:, :]

h, w = d.shape
seen = np.zeros_like(d)
cajas = []
ys, xs = np.nonzero(d)
for y0, x0 in zip(ys, xs):
    if seen[y0, x0]:
        continue
    q = deque([(y0, x0)])
    seen[y0, x0] = True
    miny = maxy = y0
    minx = maxx = x0
    n = 0
    while q:
        y, x = q.popleft()
        n += 1
        miny, maxy = min(miny, y), max(maxy, y)
        minx, maxx = min(minx, x), max(maxx, x)
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and d[ny, nx] and not seen[ny, nx]:
                seen[ny, nx] = True
                q.append((ny, nx))
    if n > 250:
        cajas.append((minx, miny, maxx, maxy, n))

cajas.sort(key=lambda c: -c[4])
for minx, miny, maxx, maxy, n in cajas[:25]:
    print(f'x {minx:4d}-{maxx:4d}  y {miny:4d}-{maxy:4d}  ancho {maxx-minx:4d} alto {maxy-miny:3d}  px {n}')
