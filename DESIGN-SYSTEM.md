# Personal site mockups

Six independent portfolio directions for hiring Pablo as a Software Engineer, Product Designer, and Founder. His name stays small. Real project screenshots show the work. Review the prototypes at `/mockups` before selecting the production redesign.

## Ownership

- `app/mockups/concepts.ts` owns each palette and description. Shared CSS variables carry those tokens through the page.
- `app/mockups/designs/` owns six hero compositions and their art. Each has a different silhouette, entrance, detail, and project layout.
- `shared.tsx` owns the shell, navigation, portraits, roles, and action links. `work.tsx` presents canonical projects as stack, bento, browser, reel, chapters, or journal layouts. `sections.tsx` composes about and contact variants. Each owner has one stylesheet.
- `motion.tsx` owns motion preference, Pause, Replay, pointer depth, and scroll reveals. It uses one observer and bounded animation frames, cleans up on exit, and reacts to reduced-motion changes. Designer CSS preserves animation declarations while paused. Static content remains readable.
- `app/projects.ts` owns project facts, `app/socials.ts` owns roles and contact details, and the portfolio `Status` component owns status labels. Four projects are featured; a native disclosure exposes the full registry without per-project requests.

Reuse the fonts from `app/layout.tsx` and the existing site tokens. Use the approved forest, teal, denim, and gray hoodie portraits. Visible copy uses the human-writing check. Verify all six layouts on desktop and phone, project links, keyboard focus, motion controls, and reduced motion after a shared change.
