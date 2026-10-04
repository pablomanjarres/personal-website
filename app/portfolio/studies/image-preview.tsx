"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { workbenchTheme } from "@/app/site/theme";
import interaction from "@/app/site/interaction.module.css";
import type { StudyAsset } from "./data";
import styles from "./image-preview.module.css";

type Preview = { style: CSSProperties; width: number; motion: string | null; source: "pointer" | "focus" };
type Props = { asset: StudyAsset & { src: string }; children: ReactNode; className?: string; style?: CSSProperties };

export function StudyImagePreview({ asset, children, className = "", style }: Props) {
  const originRef = useRef<HTMLElement>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  useEffect(() => {
    const origin = originRef.current;
    if (!origin) return;
    const focusAncestor = origin.parentElement?.closest<HTMLElement>("a[href], button, [tabindex='0']");
    const focusTarget = focusAncestor ?? origin;
    const oldTabIndex = origin.getAttribute("tabindex");
    const hoverMedia = window.matchMedia("(hover: hover) and (pointer: fine)");
    let hovering = false;
    const close = () => setPreview(null);
    const fitPreview = () => {
      const width = Math.max(0, Math.min(window.innerWidth * .92, window.innerHeight * .86 * asset.width / asset.height, 1600) - 18);
      const inlineWidth = origin.querySelector("img")?.getBoundingClientRect().width ?? 0;
      return { width, eligible: hoverMedia.matches && inlineWidth > 0 && width >= inlineWidth * 1.2 };
    };
    const open = (source: Preview["source"]) => {
      const fit = fitPreview();
      if (!fit.eligible) return false;
      const tokens = getComputedStyle(origin);
      setPreview({
        style: {
          "--paper": tokens.getPropertyValue("--paper").trim() || workbenchTheme.paper,
          "--ink": tokens.getPropertyValue("--ink").trim() || workbenchTheme.ink,
          "--motion-ease": tokens.getPropertyValue("--motion-ease").trim() || "ease",
        } as CSSProperties,
        width: fit.width,
        motion: origin.closest("[data-motion]")?.getAttribute("data-motion") ?? null,
        source,
      });
      return true;
    };
    const pointerEnter = (event: PointerEvent) => {
      if (!hoverMedia.matches || event.pointerType === "touch") return;
      hovering = open("pointer");
    };
    const pointerLeave = () => { hovering = false; close(); };
    const focusIn = () => { if (hoverMedia.matches && focusTarget.matches(":focus-visible")) open("focus"); };
    const focusOut = () => { if (!hovering) close(); };
    const updatePointer = () => {
      if (!focusAncestor) origin.tabIndex = fitPreview().eligible ? 0 : -1;
      hovering = false;
      close();
    };
    updatePointer();
    origin.addEventListener("pointerenter", pointerEnter);
    origin.addEventListener("pointerleave", pointerLeave);
    focusTarget.addEventListener("focusin", focusIn);
    focusTarget.addEventListener("focusout", focusOut);
    hoverMedia.addEventListener("change", updatePointer);
    window.addEventListener("resize", updatePointer);
    return () => {
      origin.removeEventListener("pointerenter", pointerEnter);
      origin.removeEventListener("pointerleave", pointerLeave);
      focusTarget.removeEventListener("focusin", focusIn);
      focusTarget.removeEventListener("focusout", focusOut);
      hoverMedia.removeEventListener("change", updatePointer);
      window.removeEventListener("resize", updatePointer);
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
    {children}
    {preview && createPortal(<figure className={styles.preview} aria-hidden={true} data-motion={preview.motion} style={{ ...preview.style, "--preview-width": `${preview.width + 18}px` } as CSSProperties}>
      <Image src={asset.src} alt="" width={asset.width} height={asset.height} sizes={`${preview.width}px`} loading="eager" />
    </figure>, document.body)}
  </figure>;
}
