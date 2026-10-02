export const concepts = [
  { id: "signal", number: "01", name: "Signal", description: "An organic forest portrait, curved details, and alternating project panels.", portrait: "forest", paper: "#eef0e9", ink: "#19382c", accent: "#2a583d", panel: "#dde4d6" },
  { id: "open-studio", number: "02", name: "Open Studio", description: "A mint orbital composition with floating roles and soft project tiles.", portrait: "teal", paper: "#f5f7f3", ink: "#183d39", accent: "#146e65", panel: "#dceae5" },
  { id: "blueprint", number: "03", name: "Blueprint", description: "A blue product lab where a real app assembles in the hero.", portrait: "denim", paper: "#edf2f8", ink: "#10283e", accent: "#204faf", panel: "#dce6f2" },
  { id: "after-hours", number: "04", name: "After Hours", description: "A curved graphite stage, moving light, and a horizontal project reel.", portrait: "hoodie", paper: "#17191b", ink: "#f1f2ed", accent: "#bfd6d0", panel: "#23282b" },
  { id: "green-room", number: "05", name: "Green Room", description: "A forest landscape with flowing contours and layered project chapters.", portrait: "forest", paper: "#f0f2e9", ink: "#183429", accent: "#355741", panel: "#dfe6d7" },
  { id: "soft-focus", number: "06", name: "Soft Focus", description: "A sea-green journal with photo papers, drawn paths, and project notes.", portrait: "teal", paper: "#f0f2ef", ink: "#263b39", accent: "#426f67", panel: "#dce5df" },
] as const;

export type Concept = (typeof concepts)[number];
export type ConceptId = Concept["id"];
export type WorkLayout = "stack" | "bento" | "browser" | "reel" | "chapters" | "journal";
