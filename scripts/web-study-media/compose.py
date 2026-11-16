"""Draw renders of the redesigned study into a published image."""
import cv2
import numpy as np

from fitting import polygons_mask, screen_interior, screen_mask, warp


def match_new_to_old(new, old, fit="width"):
    """Scale the new render uniformly so it matches the old render's width, height,
    or fits inside it ("contain"). The other dimension may differ."""
    factors = {"width": old.shape[1] / new.shape[1], "height": old.shape[0] / new.shape[0]}
    factor = min(factors.values()) if fit == "contain" else factors[fit]
    if abs(factor - 1) < 1e-6:
        return new
    size = (round(new.shape[1] * factor), round(new.shape[0] * factor))
    return cv2.resize(new, size, interpolation=cv2.INTER_AREA)


def photo_grade(target, warped_old, inside):
    """Gain, bias and tint that turn the clean old render into the screen as photographed.

    Contrast and brightness are fitted on luminance, which stays well conditioned on
    mostly light screens where a per-channel fit would drift into a colour cast; a
    small per-channel offset then carries the photo's tint."""
    a = warped_old[inside].reshape(-1, 3)
    b = target.astype(np.float32)[inside].reshape(-1, 3)
    la, lb = a.mean(axis=1), b.mean(axis=1)
    keep = np.ones(len(a), bool)
    gain, bias = 1.0, float(np.median(lb - la))
    for _ in range(3):
        if la[keep].std() > 8:
            A = np.stack([la[keep], np.ones(keep.sum())], axis=1)
            gain, bias = np.linalg.lstsq(A, lb[keep], rcond=None)[0]
            gain, bias = float(np.clip(gain, 0.2, 1.4)), float(np.clip(bias, -80, 200))
        error = np.abs(la * gain + bias - lb)
        keep = error < max(np.percentile(error, 70), 4)
    tint = np.clip(np.median(b[keep] - (a[keep] * gain + bias), axis=0), -30, 30)
    return np.full(3, gain), bias + tint


def masked_blur(values, mask, sigma):
    """Gaussian blur that only averages pixels inside the mask, so nothing outside bleeds in."""
    weight = cv2.GaussianBlur(mask.astype(np.float32), (0, 0), sigma)
    blurred = cv2.GaussianBlur(values * mask[..., None], (0, 0), sigma)
    return blurred / np.maximum(weight, 1e-3)[..., None]


def soften(out, mask, sigma):
    """Blur a region using only its own pixels, so reflections of an old screen stop being legible
    without pulling in the edges around them."""
    soft = cv2.GaussianBlur(mask.astype(np.float32), (0, 0), 2)[..., None]
    return soft * masked_blur(out, mask, sigma) + (1 - soft) * out


def layer_pixels(target, layer, old, new, H):
    size = (target.shape[1], target.shape[0])
    warped_new = warp(new, H, size).astype(np.float32)
    if layer.get("mode", "replace") != "photo":
        return warped_new
    warped_old = warp(old, H, size).astype(np.float32)
    inside = screen_interior(target.shape, old.shape, H, layer)
    gain, bias = photo_grade(target, warped_old, inside)
    graded = warped_new * gain + bias
    if layer.get("glare"):
        residual = target.astype(np.float32) - (warped_old * gain + bias)
        glare = masked_blur(residual, inside, layer.get("glareSigma", 24))
        graded += np.clip(glare, 0, 90)
    return graded


def smooth_fill(out, holes, samples, keep=()):
    """Fill holes with a quadratic gradient fitted per channel to sample areas, plus matching grain.
    Pixels already drawn by the layers in `keep` are left alone."""
    hole = polygons_mask(holes, out.shape)
    for footprint in keep:
        hole &= ~footprint
    sample = polygons_mask(samples, out.shape) & ~hole
    ys, xs = np.nonzero(sample)
    if len(xs) < 50:
        raise SystemExit("fill needs a larger sample area")
    def basis(x, y):
        x, y = x / out.shape[1], y / out.shape[0]
        return np.stack([np.ones_like(x), x, y, x * x, x * y, y * y], axis=1)
    A = basis(xs.astype(np.float64), ys.astype(np.float64))
    hy, hx = np.nonzero(hole)
    B = basis(hx.astype(np.float64), hy.astype(np.float64))
    rng = np.random.default_rng(7)
    result = out.copy()
    for c in range(3):
        values = out[ys, xs, c]
        coef = np.linalg.lstsq(A, values, rcond=None)[0]
        grain = np.std(values - A @ coef)
        result[hy, hx, c] = B @ coef + rng.normal(0, min(grain, 6), len(hx))
    soft = cv2.GaussianBlur(hole.astype(np.float32), (0, 0), 1.2)[..., None]
    return soft * result + (1 - soft) * out


def drop_shadow(out, alpha, shadow):
    offset = shadow.get("offset", [0, 10])
    moved = np.roll(alpha, (offset[1], offset[0]), axis=(0, 1))
    shade = cv2.GaussianBlur(moved, (0, 0), shadow.get("blur", 16)) * shadow.get("opacity", 0.35)
    return out * (1 - shade[..., None])


def layer_alpha(target, layer, new, H):
    size = (target.shape[1], target.shape[0])
    alpha = warp(screen_mask(new.shape, layer.get("cornerRadius", 0), layer.get("inset", 0)), H, size)
    alpha[polygons_mask(layer.get("exclude"), target.shape)] = 0
    return np.clip(alpha, 0, 1)
