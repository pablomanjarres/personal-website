"use client";

import { useState } from "react";

// Shows the screenshot by default (always renders, never a blank flash), then
// swaps in the real interactive site on click. Only used for projects whose
// live site allows framing.
export function LiveEmbed({
  embedUrl,
  cover,
  title,
}: {
  embedUrl: string;
  cover?: string;
  title: string;
}) {
  const [live, setLive] = useState(false);

  if (live) {
    return (
      <iframe
        className="live-iframe"
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
      className="live-launch"
      onClick={() => setLive(true)}
      aria-label={`Run the live ${title} demo`}
    >
      {cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={cover} alt="" />
      )}
      <span className="live-scan" aria-hidden />
      <span className="live-launch-overlay">
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
