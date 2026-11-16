"""Fit renders of a web study to the screens in a published image."""
import cv2
import numpy as np


def gray(rgb):
    return cv2.cvtColor(rgb, cv2.COLOR_RGB2GRAY)


def sift_homography(target, source, roi):
    x, y, w, h = roi
    crop = gray(target[y:y + h, x:x + w])
    sift = cv2.SIFT_create(nfeatures=12000)
    kp_t, des_t = sift.detectAndCompute(crop, None)
    kp_s, des_s = sift.detectAndCompute(gray(source), None)
    if des_t is None or des_s is None:
        raise SystemExit("no features found; check the roi and render state")
    matcher = cv2.FlannBasedMatcher({"algorithm": 1, "trees": 5}, {"checks": 64})
    good = [m for m, n in matcher.knnMatch(des_s, des_t, k=2) if m.distance < 0.72 * n.distance]
    if len(good) < 12:
        raise SystemExit(f"only {len(good)} feature matches; the render probably shows a different state")
    s = np.float32([kp_s[m.queryIdx].pt for m in good])
    t = np.float32([kp_t[m.trainIdx].pt for m in good]) + np.float32([x, y])
    H, inliers = cv2.findHomography(s, t, cv2.RANSAC, 2.5, maxIters=20000, confidence=0.999)
    if H is None:
        raise SystemExit("homography fit failed")
    return H, int(inliers.sum()), len(good)


def warp(source, H, size):
    """Warp source into a target of size (w, h), pre-shrinking large sources to avoid aliasing."""
    scale = np.sqrt(abs(np.linalg.det(H[:2, :2])))
    if scale < 0.6:
        factor = max(scale * 1.25, 0.05)
        small = cv2.resize(source, None, fx=factor, fy=factor, interpolation=cv2.INTER_AREA)
        return cv2.warpPerspective(small, H @ np.linalg.inv(np.diag([factor, factor, 1.0])), size, flags=cv2.INTER_LINEAR)
    return cv2.warpPerspective(source, H, size, flags=cv2.INTER_LINEAR)


def screen_mask(shape, radius=0, inset=0):
    """A float mask the size of a render: 1 inside, with optional rounded corners and inset (render px)."""
    h, w = shape[:2]
    mask = np.zeros((h, w), np.uint8)
    x0, y0, x1, y1 = inset, inset, w - 1 - inset, h - 1 - inset
    r = int(max(0, min(radius, (x1 - x0) // 2, (y1 - y0) // 2)))
    cv2.rectangle(mask, (x0 + r, y0), (x1 - r, y1), 1, -1)
    cv2.rectangle(mask, (x0, y0 + r), (x1, y1 - r), 1, -1)
    for cx, cy in [(x0 + r, y0 + r), (x1 - r, y0 + r), (x0 + r, y1 - r), (x1 - r, y1 - r)]:
        cv2.circle(mask, (cx, cy), r, 1, -1, lineType=cv2.LINE_AA)
    return mask.astype(np.float32)


def refine_ecc(target, source, H):
    size = (target.shape[1], target.shape[0])
    warped = gray(warp(source, H, size)).astype(np.float32)
    inside = warp(np.ones(source.shape[:2], np.float32), H, size) > 0.99
    mask = cv2.erode(inside.astype(np.uint8), np.ones((9, 9), np.uint8))
    W = np.eye(3, dtype=np.float32)
    criteria = (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 200, 1e-6)
    try:
        _, W = cv2.findTransformECC(gray(target).astype(np.float32), warped, W, cv2.MOTION_HOMOGRAPHY, criteria, mask, 5)
    except cv2.error:
        return H
    return np.linalg.inv(W.astype(np.float64)) @ H


def polygons_mask(polygons, shape):
    mask = np.zeros(shape[:2], np.uint8)
    for polygon in polygons or []:
        cv2.fillPoly(mask, [np.int32(polygon)], 1)
    return mask.astype(bool)


def fit_error(target, source, H, layer):
    """Mean absolute difference (0-255) between the published image and the old render, inside the screen."""
    size = (target.shape[1], target.shape[0])
    inside = warp(screen_mask(source.shape, layer.get("cornerRadius", 0), layer.get("inset", 0) + 6), H, size) > 0.99
    inside &= ~polygons_mask(layer.get("exclude"), target.shape)
    if not inside.any():
        return float("inf"), float("inf")
    a = target.astype(np.float32)
    b = warp(source, H, size).astype(np.float32)
    raw = float(np.abs(a - b)[inside].mean())
    lp = float(np.abs(cv2.GaussianBlur(a, (0, 0), 1) - cv2.GaussianBlur(b, (0, 0), 1))[inside].mean())
    return round(raw, 2), round(lp, 2)
