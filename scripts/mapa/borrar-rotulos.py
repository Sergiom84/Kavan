"""Borra del mapa los rótulos quemados de las ciudades con chincheta.

Difunde el rectángulo completo (Laplace sobre el anillo de contorno), no sólo
los píxeles por debajo de un umbral: filtrar por luminancia deja el perfil
antialiaseado asomando por detrás del rótulo HTML que lo sustituye. Encima
repone el grano del entorno, medido como alta frecuencia para que el parche no
gane textura donde el original es liso, como el mar de Essaouira.

Se probó también clonar relieve de otra zona del mapa dentro del hueco. Se
descartó: la corrección de tono necesaria para encajar el clon o le comía la
estructura, o le dejaba una mancha de otro color. El relieve del mapa tiene
llanos amplios, así que el parche difundido pasa por uno más.

Las cajas están medidas sobre `public/images/mapa-kavan-alpha.webp` a 1448x1086.
Si se cambia la imagen del mapa hay que volver a medirlas.
"""
from pathlib import Path

import numpy as np
from PIL import Image

ORIGEN = 'public/images/mapa-kavan-alpha.webp'
DESTINO = 'output/mapa-limpio.webp'

# x0, y0, x1, y1 inclusive, ya con holgura sobre la tinta medida.
ROTULOS = {
    'essaouira': (489, 523, 627, 555),
    'marrakech': (887, 515, 1041, 546),
    'ouarzazate': (910, 653, 1081, 686),
    'erfoud': (1211, 556, 1314, 587),
    'merzouga': (1196, 660, 1336, 691),
}

MARGEN = 6  # anillo de contorno que alimenta la difusión


def difundir(canal: np.ndarray, caja: tuple[int, int, int, int]) -> np.ndarray:
    """Resuelve Laplace dentro de la caja con el anillo exterior como frontera."""
    x0, y0, x1, y1 = caja
    sx0, sy0 = x0 - MARGEN, y0 - MARGEN
    sx1, sy1 = x1 + MARGEN, y1 + MARGEN
    zona = canal[sy0:sy1 + 1, sx0:sx1 + 1].astype(np.float64)

    hueco = np.zeros(zona.shape, dtype=bool)
    hueco[MARGEN:-MARGEN, MARGEN:-MARGEN] = True

    # Arranque: media del anillo, para que converja en pocas pasadas.
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
    """Alta frecuencia de la banda de terreno inmediatamente superior.

    La desviación en bruto mediría también el degradado del relieve y metería
    ruido visible donde el original es liso.
    """
    x0, y0, x1, _ = caja
    banda = datos[y0 - 14:y0 - 2, x0:x1 + 1, :3].astype(np.float64).mean(axis=2)
    suave = (banda[:-2, 1:-1] + banda[2:, 1:-1] + banda[1:-1, :-2] + banda[1:-1, 2:]) / 4
    return min(float((banda[1:-1, 1:-1] - suave).std()), 2.2)


def main() -> None:
    Path(DESTINO).parent.mkdir(parents=True, exist_ok=True)
    im = Image.open(ORIGEN).convert('RGBA')
    datos = np.asarray(im).copy()
    rng = np.random.default_rng(7)

    for nombre, caja in ROTULOS.items():
        x0, y0, x1, y1 = caja
        for c in range(4):  # incluye alfa: el rótulo también marcaba la máscara
            datos[..., c] = difundir(datos[..., c], caja)

        sigma = sigma_del_grano(datos, caja)
        alto, ancho = y1 - y0 + 1, x1 - x0 + 1
        # Mismo ruido en los tres canales, para no teñir el parche.
        ruido = rng.normal(0.0, sigma, (alto, ancho))[..., None]
        parche = datos[y0:y1 + 1, x0:x1 + 1, :3].astype(np.float64) + ruido
        datos[y0:y1 + 1, x0:x1 + 1, :3] = np.clip(parche, 0, 255).round().astype(np.uint8)
        print(f'{nombre}: caja {caja}, grano {sigma:.2f}')

    Image.fromarray(datos, 'RGBA').save(DESTINO, format='WEBP', quality=92, method=6)
    print('escrito', DESTINO)


if __name__ == '__main__':
    main()
