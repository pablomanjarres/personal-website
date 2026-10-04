"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { workbenchTheme } from "@/app/site/theme";
import interaction from "@/app/site/interaction.module.css";
import type { StudyAsset } from "./data";
import styles from "./image-preview.module.css";

type Preview = { style: CSSProperties; motion: string | null; source: "pointer" | "focus" };
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
    const open = (source: Preview["source"]) => {
      const tokens = getComputedStyle(origin);
      setPreview({
        style: {
          "--paper": tokens.getPropertyValue("--paper").trim() || workbenchTheme.paper,
          "--ink": tokens.getPropertyValue("--ink").trim() || workbenchTheme.ink,
          "--motion-ease": tokens.getPropertyValue("--motion-ease").trim() || "ease",
        } as CSSProperties,
        motion: origin.closest("[data-motion]")?.getAttribute("data-motion") ?? null,
        source,
      });
    };
    const pointerEnter = (event: PointerEvent) => {
      if (!hoverMedia.matches || event.pointerType === "touch") return;
      hovering = true;
      open("pointer");
    };
    const pointerLeave = () => { hovering = false; close(); };
    const focusIn = () => { if (hoverMedia.matches && focusTarget.matches(":focus-visible")) open("focus"); };
    const focusOut = () => { if (!hovering) close(); };
    const updatePointer = () => {
      if (!focusAncestor) origin.tabIndex = hoverMedia.matches ? 0 : -1;
      hovering = false;
      close();
    };
    if (!focusAncestor) origin.tabIndex = hoverMedia.matches ? 0 : -1;
    origin.addEventListener("pointerenter", pointerEnter);
    origin.addEventListener("pointerleave", pointerLeave);
    focusTarget.addEventListener("focusin", focusIn);
    focusTarget.addEventListener("focusout", focusOut);
    hoverMedia.addEventListener("change", updatePointer);
    return () => {
      origin.removeEventListener("pointerenter", pointerEnter);
      origin.removeEventListener("pointerleave", pointerLeave);
      focusTarget.removeEventListener("focusin", focusIn);
      focusTarget.removeEventListener("focusout", focusOut);
      hoverMedia.removeEventListener("change", updatePointer);
      if (!focusAncestor) {
        if (oldTabIndex === null) origin.removeAttribute("tabindex");
        else origin.setAttribute("tabindex", oldTabIndex);
      }
    };
  }, []);
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
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("scroll", scroll, true);
      window.removeEventListener("wheel", close, true);
      window.removeEventListener("touchmove", close, true);
      window.removeEventListener("pointerdown", close, true);
      window.removeEventListener("resize", close);
    };
  }, [preview]);
  return <figure ref={originRef} className={`${className} ${interaction.action}`} style={style} data-media-kind={asset.kind}>
    {children}
    {preview && createPortal(<figure className={styles.preview} aria-hidden={true} data-motion={preview.motion} style={{ ...preview.style, "--preview-ratio": asset.width / asset.height } as CSSProperties}>
      <Image src={asset.src} alt="" width={asset.width} height={asset.height} sizes="92vw" loading="eager" />
    </figure>, document.body)}
  </figure>;
}
