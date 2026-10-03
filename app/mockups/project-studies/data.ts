import { projects, type Project } from "../../projects";
import { selectedWorkSlugs } from "../selected-work";
import { ankiMobileScreens } from "../anki-media";

export type StudyDirectionId = "cinema" | "gallery" | "workbench" | "atlas" | "stack" | "playground";
type StudyAssetBase = { id: string; alt: string; label: string; width: number; height: number };
export type StudyAsset = StudyAssetBase & ({ kind: "screen" | "video"; src: string; poster?: string } | { kind: "unavailable"; src?: never; poster?: never });
export type ProjectStudy = { project: Project; caption: string; media: readonly StudyAsset[] };

const sizes: Record<string, readonly [number, number]> = {
  agentbar: [1600, 814], "band-of-agents": [1280, 800], "content-pipeline": [1684, 1170], "study-hub": [1600, 1000], "grit-x-awa": [1600, 1000], redline: [1280, 800], cortex: [1440, 1000], omegahack: [1280, 800], "localhost-mirror": [1200, 860], "lumen-frontier": [1600, 1000], noelle: [1280, 800], construcredit: [1200, 750], forge: [1423, 942], valhalla: [2480, 1296], archgraph: [1280, 800], nella: [1280, 800], portpeek: [1120, 700], lumen: [1120, 700],
};

function mediaFor(project: Project): readonly StudyAsset[] {
  if (project.slug === "anki") return ankiMobileScreens;
  if (project.slug === "alfred") return [{ id: "alfred-preview", alt: "Alfred CLI tool", label: "CLI tool", kind: "unavailable", width: 700, height: 393 }];
  if (!project.cover) throw new Error(`Missing project media: ${project.slug}`);
  const [width, height] = sizes[project.slug] ?? [1280, 800];
  const label = project.slug === "cortex" ? "Desktop dashboard" : ["noelle", "construcredit", "nella"].includes(project.slug) ? "Public website" : "Project preview";
  const src = project.cover;
  const media: StudyAsset[] = [{ id: `${project.slug}-preview`, src, alt: `${project.title}: ${label.toLowerCase()}`, label, kind: "screen", width, height }];
  if (project.video) media.push({ id: `${project.slug}-walkthrough`, src: project.video, poster: src, alt: `${project.title} animated product introduction`, label: "Product animation", kind: "video", width: 1920, height: 1080 });
  return media;
}

export const studies: readonly ProjectStudy[] = [...projects].sort((a, b) => {
  const rank = (slug: string) => { const i = selectedWorkSlugs.findIndex(selected => selected === slug); return i < 0 ? selectedWorkSlugs.length : i; };
  return rank(a.slug) - rank(b.slug);
}).map(project => ({ project, caption: project.oneLiner, media: mediaFor(project) }));

export function studyHref(direction: StudyDirectionId, slug?: string) { return `/mockups/projects/${direction}${slug ? `/${slug}` : ""}`; }
export function getStudy(slug: string) { return studies.find(study => study.project.slug === slug); }

export function getStudyPreview(study: ProjectStudy): StudyAsset {
  return study.media.find(asset => asset.kind !== "video") ?? study.media[0];
}
