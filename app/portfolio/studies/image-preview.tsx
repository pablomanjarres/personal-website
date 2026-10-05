"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import interaction from "@/app/site/interaction.module.css";
import type { StudyAsset } from "./data";
import styles from "./image-preview.module.css";

type Preview = { style: CSSProperties; width: number; motion: string | null; source: "pointer" | "focus" };
type Props = { asset: StudyAsset & { src: string }; imageProps: Pick<ImageProps, "src" | "alt" | "width" | "height" | "sizes" | "preload" | "style">; caption?: ReactNode; className?: string; style?: CSSProperties };
const zoomScale = 1.7;

export function StudyImagePreview({ asset, imageProps, caption, className = "", style }: Props) {
  const originRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  useEffect(() => {
    const origin = originRef.current;
    const frame = frameRef.current;
    if (!origin || !frame) return;
    const image = frame.querySelector("img");
    if (image) frame.style.borderRadius = getComputedStyle(image).borderRadius;
    const focusAncestor = origin.parentElement?.closest<HTMLElement>("a[href], button, [tabindex='0']");
    const focusTarget = focusAncestor ?? origin;
    const oldTabIndex = origin.getAttribute("tabindex");
    const oldEligibility = origin.getAttribute("data-zoomable");
    const hoverMedia = window.matchMedia("(hover: hover) and (pointer: fine)");
    const readFrameSize = () => ({ width: frame.clientWidth, height: frame.clientHeight });
    let frameSize = readFrameSize();
    let hovering = false;
    const close = () => setPreview(null);
    const fitPreview = () => {
      const width = Math.max(0, Math.min(window.innerWidth * .92, window.innerHeight * .86 * asset.width / asset.height, 1600) - 18);
      const inlineWidth = frame.clientWidth;
      return { width: inlineWidth * zoomScale, eligible: hoverMedia.matches && inlineWidth > 0 && width >= inlineWidth * 1.2 };
    };
    const open = (source: Preview["source"]) => {
      const fit = fitPreview();
      if (!fit.eligible) return false;
      setPreview({
        style: { "--zoom-scale": zoomScale } as CSSProperties,
        width: fit.width,
        motion: origin.closest("[data-motion]")?.getAttribute("data-motion") ?? null,
        source,
      });
      return true;
    };
    const pointerMove = (event: PointerEvent) => {
      if (!hovering || event.pointerType === "touch") return;
      const bounds = frame.getBoundingClientRect();
      const position = (value: number, start: number, size: number) => `${Math.max(0, Math.min(100, (value - start) / size * 100))}%`;
      frame.style.setProperty("--zoom-x", position(event.clientX, bounds.left, bounds.width));
      frame.style.setProperty("--zoom-y", position(event.clientY, bounds.top, bounds.height));
    };
    const pointerEnter = (event: PointerEvent) => {
      if (!hoverMedia.matches || event.pointerType === "touch") return;
      hovering = open("pointer");
      pointerMove(event);
    };
    const pointerLeave = () => { hovering = false; close(); };
    const focusIn = () => {
      if (!hoverMedia.matches || !focusTarget.matches(":focus-visible")) return;
      frame.style.setProperty("--zoom-x", "50%");
      frame.style.setProperty("--zoom-y", "50%");
      open("focus");
    };
    const focusOut = () => { if (!hovering) close(); };
    const updatePointer = () => {
      frameSize = readFrameSize();
      const { eligible } = fitPreview();
      origin.setAttribute("data-zoomable", String(eligible));
      if (!focusAncestor) origin.tabIndex = eligible ? 0 : -1;
      hovering = false;
      close();
    };
    updatePointer();
    const frameObserver = new ResizeObserver(() => {
      const next = readFrameSize();
      // Initial deliveries and image candidate rounding are not layout changes.
      if (Math.abs(next.width - frameSize.width) <= 1 && Math.abs(next.height - frameSize.height) <= 1) return;
      updatePointer();
    });
    frameObserver.observe(frame);
    frame.addEventListener("pointerenter", pointerEnter);
    frame.addEventListener("pointermove", pointerMove);
    frame.addEventListener("pointerleave", pointerLeave);
    focusTarget.addEventListener("focusin", focusIn);
    focusTarget.addEventListener("focusout", focusOut);
    hoverMedia.addEventListener("change", updatePointer);
    window.addEventListener("resize", updatePointer);
    return () => {
      frameObserver.disconnect();
      frame.removeEventListener("pointerenter", pointerEnter);
      frame.removeEventListener("pointermove", pointerMove);
      frame.removeEventListener("pointerleave", pointerLeave);
      focusTarget.removeEventListener("focusin", focusIn);
      focusTarget.removeEventListener("focusout", focusOut);
      hoverMedia.removeEventListener("change", updatePointer);
      window.removeEventListener("resize", updatePointer);
      if (oldEligibility === null) origin.removeAttribute("data-zoomable");
      else origin.setAttribute("data-zoomable", oldEligibility);
      if (!focusAncestor) {
        if (oldTabIndex === null) origin.removeAttribute("tabindex");
        else origin.setAttribute("tabindex", oldTabIndex);
      }
    };
  }, [asset.width, asset.height]);
  useEffect(() => {
    if (!preview) return;
    const close = () => setPreview(null);
    const scroll = () => { if (preview.source === "pointer") close(); };
    const keyDown = (event: KeyboardEvent) => {
      if (["Escape", "ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) close();
    };
    window.addEventListener("keydown", keyDown);
    window.addEventListener("scroll", scroll, { capture: true, passive: true });
    window.addEventListener("wheel", close, { capture: true, passive: true });
    window.addEventListener("touchmove", close, { capture: true, passive: true });
    window.addEventListener("pointerdown", close, true);
    return () => {
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("scroll", scroll, true);
      window.removeEventListener("wheel", close, true);
      window.removeEventListener("touchmove", close, true);
      window.removeEventListener("pointerdown", close, true);
    };
  }, [preview]);
  return <figure ref={originRef} className={`${className} ${interaction.action}`} style={style} data-media-kind={asset.kind}>
    <div ref={frameRef} className={styles.frame} data-zoomed={Boolean(preview)} data-motion={preview?.motion} style={preview?.style}>
      <Image {...imageProps} alt={imageProps.alt} style={{ aspectRatio: `${asset.width} / ${asset.height}`, ...imageProps.style }} sizes={preview ? `${preview.width}px` : imageProps.sizes} />
    </div>
    {caption}
  </figure>;
}
