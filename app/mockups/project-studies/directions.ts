import type { ConceptId } from "../concepts";
import type { StudyDirectionId } from "./data";

export type StudyDirection = { id: StudyDirectionId; name: string; description: string; paper: string; ink: string; accent: string; motionConcept: ConceptId };
export const studyDirections: readonly StudyDirection[] = [
  { id: "cinema", name: "Product Cinema", description: "Wide screenings. Quiet captions. The product takes the stage.", paper: "#080c15", ink: "#f2f7ff", accent: "#82abff", motionConcept: "after-hours" },
  { id: "gallery", name: "Interface Gallery", description: "Open artboards, generous space, and close looks at the interface.", paper: "#f3f0e8", ink: "#17382d", accent: "#376d50", motionConcept: "green-room" },
  { id: "workbench", name: "Product Workbench", description: "Full screens and small details, laid out for a closer look.", paper: "#f6f5f0", ink: "#252825", accent: "#b64614", motionConcept: "open-studio" },
  { id: "atlas", name: "Product Atlas", description: "A visual route through the products and their details.", paper: "#f7f6ef", ink: "#293acf", accent: "#293acf", motionConcept: "blueprint" },
  { id: "stack", name: "Product Stack", description: "Layered pages that open into the work.", paper: "#f4e9dd", ink: "#40213f", accent: "#8b375c", motionConcept: "soft-focus" },
  { id: "playground", name: "Product Playground", description: "Big visuals and a few things to try.", paper: "#edf2fb", ink: "#152958", accent: "#375cdb", motionConcept: "signal" },
];
export function getStudyDirection(id: string) { return studyDirections.find(direction => direction.id === id); }
