import type { Project } from "@/app/projects";
import type { CaseStudy } from "@/app/portfolio/studies/case-study";
import type {
  StudyAsset,
  StudyInterfaceView,
} from "@/app/portfolio/studies/data";
import type { WebsiteStudyRecord } from "./types";
import mediaDimensions from "./media-dimensions.json";

const site = "https://pablomanjarres.github.io/twenty-web-studies";
const repository = "https://github.com/pablomanjarres/twenty-web-studies";
const role = "Brand identity and frontend design";

export function buildProject(
  record: WebsiteStudyRecord,
  number: number,
): Project {
  return {
    slug: record.slug,
    num: String(number).padStart(2, "0"),
    title: record.title,
    tagline: record.tagline,
    oneLiner: record.oneLiner,
    year: "2026",
    status: "live",
    role,
    tags: [...new Set(record.tags)],
    stack: ["React 19", "TypeScript", "Vite", "CSS"],
    summary: `${record.summary}\n\n${record.outcome}`,
    problem: record.challenge,
    highlights: record.decisions.map(([title, body]) => `${title}. ${body}`),
    links: [
      { label: "Live website", url: `${site}/${record.slug}/`, kind: "live" },
      {
        label: "Brand kit",
        url: `${site}/${record.slug}/brand/`,
        kind: "docs",
      },
      { label: "GitHub", url: repository, kind: "repo" },
    ],
    cover: `/portfolio/web-studies/${record.slug}/desktop.webp`,
    identity: {
      src: `/portfolio/web-studies/${record.slug}/logo.svg`,
      width: 40,
      height: 40,
    },
    accent: record.accent,
  };
}

export function buildCaseStudy(record: WebsiteStudyRecord): CaseStudy {
  return {
    headline: record.oneLiner,
    introduction: record.summary,
    challenge: record.challenge,
    responsibility: role,
    outcome: record.outcome,
    platform: "Responsive website",
    decisions: record.decisions.map(([title, body]) => ({ title, body })),
    flow: record.flow.map((title) => ({ title, body: "" })),
    measures: [],
    components: [],
  };
}

function buildDesktop(record: WebsiteStudyRecord): StudyInterfaceView["asset"] {
  return {
    id: `${record.slug}-desktop`,
    kind: "screen",
    src: `/portfolio/web-studies/${record.slug}/desktop.webp`,
    width: record.screenSizes?.desktop?.[0] ?? 3200,
    height: record.screenSizes?.desktop?.[1] ?? 1982,
    alt: `${record.title} desktop website: ${record.oneLiner}`,
    label: "Desktop website",
  };
}

export function buildMedia(record: WebsiteStudyRecord): readonly StudyAsset[] {
  const path = `/portfolio/web-studies/${record.slug}`;
  const product =
    mediaDimensions[record.slug as keyof typeof mediaDimensions]?.product;
  if (!product || product.length !== 2) {
    throw new Error(`Missing physical product dimensions: ${record.slug}`);
  }
  return [
    {
      id: `${record.slug}-presentation`,
      kind: "presentation",
      src: `${path}/presentation.webp`,
      width: 1600,
      height: 1200,
      alt: `${record.title} website and interaction detail in a layered presentation`,
      label: `${record.category} presentation`,
    },
    buildDesktop(record),
    {
      id: `${record.slug}-mobile`,
      kind: "screen",
      src: `${path}/mobile.webp`,
      width: record.screenSizes?.mobile?.[0] ?? 880,
      height: record.screenSizes?.mobile?.[1] ?? 1896,
      alt: `${record.title} phone layout: ${record.oneLiner}`,
      label: "Phone layout",
    },
    {
      id: `${record.slug}-product`,
      kind: "presentation",
      src: `${path}/product.webp`,
      width: product[0],
      height: product[1],
      alt: `${record.title} website in a physical product mockup`,
      label: "Physical product mockup",
    },
  ];
}

export function buildInterfaceViews(
  record: WebsiteStudyRecord,
): readonly StudyInterfaceView[] {
  return [{ asset: buildDesktop(record), description: record.decisions[0][1] }];
}
