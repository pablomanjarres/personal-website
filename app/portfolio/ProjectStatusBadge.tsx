import type { ProjectStatus } from "@/app/projects";
import { STATUS_LABEL } from "./status";
import styles from "./project-status-badge.module.css";

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span className={styles.status} data-status={status}>
      <span className={styles.dot} aria-hidden />
      {STATUS_LABEL[status]}
    </span>
  );
}
