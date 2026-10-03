# Personal site mockups

Six portfolio directions for hiring Pablo as a Software Engineer, Product Designer, and Founder. Each page presents the same real projects through its own composition, palette, and contact section. Review the full pages at `/mockups` before choosing a direction.

## Ownership

- `app/mockups/concepts.ts` owns gallery descriptions and approved hero palettes. The six components in `designs/` compose their approved hero and matching body.
- `app/mockups/review.tsx` owns the comparison gallery shell, cards, and preview frames for both gallery routes. `review.module.css` owns layout and image fit; `interaction.module.css` owns action size and focus states. Pages supply route data and content.
- `app/mockups/bodies/*Body.tsx` owns each concept’s work, about, and contact presentation. Matching CSS modules own local body palettes, typography, and geometry. Keep presentation choices within that concept.
- `app/portfolio/featured/content.ts` owns featured briefs and capability copy. It resolves project facts from `app/projects.ts` and accepts a project-link callback. `app/mockups/bodies/content.ts` supplies exploration routes only.
- `app/portfolio/selected-work.ts` owns the selected order: Anki, ConstruCredit, and Cortex. Homepage content and project explorations use that same list.
- `app/portfolio/anki-media.ts` owns screenshots of the running mobile app and the paired-phone Affinity export. `AnkiAppMockup` presents that export in Open Studio. `StudyMedia` bounds project-page portraits in one place.
- `app/portfolio/featured/components.tsx` owns featured visuals, links, archive, email, booking, and footer components. Mockup primitives supply their route and footer destinations. `app/site/interaction.module.css` owns action targets and focus states.
- `app/site/components.tsx` owns the shell, navigation, `pm.` mark, portraits, roles, and hero actions. `app/site/theme.ts` owns the approved Open Studio and Workbench tokens. `shell.module.css` owns shared presentation. Mockup shells only supply their themes.
- `app/site/motion.tsx` owns motion preference, Pause, Replay, pointer depth, and scroll reveals. One observer and bounded animation frames handle shared behavior. `motion.module.css` owns pause and reduced motion states.
- `app/projects.ts` owns project facts, `app/socials.ts` owns roles and contact details, and `app/portfolio/status.ts` owns status labels. Three projects are featured; the full archive stays reachable.

Project explorations live at `/mockups/projects`. `app/portfolio/studies/data.ts` resolves the project registry and labels real media. Mockup data adds direction URLs only. When a product has no capture, it supplies an unavailable asset with no image source. `StudyMedia` renders that shared state; presenters omit image-only controls. `directions.ts` owns the six project palettes; `registry.ts` connects their index and detail presenters in `project-designs/`. Pages only resolve parameters and compose the presenter with `StudyShell`. Shared media and actions live in `app/portfolio/studies/primitives.tsx`; mockup primitives supply exploration links. `StudyVideo` connects recorded media to Pause; playable demos reuse the existing `LiveEmbed` owner and load after a click. Every direction exposes all 20 projects through static routes.

`app/portfolio/studies/case-study.ts` owns the editorial context, decisions, product flow, and build notes. It uses curated, registry-grounded stories for the selected three projects and the existing registry for the archive. Status, year, stack, and links retain their existing owners. `app/portfolio/studies/case-study-primitives.tsx` presents visible briefs, measures, decisions, flows, components, product visuals, and back links. Each direction composes these into its own layout. Keep the problem, responsibility, and shipped work visible. Use actual screens with context; avoid repeating arbitrary crops of a single capture.

Reuse the fonts from `app/layout.tsx` and the approved forest, teal, denim, and gray hoodie portraits. Keep body tokens local so they do not alter approved heroes. Visible copy uses the human-writing check. After a shared change, verify all six pages on desktop and phone, project links, keyboard focus, motion controls, and reduced motion.

Keep approved hero markup and styles unchanged when exploring bodies and endings. Use product captures in the shared media contracts. Keep GitHub hero artwork out of mockups.
