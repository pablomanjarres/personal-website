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
      ...(project.cover ? { images: [project.cover] } : {}),
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
  const openUrl = liveLink?.url ?? repoLink?.url;
  const demoLabel =
    project.demoLabel ??
    (liveLink
      ? liveLink.url.replace(/^https?:\/\//, "").replace(/\/$/, "")
      : "preview");

  return (
    <div className="folio-inner">
      <Link href="/portfolio" className="folio-back">
        <span className="b-arr" aria-hidden>
          ←
        </span>
        index · all work
      </Link>

      <div className="proj-kicker">
        <span className="n">¶ {project.num}</span> · {project.tags[0] ?? "Project"}
      </div>
      <h1 className="proj-title">{project.title}</h1>
      <p className="proj-tagline">{project.tagline}</p>

      <div className="proj-spec">
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

      {project.links.length > 0 && (
        <div className="proj-links">
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

      <section className="proj-preview">
        {project.embedUrl || project.cover ? (
          <DemoFrame
            label={demoLabel}
            title={project.title}
            embedUrl={project.embedUrl}
            cover={project.cover}
            openUrl={openUrl}
            plain={project.previewKind === "app"}
          />
        ) : (
          <PreviewPlate project={project} />
        )}
        <p className="proj-preview-note">
          {project.embedUrl
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
        <section className="proj-section">
          <div className="h">
            <span className="n">01</span>Overview
          </div>
          <div className="proj-prose">
            {paragraphs(project.summary).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>

        {project.problem && (
          <section className="proj-section">
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
          <section className="proj-section">
            <div className="h">
              <span className="n">03</span>Highlights
            </div>
            <ul className="proj-highlights">
              {project.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </section>
        )}

        {project.metrics && project.metrics.length > 0 && (
          <section className="proj-section">
            <div className="h">
              <span className="n">04</span>By the numbers
            </div>
            <div className="proj-metrics">
              {project.metrics.map((m, i) => {
                const { value, label } = splitMetric(m);
                return (
                  <div className="metric" key={i}>
                    {value && <div className="m-v">{value}</div>}
                    <div className={value ? "m-k" : "m-k m-k-lg"}>{label}</div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <section className="proj-section">
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
