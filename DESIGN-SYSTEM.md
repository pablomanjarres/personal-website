# Personal site mockups

Six original portfolio directions for people hiring Pablo as a Software Engineer, Product Designer, and Founder. The headline explains his work, the portrait carries the identity, and real product screenshots carry the proof. His name is a small signature. These are review prototypes at `/mockups`; the production homepage is unchanged until a direction is selected.

- Each direction has one palette record in `app/mockups/concepts.ts`, exposed as shared CSS variables. Hero-specific palettes live with the corresponding design.
- Reuse the existing Next font owners: Archivo Black, Big Shoulders, and Hanken Grotesk for display; IBM Plex Sans for body; Instrument Serif for personal notes.
- Each design composes a distinct hero and one shared work layout, followed by shared about and contact sections. Work is on the main mockup page.
- Shared controls, focus, hover, spacing, image presentation, and responsive states live in `app/mockups/mockups.module.css`. Reduced motion is static.
- Only the approved forest, lighter teal, denim jacket, and gray hoodie portraits are used. The bright hoodie is excluded.

## Ownership

`app/theme.ts`, `app/globals.css`, and `app/layout.tsx` retain the site tokens, resets, and fonts. `app/mockups/shared.tsx` owns prototype navigation, controls, portraits, work, about, and contact presentation. `app/mockups/designs/` owns the six heroes and their composition. Route pages compose these components; the comparison gallery has its own small review stylesheet.

`app/projects.ts` remains the single project registry, `app/socials.ts` owns contact data, and the existing portfolio `Status` component owns status labels. Four selected projects are featured; the native disclosure exposes all projects without per-project requests. Existing homepage, case-study, and demo routes stay intact.
