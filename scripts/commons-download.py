"""Descarga la seleccion final de fotos de Wikimedia Commons y las convierte a webp."""
import json
import os
import re
import time
import urllib.error
import urllib.request

# (slug de busqueda, indice del candidato, nombre final del archivo)
SELECCION = [
    ("merzouga-dunas", 2, "dunas-erg-chebbi"),
    ("merzouga-dunas", 3, "dunas-amanecer"),
    ("merzouga-dunas", 0, "dunas-textura"),
    ("merzouga-jaima", 0, "campamento-jaima"),
    ("ait-ben-haddou", 2, "ait-ben-haddou"),
    ("ait-ben-haddou", 1, "dromedarios"),
    ("taourirt", 1, "kasbah-taourirt"),
    ("taourirt", 2, "ksar-taourirt"),
    ("ouarzazate", 2, "ouarzazate-atlas"),
    ("todra", 4, "todra-palmeras"),
    ("todra", 1, "todra-garganta"),
    ("dades", 0, "dades-kasbah"),
    ("draa", 0, "draa-palmeral"),
    ("draa", 1, "draa-timidert"),
    ("rissani", 0, "rissani-zoco"),
    ("essaouira-puerto", 1, "essaouira-barcas"),
    ("essaouira-puerto", 3, "essaouira-puerto"),
    ("essaouira-skala", 0, "essaouira-skala"),
    ("essaouira-medina", 0, "essaouira-medina"),
    ("essaouira-medina", 3, "essaouira-murallas"),
    ("jemaa-el-fna", 4, "jemaa-el-fna"),
    ("jemaa-el-fna", 3, "gnawa"),
    ("bahia", 2, "palacio-bahia"),
    ("lalla-takerkoust", 2, "lalla-takerkoust"),
    ("tizi-n-tichka", 1, "alto-atlas"),
]

ANCHO = 1800
DESTINO = "public/images"


def limpia_autor(html):
    """Extrae el nombre del autor del HTML que devuelve Commons."""
    texto = re.sub(r"<[^>]+>", "", html or "").strip()
    return re.sub(r"\s+", " ", texto)[:120]


def urls_candidatas(item):
    """Commons solo sirve ciertos anchos de miniatura; probamos 1920 y caemos al original."""
    thumb = item.get("thumb") or ""
    urls = []
    if "/thumb/" in thumb:
        urls.append(re.sub(r"/\d+px-", "/1920px-", thumb))
    if item.get("full"):
        urls.append(item["full"])
    if thumb and thumb not in urls:
        urls.append(thumb)
    return urls


def descarga(item):
    ultimo = None
    for url in urls_candidatas(item):
        for intento in range(4):
            req = urllib.request.Request(
                url, headers={"User-Agent": "KavanSiteBuild/1.0 (contacto local)"}
            )
            try:
                with urllib.request.urlopen(req, timeout=120) as resp:
                    return resp.read()
            except urllib.error.HTTPError as exc:
                ultimo = exc
                if exc.code == 429:
                    time.sleep(15 * (intento + 1))
                    continue
                break
            except Exception as exc:  # noqa: BLE001
                ultimo = exc
                break
    raise ultimo or RuntimeError("sin url valida")


def main():
    with open("scripts/commons-candidates.json", encoding="utf-8") as fh:
        data = json.load(fh)

    os.makedirs(DESTINO, exist_ok=True)
    try:
        from PIL import Image
        tiene_pillow = True
    except ImportError:
        tiene_pillow = False
        print("[aviso] Pillow no disponible: se guardan los originales sin convertir")

    creditos = []
    for slug, idx, nombre in SELECCION:
        items = data.get(slug, [])
        if idx >= len(items):
            print(f"[salto] {slug} #{idx} no existe")
            continue
        item = items[idx]
        ya = os.path.join(DESTINO, f"{nombre}.webp")
        if tiene_pillow and os.path.exists(ya):
            from PIL import Image as _Image
            with _Image.open(ya) as previa:
                if previa.width >= 1200:
                    print(f"{nombre}: ya estaba ({previa.width}x{previa.height})")
                    creditos.append({
                        "file": os.path.basename(ya),
                        "title": item["title"],
                        "author": limpia_autor(item.get("artist")),
                        "license": item["license"],
                        "source": item.get("descurl"),
                    })
                    continue

        try:
            bruto = descarga(item)
        except Exception as exc:  # noqa: BLE001
            print(f"[error] {nombre}: {exc}")
            continue

        temporal = os.path.join(DESTINO, f"_tmp_{nombre}")
        with open(temporal, "wb") as fh:
            fh.write(bruto)

        final = os.path.join(DESTINO, f"{nombre}.webp")
        if tiene_pillow:
            with Image.open(temporal) as img:
                img = img.convert("RGB")
                if img.width > ANCHO:
                    alto = round(img.height * ANCHO / img.width)
                    img = img.resize((ANCHO, alto), Image.LANCZOS)
                img.save(final, "WEBP", quality=82, method=6)
            os.remove(temporal)
        else:
            final = os.path.join(DESTINO, f"{nombre}.jpg")
            os.rename(temporal, final)

        kb = os.path.getsize(final) // 1024
        if tiene_pillow:
            from PIL import Image as _Image
            with _Image.open(final) as res:
                print(f"{nombre}: {kb} KB  {res.width}x{res.height}")
        else:
            print(f"{nombre}: {kb} KB")
        creditos.append({
            "file": os.path.basename(final),
            "title": item["title"],
            "author": limpia_autor(item.get("artist")),
            "license": item["license"],
            "source": item.get("descurl"),
        })
        time.sleep(5)

    with open("scripts/creditos-nuevos.json", "w", encoding="utf-8") as fh:
        json.dump(creditos, fh, indent=2, ensure_ascii=False)
    print(f"\n{len(creditos)} imagenes descargadas")


if __name__ == "__main__":
    main()
