import { Fragment, type CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects, type ProjectLink } from "../../../projects";
import { Chip, DemoFrame, PreviewPlate, Status } from "../../components";

// Only the known projects exist; unknown slugs 404 at build/runtime.
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Not found — Pablo Manjarres" };
  const title = `${project.title} — Pablo Manjarres`;
  return {
    title,
    description: project.tagline,
    openGraph: {
      title,
      description: project.tagline,
      url: `https://pablomanjarres.com/portfolio/projects/${project.slug}`,
      type: "article",
      images: [`/og/${project.slug}.png`],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: project.tagline,
      images: [`/og/${project.slug}.png`],
    },
  };
}

function paragraphs(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function btnClass(kind: ProjectLink["kind"], featured?: boolean): string {
  if (kind === "live") return featured ? "proj-btn accent" : "proj-btn primary";
  return "proj-btn ghost";
}

// Metrics arrive as full phrases. Emphasize a leading number when there is one
// (e.g. "407 tests / 100% coverage"), otherwise show the phrase plainly
// (e.g. "k-anonymity k>=5 on public data").
function splitMetric(m: string): { value: string; label: string } {
  const match = m.match(/^([~≈]?\d[\d.,]*(?:\s?[kKxX%+])?)\s+(.+)$/);
  if (match) return { value: match[1], label: match[2] };
  return { value: "", label: m };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const specStack =
    project.stack.slice(0, 5).join(" · ") +
    (project.stack.length > 5 ? ` · +${project.stack.length - 5}` : "");

  const liveLink = project.links.find((l) => l.kind === "live");
  const repoLink = project.links.find((l) => l.kind === "repo");
  // The OPEN button opens the demo full-screen when there is one (same as
  // Archgraph), falling back to the live site, then the repo.
  const openUrl = project.embedUrl ?? liveLink?.url ?? repoLink?.url;
  const demoLabel =
    project.demoLabel ??
    (liveLink
      ? liveLink.url.replace(/^https?:\/\//, "").replace(/\/$/, "")
      : "preview");

  const titleWords = project.title.split(" ");

  return (
    <div className="folio-inner proj-page">
      <Link href="/portfolio" className="folio-back">
        <span className="b-arr" aria-hidden>
          ←
        </span>
        index · all work
      </Link>

      <header className="proj-masthead">
        <div className="proj-kicker load-rise" style={{ "--i": 0 } as CSSProperties}>
          <span className="n">¶ {project.num}</span> · {project.tags[0] ?? "Project"}
        </div>
        <h1 className="proj-title">
          {titleWords.map((w, i) => (
            <Fragment key={i}>
              {i > 0 ? " " : ""}
              <span className="rise-word" style={{ "--i": i } as CSSProperties}>
                {w}
              </span>
            </Fragment>
          ))}
        </h1>
        <p
          className="proj-tagline load-rise"
          style={{ "--i": titleWords.length + 1 } as CSSProperties}
        >
          {project.tagline}
        </p>
      </header>

      <div
        className="proj-spec load-rise"
        style={{ "--i": titleWords.length + 2 } as CSSProperties}
      >
        <div className="spec-item">
          <span className="k">Year</span>
          <span className="v">{project.year}</span>
        </div>
        <div className="spec-item">
          <span className="k">Status</span>
          <span className="v">
            <Status status={project.status} />
          </span>
        </div>
        <div className="spec-item">
          <span className="k">Role</span>
          <span className="v">{project.role}</span>
        </div>
        <div className="spec-item">
          <span className="k">Built with</span>
          <span className="v">{specStack}</span>
        </div>
      </div>

      {(project.links.length > 0 || project.embedUrl) && (
        <div
          className="proj-links load-rise"
          style={{ "--i": titleWords.length + 3 } as CSSProperties}
        >
          {project.embedUrl && !liveLink && (
            <a
              href={project.embedUrl}
              className={project.featured ? "proj-btn accent" : "proj-btn primary"}
              target="_blank"
              rel="noreferrer"
            >
              Open live demo
              <span aria-hidden>↗</span>
            </a>
          )}
          {project.links.map((l) => (
            <a
              key={l.url}
              href={l.url}
              className={btnClass(l.kind, project.featured)}
              target="_blank"
              rel="noreferrer"
            >
              {l.label}
              <span aria-hidden>↗</span>
            </a>
          ))}
        </div>
      )}

      <section
        className="proj-preview load-rise"
        style={{ "--i": titleWords.length + 4 } as CSSProperties}
      >
        {project.embedUrl || project.cover || project.video ? (
          <DemoFrame
            label={demoLabel}
            title={project.title}
            embedUrl={project.embedUrl}
            cover={project.cover}
            openUrl={openUrl}
            plain={project.previewKind === "app"}
            video={project.video}
          />
        ) : (
          <PreviewPlate project={project} />
        )}
        <p className="proj-preview-note">
          {project.video
            ? "A recorded walkthrough of the real product."
            : project.embedUrl
            ? "Live demo. Click Run to load the real app and use it right here, or open it full-screen."
            : project.previewKind === "app"
              ? "The desktop app in action."
              : liveLink
                ? "Preview. Click it to open the live app."
                : project.cover
                  ? "Preview."
                  : "Runs as a local app. The full teardown is below."}
        </p>
      </section>

      <div className="proj-body">
        <section className="proj-section folio-reveal">
          <div className="h">
            <span className="n">01</span>Overview
          </div>
          <div className="proj-prose proj-prose--lead">
            {paragraphs(project.summary).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>

        {project.problem && (
          <section className="proj-section folio-reveal">
            <div className="h">
              <span className="n">02</span>The problem
            </div>
            <div className="proj-prose">
              {paragraphs(project.problem).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>
        )}

        {project.highlights.length > 0 && (
          <section className="proj-section folio-reveal">
            <div className="h">
              <span className="n">03</span>Highlights
            </div>
            <ul className="proj-highlights">
              {project.highlights.map((h, i) => (
                <li
                  key={i}
                  className="folio-reveal-item"
                  style={{ "--i": i } as CSSProperties}
                >
                  {h}
                </li>
              ))}
            </ul>
          </section>
        )}

        {project.metrics && project.metrics.length > 0 && (
          <section className="proj-section folio-reveal">
            <div className="h">
              <span className="n">04</span>By the numbers
            </div>
            <div className="proj-metrics">
              {project.metrics.map((m, i) => {
                const { value, label } = splitMetric(m);
                return (
                  <div
                    className="metric folio-reveal-item"
                    key={i}
                    style={{ "--i": i } as CSSProperties}
                  >
                    {value && <div className="m-v">{value}</div>}
                    <div className={value ? "m-k" : "m-k m-k-lg"}>{label}</div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {project.subProjects && project.subProjects.length > 0 && (
          <section className="proj-section folio-reveal">
            <div className="h">
              <span className="n">◆</span>What&apos;s inside
              <span className="h-count">{project.subProjects.length} parts</span>
            </div>
            <ul className="subproj-list">
              {project.subProjects.map((s, i) => (
                <li
                  className="subproj folio-reveal-item"
                  key={s.name}
                  style={{ "--i": i } as CSSProperties}
                >
                  <div className="subproj-head">
                    <code className="subproj-name">{s.name}</code>
                    <span className="subproj-kind">{s.kind}</span>
                  </div>
                  <p className="subproj-one">{s.oneLiner}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="proj-section folio-reveal">
          <div className="h">
            <span className="n">·</span>Tags
          </div>
          <div className="proj-tags">
            {project.tags.map((t) => (
              <Chip key={t} label={t} />
            ))}
          </div>
          {project.stack.length > 0 && (
            <details className="stack-details">
              <summary>
                Full tech stack <span className="stack-count">{project.stack.length}</span>
              </summary>
              <div className="proj-tags proj-tags-stack">
                {project.stack.map((s) => (
                  <Chip key={s} label={s} accent />
                ))}
              </div>
            </details>
          )}
        </section>
      </div>

      <footer className="folio-foot">
        <Link href="/portfolio">← all work</Link>
        <span>
          {project.title} · pg. {project.num} / D
        </span>
      </footer>
    </div>
  );
}
