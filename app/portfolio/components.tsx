import Link from "next/link";
import type { Project, ProjectStatus } from "../projects";

const STATUS_LABEL: Record<ProjectStatus, string> = {
  live: "live",
  shipped: "shipped",
  wip: "in progress",
  prototype: "prototype",
  archived: "archived",
};

export function Status({ status }: { status: ProjectStatus }) {
  return (
    <span className="status" data-status={status}>
      <span className="status-dot" aria-hidden />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function Chip({ label, accent }: { label: string; accent?: boolean }) {
  return <span className={accent ? "chip chip-accent" : "chip"}>{label}</span>;
}

export function ProjectCard({ project }: { project: Project }) {
  const href = `/portfolio/projects/${project.slug}`;
  return (
    <Link
      href={href}
      className={project.featured ? "folio-card is-featured" : "folio-card"}
      aria-label={`${project.title} — ${project.oneLiner}`}
    >
      <div className="card-top">
        <span className="card-num">{project.num}</span>
        {project.featured ? (
          <span className="card-flag">✶ flagship</span>
        ) : (
          <Status status={project.status} />
        )}
      </div>

      <h2 className="card-title">{project.title}</h2>
      <div className="card-line" aria-hidden />
      <p className="card-oneliner">{project.oneLiner}</p>

      <div className="card-foot">
        <div className="card-tags">
          {project.tags.slice(0, 3).map((t) => (
            <Chip key={t} label={t} />
          ))}
        </div>
        <span className="card-arrow" aria-hidden>
          ↗
        </span>
      </div>
    </Link>
  );
}
