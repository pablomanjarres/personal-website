import { getProject, type Project } from "../../projects";

export type FeaturedProject = {
  project: Project;
  problem: string;
  product: string;
  note: string;
  preview: string;
  previewLabel: string;
  artwork?: string;
};

const notes = [
  { slug: "noelle", problem: "Audience research and drafting take time.", product: "AI agents research people and queue drafts for human approval.", note: "Approval stays with the person.", artwork: "/oss/noelle.png" },
  { slug: "construcredit", problem: "A lender needs dependable balances and a clear approval trail.", product: "Applications, client records, payments, and staff tools for a Colombian lender.", note: "Business rules belong in the software." },
  { slug: "nella", problem: "Coding agents need the actual code and earlier decisions.", product: "Code search, persistent memory, and coordination through MCP and a CLI.", note: "Context should come from the code.", artwork: "/oss/nella.png" },
  { slug: "cortex", problem: "Daily work lives across too many tools.", product: "An encrypted desktop dashboard for focus, habits, coursework, and finances.", note: "Private records, kept together." },
] as const;

export const featuredProjects: readonly FeaturedProject[] = notes.map(note => {
  const project = getProject(note.slug);
  if (!project?.cover) throw new Error(`Missing featured project preview: ${note.slug}`);
  return {
    ...note, project,
    preview: project.slug === "nella" ? "/portfolio/covers/nella.png" : project.cover,
    previewLabel: project.slug === "nella" ? "Product illustration" : project.slug === "cortex" ? "Desktop dashboard" : "Public website",
  };
});

export const capabilities = [
  { title: "AI products", text: "Agent workflows, retrieval, and tools that keep people in control.", examples: "Noelle / Nella" },
  { title: "Web apps and systems", text: "The interface, APIs, and infrastructure behind a working product.", examples: "ConstruCredit / Cortex" },
  { title: "Developer tools", text: "Software for the people building the next thing.", examples: "Nella / Forge" },
] as const;
