export const ankiMobileScreens = [
  { id: "anki-mobile-home", src: "/mockups/anki-mobile/home.png", width: 415, height: 942, alt: "Anki mobile interface study with a daily review queue", label: "Mobile interface study", kind: "screen" },
  { id: "anki-mobile-review", src: "/mockups/anki-mobile/review.png", width: 430, height: 976, alt: "Anki mobile review study with a cited card and five grades", label: "Mobile review study", kind: "screen" },
] as const;

export const ankiInterfaceStudyScreens = [
  { id: "anki-study-home", src: "/mockups/anki-study/home.png", width: 860, height: 1952, alt: "Anki mobile interface study with daily reviews and courses" },
  { id: "anki-study-review", src: "/mockups/anki-study/review.png", width: 860, height: 1952, alt: "Anki mobile interface study with a source-linked review card" },
] as const;
