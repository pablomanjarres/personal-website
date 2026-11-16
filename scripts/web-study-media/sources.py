"""Inputs and outputs for web study media: published images, page renders and webp files."""
import json
import os
import subprocess
from pathlib import Path

import numpy as np
from PIL import Image

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[1]
CACHE = Path(os.environ.get("WEB_STUDY_MEDIA_CACHE", "/tmp/web-study-media"))
# The commit whose images the region files were fitted to: the portfolio before the refined studies.
# Point WEB_STUDY_SOURCE_REF at a newer commit only after refitting every region against its images.
SOURCE_REF = os.environ.get("WEB_STUDY_SOURCE_REF", "333429ea9eaa77eb25efe46c08558db4d26b58f8")
WEBP_QUALITY = 90


def read_rgb(path):
    return np.asarray(Image.open(path).convert("RGB"))


def write_webp(path, rgb):
    Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8)).save(path, "WEBP", quality=WEBP_QUALITY, method=6)


def published(slug, image):
    """The image as published before regeneration, read from git so reruns stay stable."""
    ref = subprocess.run(["git", "-C", str(REPO), "rev-parse", "--short=12", SOURCE_REF], check=True, capture_output=True, text=True).stdout.strip()
    out = CACHE / slug / f"published-{ref}-{image}.png"
    if not out.exists():
        out.parent.mkdir(parents=True, exist_ok=True)
        blob = subprocess.run(
            ["git", "-C", str(REPO), "show", f"{SOURCE_REF}:public/portfolio/web-studies/{slug}/{image}.webp"],
            check=True, capture_output=True,
        ).stdout
        tmp = out.with_suffix(".webp")
        tmp.write_bytes(blob)
        Image.open(tmp).convert("RGB").save(out)
        tmp.unlink()
    return read_rgb(out)


def render(base_url, spec, out):
    out.parent.mkdir(parents=True, exist_ok=True)
    result = subprocess.run(["node", str(HERE / "render.cjs"), base_url, json.dumps(spec), str(out)], capture_output=True, text=True)
    if result.returncode != 0:
        raise SystemExit(f"render failed for {spec}: {result.stderr.strip()}")
    return read_rgb(out)
