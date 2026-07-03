import Link from "next/link";
import type { Project, ProjectStatus } from "../projects";
import { LiveEmbed } from "./LiveEmbed";

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

// The visual for a card / detail hero. A real screenshot when we have one,
// otherwise a branded plate so every project still has a preview.
function Shot({ project }: { project: Project }) {
  if (project.cover) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={project.cover} alt={`${project.title} preview`} loading="lazy" />
    );
  }
  return (
    <div className="shot-ph" aria-hidden>
      <span className="shot-ph-kind">{project.tags[0] ?? "project"}</span>
      <span className="shot-ph-title">{project.title}</span>
    </div>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  const href = `/portfolio/projects/${project.slug}`;
  return (
    <Link
      href={href}
      className={project.featured ? "folio-card is-featured" : "folio-card"}
      aria-label={`${project.title} — ${project.oneLiner}`}
    >
      <div className="card-shot">
        <Shot project={project} />
        <span className="card-shot-num">{project.num}</span>
        {project.featured && <span className="card-shot-flag">✶ flagship</span>}
      </div>
      <div className="card-body">
        <div className="card-top">
          <h2 className="card-title">{project.title}</h2>
          <Status status={project.status} />
        </div>
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
      </div>
    </Link>
  );
}

// Branded plate for the detail page when a project has no screenshot or live
// site (desktop apps, CLIs). Keeps every project visual and on-brand.
export function PreviewPlate({ project }: { project: Project }) {
  return (
    <div className="proj-plate">
      <span className="shot-ph-kind">{project.tags[0] ?? "project"}</span>
      <span className="proj-plate-title">{project.title}</span>
      <span className="proj-plate-sub">{project.oneLiner}</span>
    </div>
  );
}

// A browser window on the detail page. Interactive iframe demo when the site
// allows framing; otherwise a clickable screenshot that opens the live site.
export function DemoFrame({
  label,
  title,
  embedUrl,
  cover,
  openUrl,
}: {
  label: string;
  title: string;
  embedUrl?: string;
  cover?: string;
  openUrl?: string;
}) {
  return (
    <div className={embedUrl ? "browser is-live" : "browser"}>
      <div className="browser-bar">
        <span className="browser-dots" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className="browser-url">{label}</span>
        {openUrl && (
          <a className="browser-open" href={openUrl} target="_blank" rel="noreferrer">
            open ↗
          </a>
        )}
      </div>
      <div className="browser-body">
        {embedUrl ? (
          <LiveEmbed embedUrl={embedUrl} cover={cover} title={title} />
        ) : cover && openUrl ? (
          <a href={openUrl} target="_blank" rel="noreferrer" className="browser-shot">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cover} alt={`${title} preview`} loading="lazy" />
          </a>
        ) : cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt={`${title} preview`} loading="lazy" />
        ) : null}
      </div>
    </div>
  );
}
