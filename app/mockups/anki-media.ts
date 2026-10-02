export const ankiMobileScreens = [
  { id: "anki-home", src: "/mockups/anki-app/home.png", width: 1179, height: 2556, alt: "Anki home with today's review queue and cloud illustration", label: "Anki home", kind: "screen" },
  { id: "anki-review", src: "/mockups/anki-app/review.png", width: 1179, height: 2556, alt: "Anki review card tied to a book source", label: "Review card", kind: "screen" },
] as const;

export const ankiAppMockup = {
  src: "/mockups/anki-app/paired-phones.webp",
  width: 1450,
  height: 2000,
  alt: "Anki home and review screens in two iPhones",
} as const;
