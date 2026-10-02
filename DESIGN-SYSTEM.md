# Personal site design system

An editorial portfolio for people hiring Pablo to build software. The portrait and large typography carry the identity; real product screenshots carry the proof.

- Paper `#f3f4f1`, ink `#132b28`, muted `#50625e`, teal `#176c62`, mint `#dae8df`, white `#ffffff`.
- Display: Archivo Black. Body and controls: IBM Plex Sans. Instrument Serif is reserved for one personal note. Reuse the existing Next font owners.
- Layout: generous fluid gutters, max width 1440px. Hero is text left and portrait right; work follows immediately in a two-column gallery; compact rows and a dark contact section complete the page.
- Shared spacing: 8, 16, 24, 32, 48, 80px. Images use 24px corners; controls use a pill; text sections do not become generic cards.
- Shared controls use visible focus, at least 44px touch targets, and consistent hover colors. Motion is restricted to a single hero entrance and user interactions; reduced motion is static.

## Ownership

`app/theme.ts` and `app/globals.css` own site tokens and resets. `app/SiteNav.tsx` owns navigation for home, portfolio, and open-source pages. `app/components/` owns shared controls and work cards/gallery. `app/home/` owns homepage sections; `app/page.tsx` only composes them. `app/projects.ts` remains the single project registry; `app/socials.ts` owns personal contact data. Portfolio case studies and bespoke open-source pages keep their route content and design contracts.

All homepage work links are derived from the registry. Gallery filters and progressive display run locally; no per-project network requests. Preserve every project detail/demo route. Remove the replaced poster component and CSS.
