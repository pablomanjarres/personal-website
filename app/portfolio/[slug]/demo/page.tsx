import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject, projects } from "../../../projects";

// Branded, full-screen demo pages at /portfolio/<slug>/demo. Only projects with
// an embeddable live app get one; unknown slugs 404 at build time.
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.filter((p) => p.embedUrl).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Demo — Pablo Manjarres" };
  const title = `${project.title} — live demo`;
  return {
    title,
    description: project.tagline,
    openGraph: {
      title,
      description: project.tagline,
      url: `https://pablomanjarres.com/portfolio/${project.slug}/demo`,
    },
  };
}

export default async function DemoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project || !project.embedUrl) notFound();

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "#0a0a0b",
      }}
    >
      <iframe
        src={project.embedUrl}
        title={`${project.title} live demo`}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          border: 0,
        }}
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-downloads"
      />
      <Link
        href={`/portfolio/projects/${project.slug}`}
        style={{
          position: "fixed",
          top: 12,
          left: 12,
          zIndex: 201,
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "7px 12px",
          borderRadius: 9,
          background: "rgba(10,10,12,0.7)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          color: "#f4f4f6",
          fontSize: 13,
          fontWeight: 600,
          textDecoration: "none",
          border: "1px solid rgba(255,255,255,0.14)",
        }}
      >
        ← {project.title}
      </Link>
    </div>
  );
}
