"""Regenerate portfolio media for a web study from its redesigned site.

The published presentation and product images place screenshots of a study
inside layered compositions and device photos. Each layer is described in
regions/<slug>.json by the page state it shows. For every layer this tool
renders that state from the previous build, fits the render to the published
image (SIFT matches, then ECC refinement), and draws a render of the same
state from the current build through the same homography.

Commands:
  media.py fit   <slug> [--image presentation|product] [--refit]
  media.py sweep <slug> <image> <layer> <minWidth> <maxWidth> [--step N] [--height H]
  media.py run   <slug> [--image presentation|product] [--refit]

See README.md for the region format and setup.
"""
import argparse
import json
import os
import sys

import cv2
import numpy as np
from PIL import Image

from compose import drop_shadow, layer_alpha, layer_pixels, match_new_to_old, smooth_fill, soften
from fitting import fit_error, polygons_mask, refine_ecc, sift_homography
from sources import CACHE, HERE, REPO, published, read_rgb, render, write_webp

REGIONS = HERE / "regions"
MEDIA = REPO / "public" / "portfolio" / "web-studies"
OLD_URL = os.environ.get("WEB_STUDY_OLD_URL", "http://127.0.0.1:4801")
NEW_URL = os.environ.get("WEB_STUDY_NEW_URL", "http://127.0.0.1:4802")
SCREENS = {"desktop": False, "mobile": True}


def region_file(slug):
    path = REGIONS / f"{slug}.json"
    if not path.exists():
        raise SystemExit(f"missing {path}")
    return path, json.loads(path.read_text())


def render_spec(config, layer, version="old"):
    """The page state for a layer. `renderNew` overrides it for the current build
    when the redesign reaches the same state through different controls."""
    spec = dict(layer["render"])
    if version == "new":
        spec.update(layer.get("renderNew", {}))
    spec.setdefault("path", config["path"])
    return spec


def fit_layer(target, old, layer):
    roi = layer.get("roi") or [0, 0, target.shape[1], target.shape[0]]
    H, inliers, matches = sift_homography(target, old, roi)
    return refine_ecc(target, old, H), f"{inliers}/{matches}"


def fit_image(slug, config, image, refit):
    target = published(slug, image)
    report = []
    for layer in config["images"][image]["layers"]:
        name = layer["name"]
        if "fill" in layer or "soften" in layer:
            continue
        old = render(OLD_URL, render_spec(config, layer), CACHE / slug / f"old-{image}-{name}.png")
        if refit or not layer.get("H"):
            H, layer["matches"] = fit_layer(target, old, layer)
            layer["H"] = [[round(float(v), 8) for v in row] for row in H]
        raw, lp = fit_error(target, old, np.array(layer["H"]), layer)
        layer["fitError"] = {"raw": raw, "lowPass": lp}
        report.append((image, name, layer.get("matches", "-"), raw, lp))
    return report


def compose_image(slug, config, image):
    target = published(slug, image)
    out = target.astype(np.float32)
    check = target.copy()
    footprints = {}
    for layer in config["images"][image]["layers"]:
        name = layer["name"]
        if "fill" in layer:
            keep = [footprints[other] for other in layer.get("keepLayers", []) if other in footprints]
            out = smooth_fill(out, layer["fill"], layer["sample"], keep)
            continue
        if "soften" in layer:
            out = soften(out, polygons_mask(layer["soften"], target.shape), layer.get("sigma", 6))
            continue
        H = np.array(layer["H"])
        old = read_rgb(CACHE / slug / f"old-{image}-{name}.png")
        new = render(NEW_URL, render_spec(config, layer, "new"), CACHE / slug / f"new-{image}-{name}.png")
        if layer.get("maxHeight"):
            old = old[: layer["maxHeight"]]
        if layer.get("newMaxHeight"):
            new = new[: layer["newMaxHeight"]]
        new = match_new_to_old(new, old, layer.get("fit", "width"))
        alpha = layer_alpha(target, layer, new, H)[..., None]
        footprints[name] = alpha[..., 0] > 0.5
        if layer.get("shadow"):
            out = drop_shadow(out, alpha[..., 0], layer["shadow"])
        out = alpha * layer_pixels(target, layer, old, new, H) + (1 - alpha) * out
        outline = cv2.findContours((alpha[..., 0] > 0.5).astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)[0]
        cv2.drawContours(check, outline, -1, (255, 0, 140), 2)
        if new.shape[0] != old.shape[0]:
            print(f"note: {image}/{name} new render is {new.shape[0]}px tall, old was {old.shape[0]}px")
    destination = MEDIA / slug / f"{image}.webp"
    write_webp(destination, out)
    side = np.concatenate([check, np.clip(out, 0, 255).astype(np.uint8)], axis=1)
    Image.fromarray(side).save(CACHE / slug / f"check-{image}.png")
    return destination


def capture_screens(slug, config):
    """Plain renders at the published size, which the study record also declares (2x pixels)."""
    for name, mobile in SCREENS.items():
        height, width = published(slug, name).shape[:2]
        spec = {"path": config["path"], "viewport": [width // 2, height // 2], "scale": 2, "mobile": mobile}
        spec.update(config.get("screens", {}).get(name, {}))
        write_webp(MEDIA / slug / f"{name}.webp", render(NEW_URL, spec, CACHE / slug / f"new-{name}.png"))


def sweep(slug, config, image, layer_name, low, high, step, height):
    """Try viewport widths for one layer and report the fit error of each, best last."""
    target = published(slug, image)
    layer = next(item for item in config["images"][image]["layers"] if item["name"] == layer_name)
    results = []
    for width in range(low, high + 1, step):
        spec = render_spec(config, layer)
        current = spec.get("viewport", [width, height or 900])
        spec["viewport"] = [width, height or current[1]]
        try:
            old = render(OLD_URL, spec, CACHE / slug / f"sweep-{width}.png")
            H, matches = fit_layer(target, old, layer)
            raw, lp = fit_error(target, old, H, layer)
        except SystemExit as error:
            print(f"{width}: {error}")
            continue
        results.append((lp, width, spec["viewport"], matches))
        print(f"{width}: low-pass {lp} raw {raw} matches {matches}")
    for lp, width, viewport, matches in sorted(results, reverse=True)[-5:]:
        print(f"best: viewport {viewport} low-pass {lp} matches {matches}")


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("command", choices=["fit", "run", "sweep"])
    parser.add_argument("slug")
    parser.add_argument("rest", nargs="*")
    parser.add_argument("--image", choices=["presentation", "product"])
    parser.add_argument("--refit", action="store_true")
    parser.add_argument("--step", type=int, default=8)
    parser.add_argument("--height", type=int)
    args = parser.parse_args()
    path, config = region_file(args.slug)
    if args.command == "sweep":
        image, layer, low, high = args.rest
        return sweep(args.slug, config, image, layer, int(low), int(high), args.step, args.height)
    images = [args.image] if args.image else ["presentation", "product"]
    report = []
    for image in images:
        report += fit_image(args.slug, config, image, args.refit)
    path.write_text(json.dumps(config, indent=2) + "\n")
    print(f"{'image':13} {'layer':24} {'matches':10} fit error raw / low-pass (0-255)")
    for image, name, matches, raw, lp in report:
        print(f"{image:13} {name:24} {matches:10} {raw} / {lp}{'  CHECK' if lp > 6 else ''}")
    if args.command == "run":
        if not args.image:
            capture_screens(args.slug, config)
        for image in images:
            print("wrote", compose_image(args.slug, config, image))
        print("check images:", CACHE / args.slug)


if __name__ == "__main__":
    sys.exit(main())
