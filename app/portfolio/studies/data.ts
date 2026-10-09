import { projects, type Project } from "@/app/projects";
import { selectedWorkSlugs } from "@/app/portfolio/selected-work";
import { ankiMobileScreens } from "@/app/portfolio/anki-media";
import { getWebsiteInterfaceViews, getWebsiteMedia, isWebsiteStudy } from "@/app/portfolio/web-studies/catalog";

type StudyAssetBase = { id: string; alt: string; label: string; width: number; height: number };
export type StudyAsset = StudyAssetBase & ({ kind: "screen" | "presentation" | "video"; src: string; poster?: string } | { kind: "unavailable"; src?: never; poster?: never });
export type ProjectStudy = { project: Project; caption: string; media: readonly StudyAsset[] };
export type StudyInterfaceView = { asset: StudyAsset & { kind: "screen"; src: string }; description: string };

const presentations: Readonly<Record<string, readonly StudyAsset[]>> = {
  lumen: [
    { id: "lumen-presentation", kind: "presentation", src: "/portfolio/presentations/lumen-tutor-device.webp", width: 3200, height: 2400, alt: "Lumen Tutor calculus whiteboard on a laptop beside its phone interface", label: "Calculus on desktop and mobile" },
  ],
  portpeek: [
    { id: "portpeek-presentation", kind: "presentation", src: "/portfolio/presentations/portpeek-device.webp", width: 3200, height: 2400, alt: "PortPeek local service list on a laptop beside its phone interface", label: "Local services on desktop and mobile" },
  ],
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

const interfaceViews: Readonly<Record<string, readonly StudyInterfaceView[]>> = {
  construcredit: [
    {
      asset: { id: "construcredit-client-portfolio", kind: "screen", src: "/portfolio/interfaces/construcredit-client-portfolio.webp", width: 3200, height: 2000, alt: "ConstruCredit staff interface showing client balances, credit lines, and arrears with demonstration records", label: "Client portfolio" },
      description: "Staff can filter clients by credit line, advisor, and status, then inspect balances and days overdue.",
    },
    {
      asset: { id: "construcredit-collections", kind: "screen", src: "/portfolio/interfaces/construcredit-collections.webp", width: 3200, height: 2000, alt: "ConstruCredit payments interface with the overdue collections queue selected and demonstration loans", label: "Collections queue" },
      description: "Upcoming installments, late payments, and overdue credit have separate queues for follow-up.",
    },
  ],
  cortex: [
    {
      asset: { id: "cortex-home-focus", kind: "screen", src: "/portfolio/interfaces/cortex-home-focus.webp", width: 3200, height: 2000, alt: "Cortex desktop interface in charcoal and teal with a running focus session, weekly rhythm, and upcoming work", label: "Daily workspace" },
      description: "A focus session sits alongside the week’s rhythm, habits, assignments, and calendar.",
    },
    {
      asset: { id: "cortex-student-overview", kind: "screen", src: "/portfolio/interfaces/cortex-student-overview.webp", width: 1600, height: 1000, alt: "Cortex student interface in pale green showing the next assignment and course progress with demonstration coursework", label: "Student workspace" },
      description: "The next deadline and course progress share a view with the study workflow.",
    },
  ],
};

const sizes: Record<string, readonly [number, number]> = {
  agentbar: [1600, 814], "band-of-agents": [1280, 800], "content-pipeline": [1684, 1170], "study-hub": [1600, 1000], "grit-x-awa": [1600, 1000], redline: [1280, 800], omegahack: [1280, 800], "localhost-mirror": [1200, 860], "lumen-frontier": [1600, 1000], noelle: [1280, 800], forge: [1423, 942], valhalla: [2480, 1296], archgraph: [1280, 800], nella: [1265, 791], portpeek: [1120, 700], lumen: [1120, 700],
};

function mediaFor(project: Project): readonly StudyAsset[] {
  const website = getWebsiteMedia(project.slug);
  if (website) return website;
  const presentation = presentations[project.slug] ?? [];
  if (project.slug === "anki") return [...presentation, ...ankiMobileScreens];
  const views = interfaceViews[project.slug];
  if (views) return [...presentation, ...views.map(view => view.asset)];
  if (project.slug === "alfred") return [{ id: "alfred-preview", alt: "Alfred CLI tool", label: "CLI tool", kind: "unavailable", width: 700, height: 393 }];
  if (!project.cover) throw new Error(`Missing project media: ${project.slug}`);
  const [width, height] = sizes[project.slug] ?? [1280, 800];
  const label = ["noelle", "nella"].includes(project.slug) ? "Public website" : "Project preview";
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

export function getStudyInterfaceViews(study: ProjectStudy): readonly StudyInterfaceView[] {
  return getWebsiteInterfaceViews(study.project.slug) ?? interfaceViews[study.project.slug] ?? [];
}

export function getStudyPreview(study: ProjectStudy): StudyAsset {
  return study.media.find(asset => asset.kind !== "video") ?? study.media[0];
}

export function getStudySupportingMedia(study: ProjectStudy): StudyAsset | undefined {
  if (isWebsiteStudy(study.project.slug)) return study.media.find(asset => asset.kind === "screen" && asset.width < asset.height);
  const preview = getStudyPreview(study);
  if (preview.kind === "presentation") return study.media.find(asset => asset.kind === "presentation" && asset.id !== preview.id) ?? study.media.find(asset => asset.kind === "screen" && asset.width < asset.height) ?? study.media.find(asset => asset.kind === "screen");
  return study.media.find(asset => asset.kind === "screen" && asset.id !== preview.id);
}
