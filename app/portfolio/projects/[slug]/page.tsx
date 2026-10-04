import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStudy, getStudyPreview, studies } from "@/app/portfolio/studies/data";
import { getCaseStudy } from "@/app/portfolio/studies/case-study";
import { demoHref, portfolioHref, projectHref } from "@/app/portfolio/routes";
import { WorkbenchDetail } from "@/app/portfolio/workbench/Workbench";
import { PortfolioShell } from "@/app/portfolio/workbench/PortfolioShell";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;

export function generateStaticParams() {
  return studies.map(({ project }) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = getStudy(slug);
  if (!study) notFound();
  const title = `${study.project.title} | Pablo Manjarres`;
  const description = getCaseStudy(study).headline;
  const preview = getStudyPreview(study);
  const images = preview.kind === "presentation" ? [{
    url: `/_next/image?url=${encodeURIComponent(preview.src)}&w=1200&q=75`,
    width: 1200, height: Math.round(1200 * preview.height / preview.width), alt: preview.alt,
  }] : [`/og/${slug}.png`];
  return {
    title,
    description,
    alternates: { canonical: projectHref(slug) },
    robots: { index: true, follow: true },
    openGraph: { title, description, url: projectHref(slug), type: "article", images },
    twitter: { card: "summary_large_image", title, description, images },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const study = getStudy(slug);
  if (!study) notFound();
  return <PortfolioShell><WorkbenchDetail study={study} indexHref={portfolioHref} demoHref={demoHref(slug)} /></PortfolioShell>;
}
