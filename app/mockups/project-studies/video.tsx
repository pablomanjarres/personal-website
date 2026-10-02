"use client";

import { useEffect, useRef } from "react";
import type { StudyAsset } from "./data";

export function StudyVideo({ asset }: { asset: StudyAsset }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    const root = video?.closest("[data-motion]");
    if (!video || !root) return;
    const pause = () => { if (root.getAttribute("data-motion") === "paused") video.pause(); };
    const observer = new MutationObserver(pause);
    observer.observe(root, { attributes: true, attributeFilter: ["data-motion"] });
    video.addEventListener("play", pause);
    return () => { observer.disconnect(); video.removeEventListener("play", pause); };
  }, []);
  return <video ref={ref} src={asset.src} poster={asset.poster} controls playsInline preload="none" aria-label={asset.alt} />;
}
