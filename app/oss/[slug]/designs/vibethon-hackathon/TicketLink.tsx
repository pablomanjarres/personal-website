import type { CSSProperties, ReactNode } from "react";
import styles from "../vibethon-hackathon.module.css";

/**
 * The valet ticket: a tear-off stub with the app's first ticket number. On hover
 * the stub tears along its perforation and the arrow drives out. Used for the
 * quieter third CTA so it still reads as part of the lot, not a bare link.
 */
export default function TicketLink({
  href,
  stub,
  style,
  children,
}: {
  href: string;
  stub: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <a className={styles.ticket} href={href} style={style}>
      <span className={styles.ticketStub} aria-hidden="true">
        {stub}
      </span>
      <span className={styles.ticketBody}>
        {children}
        <span className={styles.ticketArrow} aria-hidden="true">
          →
        </span>
      </span>
    </a>
  );
}
