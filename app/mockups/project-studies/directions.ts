import { workbenchTheme } from "@/app/site/theme";
import type { ConceptId } from "../concepts";
import { studyHref, type StudyDirectionId } from "./data";

export type StudyDirection = { id: StudyDirectionId; name: string; description: string; paper: string; ink: string; accent: string; motionConcept: ConceptId };
export const studyDirections: readonly StudyDirection[] = [
  { id: "cinema", name: "Product Cinema", description: "Wide screenings. Quiet captions. The product takes the stage.", paper: "#05090e", ink: "#e5eef5", accent: "#1d45de", motionConcept: "after-hours" },
  { id: "gallery", name: "Interface Gallery", description: "Open artboards, generous space, and close looks at the interface.", paper: "#f6f6f1", ink: "#20362b", accent: "#204c3b", motionConcept: "green-room" },
  { id: "workbench", name: "Product Workbench", description: "Full screens and small details, laid out for a closer look.", paper: workbenchTheme.paper, ink: workbenchTheme.ink, accent: workbenchTheme.accent, motionConcept: "open-studio" },
  { id: "atlas", name: "Product Atlas", description: "A visual route through the products and their details.", paper: "#f0f0e8", ink: "#182235", accent: "#263acb", motionConcept: "blueprint" },
  { id: "stack", name: "Product Stack", description: "Layered pages that open into the work.", paper: "#38213f", ink: "#fff7ef", accent: "#f4bf9d", motionConcept: "soft-focus" },
  { id: "playground", name: "Product Playground", description: "Big visuals and a few things to try.", paper: "#edf2fb", ink: "#152958", accent: "#294ee8", motionConcept: "signal" },
];
export function getStudyDirection(id: string) { return studyDirections.find(direction => direction.id === id); }

export function conceptStudyHref(concept: ConceptId, slug?: string) {
  const direction = studyDirections.find(direction => direction.motionConcept === concept);
  if (!direction) throw new Error(`Missing project direction for homepage: ${concept}`);
  return studyHref(direction.id, slug);
}
