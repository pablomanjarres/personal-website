import { projects, type Project } from "../../projects";

export type StudyDirectionId = "cinema" | "gallery" | "workbench" | "atlas" | "stack" | "playground";
export type StudyAsset = { id: string; src: string; alt: string; label: string; kind: "screen" | "artwork" | "video"; poster?: string; width: number; height: number };
export type ProjectStudy = { project: Project; caption: string; media: readonly StudyAsset[] };

const sizes: Record<string, readonly [number, number]> = {
  agentbar: [1600, 814], "band-of-agents": [1280, 800], "content-pipeline": [1684, 1170], "study-hub": [1600, 1000], "grit-x-awa": [1600, 1000], alfred: [700, 393], redline: [1280, 800], cortex: [1440, 1000], anki: [1440, 1000], omegahack: [1280, 800], "localhost-mirror": [1200, 860], "lumen-frontier": [1600, 1000], noelle: [1280, 800], construcredit: [1200, 750], forge: [1423, 942], valhalla: [2480, 1296], archgraph: [1280, 800], nella: [1200, 630], portpeek: [1120, 700], lumen: [1120, 700],
};
const featuredSlugs = ["noelle", "construcredit", "nella", "cortex"];

function mediaFor(project: Project): readonly StudyAsset[] {
  if (!project.cover) throw new Error(`Missing project media: ${project.slug}`);
  const [width, height] = sizes[project.slug] ?? [1280, 800];
  const label = project.slug === "nella" ? "Product illustration" : project.slug === "cortex" ? "Desktop dashboard" : ["noelle", "construcredit"].includes(project.slug) ? "Public website" : "Project preview";
  const src = project.slug === "nella" ? "/portfolio/covers/nella.png" : project.cover;
  const media: StudyAsset[] = [{ id: `${project.slug}-preview`, src, alt: `${project.title}: ${label.toLowerCase()}`, label, kind: project.slug === "nella" ? "artwork" : "screen", width, height }];
  if (project.video) media.push({ id: `${project.slug}-walkthrough`, src: project.video, poster: src, alt: `${project.title} animated product introduction`, label: "Product animation", kind: "video", width: 1280, height: 800 });
  return media;
}

export const studies: readonly ProjectStudy[] = [...projects].sort((a, b) => {
  const rank = (slug: string) => { const i = featuredSlugs.indexOf(slug); return i < 0 ? featuredSlugs.length : i; };
  return rank(a.slug) - rank(b.slug);
}).map(project => ({ project, caption: project.oneLiner, media: mediaFor(project) }));

export function studyHref(direction: StudyDirectionId, slug?: string) { return `/mockups/projects/${direction}${slug ? `/${slug}` : ""}`; }
export function getStudy(slug: string) { return studies.find(study => study.project.slug === slug); }
export function nextStudy(slug: string) { const i = studies.findIndex(study => study.project.slug === slug); return studies[(i + 1) % studies.length]; }
