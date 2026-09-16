"""Borra del mapa las chinchetas dibujadas: círculo, punto y vástago.

Hermano de `borrar-rotulos.py` y con su misma técnica —Laplace dentro de la
caja con el anillo de contorno como frontera, y grano repuesto del entorno—,
porque el problema es el mismo: tinta quemada en el WebP que ahora dibuja HTML
encima. La chincheta dorada tapaba el círculo pero no el vástago, y esa rayita
oscura asomaba por debajo.

Las cajas no van a mano: se miden buscando la tinta oscura alrededor del punto
de anclaje que ya usa `MoroccoMap.tsx` (base del vástago, en porcentaje sobre
1448x1086). Así, si se recolocan las chinchetas, basta con actualizar ahí.
"""
from pathlib import Path

import numpy as np
from PIL import Image

ORIGEN = 'public/images/mapa-kavan-alpha.webp'
DESTINO = 'output/mapa-sin-chinchetas.webp'

ANCHO, ALTO = 1448, 1086

# Los mismos porcentajes de PUNTOS en src/components/travel/MoroccoMap.tsx.
ANCLAS = {
    'essaouira': (44.3, 52.1),
    'marrakech': (59.8, 50.8),
    'agafay': (61.3, 55.6),
    'ouarzazate': (69.8, 59.7),
    'zagora': (76.6, 66.3),
    'erfoud': (82.3, 54.3),
    'merzouga': (86.0, 60.1),
}

# Ventana de búsqueda alrededor del ancla: la chincheta sube (círculo de 22 px
# sobre un vástago de 29) y no baja apenas.
BUSCA = dict(izq=26, der=26, arriba=62, abajo=8)
UMBRAL = 150  # luminancia por debajo de la cual se considera tinta
HOLGURA = 3   # píxeles de más alrededor de la tinta encontrada
MARGEN = 6    # anillo de contorno que alimenta la difusión


def caja_de_tinta(datos: np.ndarray, ancla: tuple[float, float]) -> tuple[int, int, int, int] | None:
    """Rectángulo que encierra la tinta de la chincheta, o None si no hay."""
    ax = round(ancla[0] / 100 * ANCHO)
    ay = round(ancla[1] / 100 * ALTO)

    x0 = max(MARGEN + 1, ax - BUSCA['izq'])
    x1 = min(ANCHO - MARGEN - 2, ax + BUSCA['der'])
    y0 = max(MARGEN + 1, ay - BUSCA['arriba'])
    y1 = min(ALTO - MARGEN - 2, ay + BUSCA['abajo'])

    zona = datos[y0:y1 + 1, x0:x1 + 1, :3].astype(np.float64).mean(axis=2)
    tinta = zona < UMBRAL
    if not tinta.any():
        return None

    filas = np.flatnonzero(tinta.any(axis=1))
    columnas = np.flatnonzero(tinta.any(axis=0))

    return (
        max(MARGEN, x0 + int(columnas[0]) - HOLGURA),
        max(MARGEN, y0 + int(filas[0]) - HOLGURA),
        min(ANCHO - MARGEN - 1, x0 + int(columnas[-1]) + HOLGURA),
        min(ALTO - MARGEN - 1, y0 + int(filas[-1]) + HOLGURA),
    )


def difundir(canal: np.ndarray, caja: tuple[int, int, int, int]) -> np.ndarray:
    """Resuelve Laplace dentro de la caja con el anillo exterior como frontera."""
    x0, y0, x1, y1 = caja
    sx0, sy0 = x0 - MARGEN, y0 - MARGEN
    sx1, sy1 = x1 + MARGEN, y1 + MARGEN
    zona = canal[sy0:sy1 + 1, sx0:sx1 + 1].astype(np.float64)

    hueco = np.zeros(zona.shape, dtype=bool)
    hueco[MARGEN:-MARGEN, MARGEN:-MARGEN] = True
    zona[hueco] = zona[~hueco].mean()

    for _ in range(4000):
        vecinos = np.zeros_like(zona)
        vecinos[1:-1, 1:-1] = (
            zona[:-2, 1:-1] + zona[2:, 1:-1] + zona[1:-1, :-2] + zona[1:-1, 2:]
        ) / 4
        zona[hueco] = vecinos[hueco]

    canal[sy0:sy1 + 1, sx0:sx1 + 1] = np.clip(zona, 0, 255).round().astype(canal.dtype)
    return canal


def sigma_del_grano(datos: np.ndarray, caja: tuple[int, int, int, int]) -> float:
    """Alta frecuencia de la banda de terreno inmediatamente superior."""
    x0, y0, x1, _ = caja
    banda = datos[max(0, y0 - 14):max(2, y0 - 2), x0:x1 + 1, :3].astype(np.float64).mean(axis=2)
    if banda.shape[0] < 4 or banda.shape[1] < 4:
        return 0.0
    suave = (banda[:-2, 1:-1] + banda[2:, 1:-1] + banda[1:-1, :-2] + banda[1:-1, 2:]) / 4
    return min(float((banda[1:-1, 1:-1] - suave).std()), 2.2)


def main() -> None:
    Path(DESTINO).parent.mkdir(parents=True, exist_ok=True)
    im = Image.open(ORIGEN).convert('RGBA')
    datos = np.asarray(im).copy()
    rng = np.random.default_rng(11)

    for nombre, ancla in ANCLAS.items():
        caja = caja_de_tinta(datos, ancla)
        if caja is None:
            print(f'{nombre}: sin tinta en la ventana, nada que borrar')
            continue

        for c in range(4):  # el alfa también lleva la marca
            datos[..., c] = difundir(datos[..., c], caja)

        sigma = sigma_del_grano(datos, caja)
        x0, y0, x1, y1 = caja
        alto, ancho = y1 - y0 + 1, x1 - x0 + 1
        ruido = rng.normal(0.0, sigma, (alto, ancho))[..., None]
        parche = datos[y0:y1 + 1, x0:x1 + 1, :3].astype(np.float64) + ruido
        datos[y0:y1 + 1, x0:x1 + 1, :3] = np.clip(parche, 0, 255).round().astype(np.uint8)
        print(f'{nombre}: caja {caja}, grano {sigma:.2f}')

    Image.fromarray(datos, 'RGBA').save(DESTINO, format='WEBP', quality=92, method=6)
    print('escrito', DESTINO)


if __name__ == '__main__':
    main()
