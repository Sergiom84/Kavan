"""Busca candidatos de imagen en Wikimedia Commons y genera una hoja de contacto HTML."""
import json
import time
import urllib.error
import urllib.parse
import urllib.request

QUERIES = [
    ("merzouga-dunas", "Erg Chebbi dunes sunset Morocco"),
    ("merzouga-caravana", "camel caravan Erg Chebbi Merzouga"),
    ("merzouga-jaima", "desert camp tent Merzouga Morocco"),
    ("desierto-noche", "night sky stars Sahara Morocco desert"),
    ("dayet-srji", "Dayet Srji lake Merzouga"),
    ("ait-ben-haddou", "Ait Benhaddou ksar"),
    ("taourirt", "Kasbah Taourirt Ouarzazate"),
    ("ouarzazate", "Ouarzazate city Morocco"),
    ("todra", "Todra gorge Morocco"),
    ("dades", "Dades valley Morocco kasbah"),
    ("draa", "Draa valley palm grove Zagora"),
    ("erfoud-palmeral", "Tafilalt palm grove Erfoud oasis"),
    ("rissani", "Rissani souk Morocco market"),
    ("essaouira-puerto", "Essaouira harbour blue boats"),
    ("essaouira-skala", "Skala Essaouira ramparts"),
    ("essaouira-medina", "Essaouira medina street"),
    ("jemaa-el-fna", "Jemaa el-Fna square Marrakech"),
    ("bahia", "Bahia Palace Marrakech courtyard"),
    ("lalla-takerkoust", "Lalla Takerkoust lake Morocco"),
    ("tizi-n-tichka", "Tizi n'Tichka pass High Atlas road"),
]

API = "https://commons.wikimedia.org/w/api.php"
FREE = ("cc by", "cc0", "public domain", "cc-by")


def search(term, limit=5):
    params = {
        "action": "query",
        "format": "json",
        "generator": "search",
        "gsrnamespace": "6",
        "gsrlimit": str(limit),
        "gsrsearch": term,
        "prop": "imageinfo",
        "iiprop": "url|extmetadata|size",
        "iiurlwidth": "500",
    }
    url = f"{API}?{urllib.parse.urlencode(params)}"
    req = urllib.request.Request(url, headers={"User-Agent": "KavanSiteBuild/1.0 (contacto local)"})

    data = None
    for intento in range(5):
        try:
            with urllib.request.urlopen(req, timeout=30) as fh:
                data = json.load(fh)
            break
        except urllib.error.HTTPError as exc:
            if exc.code != 429 or intento == 4:
                raise
            time.sleep(5 * (intento + 1))
    if data is None:
        raise RuntimeError("sin respuesta")

    out = []
    for page in data.get("query", {}).get("pages", {}).values():
        info = page["imageinfo"][0]
        meta = info.get("extmetadata", {})
        lic = meta.get("LicenseShortName", {}).get("value", "")
        if not any(f in lic.lower() for f in FREE):
            continue
        if info.get("width", 0) < 1400:
            continue
        out.append({
            "title": page["title"].replace("File:", ""),
            "thumb": info.get("thumburl"),
            "full": info.get("url"),
            "width": info.get("width"),
            "height": info.get("height"),
            "license": lic,
            "artist": meta.get("Artist", {}).get("value", ""),
            "descurl": info.get("descriptionurl"),
        })
    return out


def main():
    results = {}
    cards = []
    for slug, term in QUERIES:
        try:
            found = search(term)
        except Exception as exc:  # noqa: BLE001
            print(f"[error] {slug}: {exc}")
            continue
        results[slug] = found
        print(f"{slug}: {len(found)} candidatos")
        time.sleep(2)
        for idx, item in enumerate(found):
            cards.append(
                f"<figure><img src='{item['thumb']}' loading='lazy'>"
                f"<figcaption><b>{slug} #{idx}</b><br>{item['title'][:60]}<br>"
                f"<span>{item['license']}</span></figcaption></figure>"
            )

    with open("scripts/commons-candidates.json", "w", encoding="utf-8") as fh:
        json.dump(results, fh, indent=2, ensure_ascii=False)

    html = (
        "<!doctype html><meta charset='utf-8'><style>"
        "body{background:#111;color:#eee;font:12px system-ui;margin:0;padding:12px}"
        "div{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}"
        "figure{margin:0}img{width:100%;height:150px;object-fit:cover;display:block}"
        "figcaption{font-size:10px;line-height:1.3;padding-top:3px}"
        "span{color:#8f8}</style><div>" + "".join(cards) + "</div>"
    )
    with open("scripts/contact-sheet.html", "w", encoding="utf-8") as fh:
        fh.write(html)
    print("\nHoja de contacto: scripts/contact-sheet.html")


if __name__ == "__main__":
    main()
