# Web study media

Regenerates `public/portfolio/web-studies/<slug>/{desktop,mobile,presentation,product}.webp`
after a study in `pablomanjarres/twenty-web-studies` changes.

- `desktop.webp` and `mobile.webp` are plain renders of the current build at half their published size, at 2x (1600×991 and 440×948 for most studies).
- `presentation.webp` and `product.webp` are compositions: angled desktop panels, cards and device photos.
  Each screen in them is a **layer** in `regions/<slug>.json`. The tool renders the layer's page state
  from the previous build, fits that render to the published image (SIFT, RANSAC, then ECC), and draws
  the same state from the current build through the fitted homography.

## Setup

```sh
python3 -m venv ~/.cache/web-study-media-venv
~/.cache/web-study-media-venv/bin/pip install opencv-python-headless numpy pillow
export NODE_PATH=/path/to/a/node_modules/containing/playwright
```

Serve both builds of twenty-web-studies (`npm run build`, then `npx vite preview --port <port>`):

| Variable | Default | Build |
| --- | --- | --- |
| `WEB_STUDY_OLD_URL` | `http://127.0.0.1:4801` | the build the published images were made from |
| `WEB_STUDY_NEW_URL` | `http://127.0.0.1:4802` | the build to publish |
| `WEB_STUDY_SOURCE_REF` | `333429e` | commit holding the images the region files were fitted to |

## Commands

```sh
python media.py sweep <slug> <image> <layer> <minWidth> <maxWidth> [--step 8] [--height H]
python media.py fit <slug> [--image presentation|product] [--refit]
python media.py run <slug> [--image presentation|product] [--refit]
```

`sweep` finds the viewport a layer was captured at. `fit` stores each layer's homography and fit error
in the region file. `run` also writes the images and a side-by-side `check-<image>.png` (published with
layer outlines, then the result) under `/tmp/web-study-media/<slug>/`. A low-pass fit error under about 5
means the old render lines up with the published screen.

## Layers

```json
{ "name": "tablet", "render": { "viewport": [834, 1168], "mobile": true }, "roi": [470, 180, 650, 870],
  "mode": "photo", "cornerRadius": 44, "glare": true }
```

- `render`: `path`, `viewport`, `scale` (2), `mobile`, `scrollY`, `steps` (`click`, `hover`, `fill`, `press`,
  `scrollTo`, `scrollY`, `eval`, `wait`), `element` to capture one element, or `clip` in CSS pixels.
- `renderNew`: overrides for the current build when it reaches the same state through different controls.
- `roi`: `[x, y, w, h]` of the published image to search for the screen.
- `mode`: `replace` for flat compositions; `photo` for device photos, which matches the screen's tint and
  brightness, and adds the photo's glare when `glare` is true.
- `cornerRadius` and `inset` (render pixels) shape the screen mask; `exclude` lists polygons to keep.
- `pinH: true` keeps a stored homography through `--refit`, for screens placed from measured corners.
- `fit`: `width` (default), `height` or `contain` when the new render's size differs from the old one;
  `maxHeight` and `newMaxHeight` crop the old and new renders from the top first.
- A layer with `soften` (polygons, optional `sigma`) blurs reflections of the old screen until they are no longer legible.
- A layer with `fill` (polygons) and `sample` (polygons) paints over leftovers with a gradient fitted to the
  sample area; `keepLayers` protects layers already drawn.

Layers draw in order, so put overlays after the panels they cover.
