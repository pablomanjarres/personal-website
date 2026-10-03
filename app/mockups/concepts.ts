import { openStudioTheme } from "@/app/site/theme";

export const concepts = [
  { id: "signal", number: "01", name: "Signal", description: "Open product spreads on warm chalk, a wine profile section, and a direct invitation.", portrait: "forest", paper: "#eef0e9", ink: "#19382c", accent: "#2a583d", panel: "#dde4d6" },
  { ...openStudioTheme, number: "02", name: "Open Studio", description: "A green project collage, petrol practice section, and apricot contact ticket.", portrait: "forest" },
  { id: "blueprint", number: "03", name: "Blueprint", description: "Cobalt laptop studies, layered product responsibilities, and a calendar desk.", portrait: "denim", paper: "#edf2f8", ink: "#10283e", accent: "#204faf", panel: "#dce6f2" },
  { id: "after-hours", number: "04", name: "After Hours", description: "Product screenings, spotlighted roles, and a cinematic invitation to talk.", portrait: "hoodie", paper: "#17191b", ink: "#f1f2ed", accent: "#bfd6d0", panel: "#23282b" },
  { id: "green-room", number: "05", name: "Green Room", description: "Forest project plots, skills on sand, and a curved invitation to work together.", portrait: "forest", paper: "#f0f2e9", ink: "#183429", accent: "#355741", panel: "#dfe6d7" },
  { id: "soft-focus", number: "06", name: "Soft Focus", description: "A rose and blue folio, a personal letter, and an open postcard.", portrait: "teal", paper: "#f0f2ef", ink: "#263b39", accent: "#426f67", panel: "#dce5df" },
] as const;

export type Concept = (typeof concepts)[number];
export type ConceptId = Concept["id"];
