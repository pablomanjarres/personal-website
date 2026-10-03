export const ankiMobileScreens = [
  { id: "anki-home", src: "/images/anki/home.png?v=mobile-edge-1", width: 430, height: 976, alt: "Anki home with today's review queue and cloud illustration", label: "Anki home", kind: "screen" },
  { id: "anki-review", src: "/images/anki/review.png?v=mobile-edge-1", width: 430, height: 976, alt: "Anki review card tied to a book source", label: "Review card", kind: "screen" },
] as const;

export const ankiAppMockup = {
  src: "/images/anki/paired-phones.webp?v=paired-export-2",
  width: 1450,
  height: 2000,
  alt: "Anki home and review screens in two iPhones",
} as const;
