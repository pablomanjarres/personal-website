"use client";

import { useState } from "react";
import Image from "next/image";
import interaction from "@/app/site/interaction.module.css";

// Shows a product preview by default, then
// swaps in the real interactive site on click. Only used for projects whose
// live site allows framing.
export function LiveEmbed({
  embedUrl,
  cover,
  title,
  className = "",
}: {
  embedUrl: string;
  cover?: { src: string; width: number; height: number };
  title: string;
  className?: string;
}) {
  const [live, setLive] = useState(false);

  if (live) {
    return (
      <iframe
        className={`live-iframe ${className}`}
        src={embedUrl}
        title={`${title} live demo`}
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />
    );
  }

  return (
    <button
      type="button"
      className={`live-launch ${interaction.mediaTrigger} ${className}`}
      onClick={() => setLive(true)}
      aria-label={`Run the live ${title} demo`}
    >
      {cover && (
        <Image src={cover.src} width={cover.width} height={cover.height} sizes="(max-width: 700px) 94vw, 90vw" alt="" />
      )}
      <span className="live-scan" aria-hidden />
      <span className={`live-launch-overlay ${interaction.button}`}>
        <span className="live-launch-btn">
          <span className="live-launch-play" aria-hidden>
            ▶
          </span>
          Run live demo
        </span>
      </span>
    </button>
  );
}
