import type { CSSProperties, ReactNode } from "react";
import styles from "../vibethon-hackathon.module.css";

/**
 * The signature CTA, drawn as a parking stall seen from above. At rest only the
 * back line shows; on hover or focus the two side lines paint in, a small car
 * rolls into the bay and the bay lamp turns hedge-green (free) or amber
 * (ticket). Motion lives in the CSS module and is opt-in.
 */
export default function StallButton({
  href,
  tone = "free",
  external = false,
  ariaLabel,
  style,
  children,
}: {
  href: string;
  tone?: "free" | "ticket";
  external?: boolean;
  ariaLabel?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const ext = external ? { target: "_blank", rel: "noreferrer" } : {};
  return (
    <a
      className={`${styles.stallBtn} ${tone === "ticket" ? styles.stallTicket : styles.stallFree}`}
      href={href}
      aria-label={ariaLabel}
      style={style}
      {...ext}
    >
      <svg className={styles.stallLines} viewBox="0 0 200 56" preserveAspectRatio="none" aria-hidden="true">
        <path className={styles.lineBack} d="M2 2H198" pathLength={1} />
        <path className={styles.lineSide} d="M2 2V54" pathLength={1} />
        <path className={styles.lineSide} d="M198 2V54" pathLength={1} />
      </svg>
      <svg className={styles.stallCar} viewBox="0 0 24 14" aria-hidden="true">
        <rect x="1" y="1.5" width="22" height="11" rx="3" />
        <rect className={styles.carGlass} x="15" y="3" width="4" height="8" rx="1.2" />
        <rect className={styles.carGlass} x="4" y="3.5" width="3" height="7" rx="1" />
      </svg>
      <span className={styles.stallLamp} aria-hidden="true" />
      <span className={styles.stallLabel}>{children}</span>
    </a>
  );
}
