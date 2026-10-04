import { projects, type Project } from "@/app/projects";
import { selectedWorkSlugs } from "@/app/portfolio/selected-work";
import { ankiMobileScreens } from "@/app/portfolio/anki-media";

type StudyAssetBase = { id: string; alt: string; label: string; width: number; height: number };
export type StudyAsset = StudyAssetBase & ({ kind: "screen" | "presentation" | "video"; src: string; poster?: string } | { kind: "unavailable"; src?: never; poster?: never });
export type ProjectStudy = { project: Project; caption: string; media: readonly StudyAsset[] };

const presentations: Readonly<Record<string, readonly StudyAsset[]>> = {
  anki: [
    { id: "anki-presentation", kind: "presentation", src: "/portfolio/presentations/anki-paired.webp", width: 4000, height: 3000, alt: "Anki home and calculus review screens in two iPhones on stone", label: "Home and review on mobile" },
    { id: "anki-review-presentation", kind: "presentation", src: "/portfolio/presentations/anki-review.webp", width: 4000, height: 3000, alt: "Anki calculus review with a tangent graph on an angled iPhone", label: "A review card tied to its source" },
  ],
  cortex: [
    { id: "cortex-presentation", kind: "presentation", src: "/portfolio/presentations/cortex-dashboard.webp", width: 4500, height: 3000, alt: "Cortex daily dashboard on a laptop resting on a green chair", label: "Daily workspace on desktop" },
    { id: "cortex-study-presentation", kind: "presentation", src: "/portfolio/presentations/cortex-study.webp", width: 4000, height: 3000, alt: "Cortex student workspace on a laptop beside its mobile finance view", label: "Study on desktop, finances on mobile" },
  ],
  construcredit: [
    { id: "construcredit-presentation", kind: "presentation", src: "/portfolio/presentations/construcredit-workspace.webp", width: 4000, height: 3000, alt: "ConstruCredit client portfolio on a laptop beside its mobile administration view", label: "Lending on desktop and mobile" },
    { id: "construcredit-dashboard-presentation", kind: "presentation", src: "/portfolio/presentations/construcredit-dashboard.webp", width: 4500, height: 3000, alt: "ConstruCredit loan dashboard on a laptop resting on a green chair", label: "The lending dashboard" },
  ],
};

const sizes: Record<string, readonly [number, number]> = {
  agentbar: [1600, 814], "band-of-agents": [1280, 800], "content-pipeline": [1684, 1170], "study-hub": [1600, 1000], "grit-x-awa": [1600, 1000], redline: [1280, 800], cortex: [1440, 1000], omegahack: [1280, 800], "localhost-mirror": [1200, 860], "lumen-frontier": [1600, 1000], noelle: [1280, 800], construcredit: [1200, 750], forge: [1423, 942], valhalla: [2480, 1296], archgraph: [1280, 800], nella: [1265, 791], portpeek: [1120, 700], lumen: [1120, 700],
};

function mediaFor(project: Project): readonly StudyAsset[] {
  const presentation = presentations[project.slug] ?? [];
  if (project.slug === "anki") return [...presentation, ...ankiMobileScreens];
  if (project.slug === "alfred") return [{ id: "alfred-preview", alt: "Alfred CLI tool", label: "CLI tool", kind: "unavailable", width: 700, height: 393 }];
  if (!project.cover) throw new Error(`Missing project media: ${project.slug}`);
  const [width, height] = sizes[project.slug] ?? [1280, 800];
  const label = project.slug === "cortex" ? "Desktop dashboard" : ["noelle", "construcredit", "nella"].includes(project.slug) ? "Public website" : "Project preview";
  const src = project.cover;
  const media: StudyAsset[] = [...presentation, { id: `${project.slug}-preview`, src, alt: `${project.title}: ${label.toLowerCase()}`, label, kind: "screen", width, height }];
  if (project.video) media.push({ id: `${project.slug}-walkthrough`, src: project.video, poster: src, alt: `${project.title} animated product introduction`, label: "Product animation", kind: "video", width: 1920, height: 1080 });
  return media;
}

export const studies: readonly ProjectStudy[] = [...projects].sort((a, b) => {
  const rank = (slug: string) => { const i = selectedWorkSlugs.findIndex(selected => selected === slug); return i < 0 ? selectedWorkSlugs.length : i; };
  return rank(a.slug) - rank(b.slug);
}).map(project => ({ project, caption: project.oneLiner, media: mediaFor(project) }));

export function getStudy(slug: string) { return studies.find(study => study.project.slug === slug); }

export function getStudyPreview(study: ProjectStudy): StudyAsset {
  return study.media.find(asset => asset.kind !== "video") ?? study.media[0];
}

export function getStudySupportingMedia(study: ProjectStudy): StudyAsset | undefined {
  const preview = getStudyPreview(study);
  if (preview.kind === "presentation") return study.media.find(asset => asset.kind === "presentation" && asset.id !== preview.id);
  return study.media.find(asset => asset.kind === "screen" && asset.id !== preview.id);
}
