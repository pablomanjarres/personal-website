import type { Project } from "@/app/projects";
import { selectedWorkSlugs } from "../selected-work";
import { getStudy, getStudyPreview, type StudyAsset } from "../studies/data";

export type FeaturedProject = {
  project: Project;
  href: string;
  problem: string;
  product: string;
  note: string;
  preview: StudyAsset;
};

const notes = {
  vestra: {
    problem: "Guests need a clear path from the mountain view to a planned stay.",
    note: "An alpine retreat with room and date choices close at hand.",
  },
  cortex: {
    problem: "Daily work lives across too many tools.",
    note: "Private records, kept together.",
  },
  nella: {
    problem: "Agents need context about the code they work on.",
    note: "Code search and context for agents.",
  },
  construcredit: {
    problem: "A lender needs dependable balances and a clear approval trail.",
    note: "Business rules belong in the software.",
  },
  aether: {
    problem: "Independent work needs a clear view of income and savings.",
    note: "Invoices, balances, and allocations in one account view.",
  },
} satisfies Record<(typeof selectedWorkSlugs)[number], Pick<FeaturedProject, "problem" | "note">>;

export function getFeaturedProjects(projectHref: (slug: string) => string): readonly FeaturedProject[] {
  return selectedWorkSlugs.map(slug => {
    const study = getStudy(slug);
    if (!study) throw new Error(`Missing featured project: ${slug}`);
    const project = study.project;
    return { ...notes[slug], project, href: projectHref(slug), product: project.oneLiner, preview: getStudyPreview(study) };
  });
}

export const capabilities = [
  { title: "AI products", text: "Agent workflows, retrieval, and tools that keep people in control.", examples: "Noelle / Nella" },
  { title: "Web apps and systems", text: "The interface, APIs, and infrastructure behind a working product.", examples: "ConstruCredit / Cortex" },
  { title: "Developer tools", text: "Software for the people building the next thing.", examples: "Nella / Forge" },
] as const;
