import { getProject, type Project } from "../../projects";
import { selectedWorkSlugs } from "../selected-work";
import { ankiMobileScreens } from "../anki-media";
import type { ConceptId } from "../concepts";
import { conceptStudyHref } from "../project-studies/directions";

export type FeaturedProject = {
  project: Project;
  href: string;
  problem: string;
  product: string;
  note: string;
  preview: string;
  previewLabel: string;
};

const notes = {
  anki: {
    problem: "Review cards need to match what you’ve actually reached.",
    note: "Cards stay tied to their sources.",
    previewLabel: ankiMobileScreens[0].label,
  },
  construcredit: {
    problem: "A lender needs dependable balances and a clear approval trail.",
    note: "Business rules belong in the software.",
    previewLabel: "Public website",
  },
  cortex: {
    problem: "Daily work lives across too many tools.",
    note: "Private records, kept together.",
    previewLabel: "Desktop dashboard",
  },
} satisfies Record<(typeof selectedWorkSlugs)[number], Pick<FeaturedProject, "problem" | "note" | "previewLabel">>;

export function getFeaturedProjects(concept: ConceptId): readonly FeaturedProject[] {
  return selectedWorkSlugs.map(slug => {
    const project = getProject(slug);
    if (!project?.cover) throw new Error(`Missing featured project preview: ${slug}`);
    return { ...notes[slug], project, href: conceptStudyHref(concept, slug), product: project.oneLiner, preview: slug === "anki" ? ankiMobileScreens[0].src : project.cover };
  });
}

export const capabilities = [
  { title: "AI products", text: "Agent workflows, retrieval, and tools that keep people in control.", examples: "Noelle / Nella" },
  { title: "Web apps and systems", text: "The interface, APIs, and infrastructure behind a working product.", examples: "ConstruCredit / Cortex" },
  { title: "Developer tools", text: "Software for the people building the next thing.", examples: "Nella / Forge" },
] as const;
