# Personal site mockups

Six portfolio directions for hiring Pablo as a Software Engineer, Product Designer, and Founder. Each page presents the same real projects through its own composition, palette, and contact section. Review the full pages at `/mockups` before choosing a direction.

## Ownership

- `app/mockups/concepts.ts` owns gallery descriptions and approved hero palettes. The six components in `designs/` compose their approved hero and matching body.
- `app/mockups/bodies/*Body.tsx` owns each concept’s work, about, and contact presentation. Matching CSS modules own local body palettes, typography, and geometry. Keep presentation choices within that concept.
- `app/mockups/bodies/content.ts` owns featured project briefs, preview sources and labels, and shared capability copy. It resolves project facts from `app/projects.ts`.
- `app/mockups/bodies/primitives.tsx` owns homepage project images and links, the full archive, email and booking links, and footer links. `app/mockups/interaction.module.css` owns focus and minimum action height across homepage and project explorations.
- `app/mockups/shared.tsx` owns the shell, navigation, approved portraits, roles, and hero action links. `mockups.module.css` owns their styles.
- `app/mockups/motion.tsx` owns motion preference, Pause, Replay, pointer depth, and scroll reveals. One observer and bounded animation frames handle shared behavior. `motion.module.css` owns pause and reduced motion states.
- `app/projects.ts` owns project facts, `app/socials.ts` owns roles and contact details, and `app/portfolio/status.ts` owns status labels. Four projects are featured; a native disclosure exposes the full registry without requests for each project.

Project explorations live at `/mockups/projects`. `project-studies/data.ts` resolves the existing registry and labels real media. `directions.ts` owns the six project palettes; `registry.ts` connects their index and detail presenters in `project-designs/`. Pages only resolve parameters and compose the presenter with `StudyShell`. Shared media, facts, actions, and next-project links live in `project-studies/primitives.tsx`. `StudyVideo` connects recorded media to Pause; playable demos reuse the existing `LiveEmbed` owner and load after a click. Every direction exposes all 20 projects through static routes. Keep long explanations inside closed facts; let product media lead.

Reuse the fonts from `app/layout.tsx` and the approved forest, teal, denim, and gray hoodie portraits. Keep body tokens local so they do not alter approved heroes. Visible copy uses the human-writing check. After a shared change, verify all six pages on desktop and phone, project links, keyboard focus, motion controls, and reduced motion.

Keep approved hero markup and styles unchanged when exploring bodies and endings. `ProjectVisual` labels artwork and screen previews from the content contract. Blueprint is the only device treatment. Nella’s terminal artwork is illustrative; sample numbers are not project results. New Affinity artwork belongs in the same media slots.
