"""Refresh the Cortex/Anki logos in existing social cards and app screenshots.

Requires Pillow and rsvg-convert. Run after sync-project-brand-assets.mjs.
The photos, app content, typography, and layout stay unchanged.
"""

from __future__ import annotations

from io import BytesIO
from pathlib import Path
import subprocess

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"


def render(svg: Path, width: int, color: str | None = None) -> Image.Image:
    source = svg.read_text()
    if color:
        source = source.replace("currentColor", color)
    png = subprocess.check_output(["rsvg-convert", "-w", str(width)], input=source.encode())
    return Image.open(BytesIO(png)).convert("RGBA")


def paste(image: Image.Image, art: Image.Image, x: int, y: int) -> None:
    image.paste(art, (x, y), art)


def save(image: Image.Image, name: str) -> None:
    image.save(PUBLIC / name, optimize=True)


cortex_logo = PUBLIC / "brand/cortex/cortex-logo.svg"
anki_logo = PUBLIC / "brand/anki/anki-logo.svg"

# The social card already has a rounded cream panel. Redraw its exact bounds
# before placing the new vector lockup, leaving the pixel-art background alone.
cortex_og = Image.open(PUBLIC / "og/cortex.png").convert("RGB")
ImageDraw.Draw(cortex_og).rounded_rectangle((76, 54, 457, 158), radius=21, fill=(255, 253, 249))
paste(cortex_og, render(cortex_logo, 335), 101, 73)
save(cortex_og, "og/cortex.png")

anki_og = Image.open(PUBLIC / "og/anki.png").convert("RGB")
ImageDraw.Draw(anki_og).rectangle((75, 50, 460, 170), fill=(255, 253, 249))
paste(anki_og, render(anki_logo, 335), 100, 73)
save(anki_og, "og/anki.png")

# The Cortex screenshot header is a uniform sidebar surface. Render its real
# UI asset colors and dimensions over the previous logo in that surface.
cortex_preview = Image.open(PUBLIC / "portfolio/previews/cortex.png").convert("RGB")
ImageDraw.Draw(cortex_preview).rectangle((0, 0, 242, 93), fill=(24, 28, 40))
violet = "#BBA6FF"
paste(cortex_preview, render(PUBLIC / "brand/cortex/cortex-symbol.svg", 32, violet), 20, 38)
paste(cortex_preview, render(PUBLIC / "brand/cortex/cortex-wordmark.svg", 144, violet), 60, 38)
save(cortex_preview, "portfolio/previews/cortex.png")

# The Anki screenshot has a lightly textured cream background. A nearby clean
# area supplies that texture beneath the refreshed 152 px header lockup.
anki_preview = Image.open(PUBLIC / "portfolio/previews/anki.png").convert("RGB")
anki_preview.paste(anki_preview.crop((400, 15, 575, 75)), (180, 15))
paste(anki_preview, render(anki_logo, 152), 192, 24)
save(anki_preview, "portfolio/previews/anki.png")

print("Refreshed Cortex and Anki social cards and app preview logos from SVG geometry.")
