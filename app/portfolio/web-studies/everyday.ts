import type { WebsiteStudyRecord } from "./types";

export const everyday = [
  {
    slug: "aether",
    title: "Aether",
    tagline: "Your talent. Your terms.",
    category: "Freelance banking",
    oneLiner: "Income with room for the next ambition.",
    summary:
      "Aether brings the rhythm of independent work into a considered money workspace. A satin graphite payment card and translucent ember ribbon make the relationship between work, income, and possibility tangible. Small invoice controls frame the central object, connecting each selected payment to a readable account balance and allocation. The spacious opening gives way to a full-width ledger, where client names, invoice references, and amounts carry the hierarchy. Warm black, quiet paper, and precise money labels support a clear purpose: helping independent creatives understand their finances and make room for their next ambition.",
    challenge:
      "Independent work creates uneven income. Invoice choices, available money and saving allocations need to stay connected without losing the freedom of a creative practice.",
    outcome:
      "A responsive banking presentation with connected invoice selection, available-balance context and a readable allocation ledger.",
    decisions: [
      [
        "Make money feel tangible",
        "A graphite card and translucent ember ribbon occupy the centre. Peripheral invoice controls connect the sculptural opening to a full-width account ledger.",
      ],
      [
        "Let the invoice lead",
        "Selecting a client invoice changes the amount and its allocation together. The ledger keeps the same payment context visible below the opening.",
      ],
      [
        "A foundation with momentum",
        "Two rising arcs and a central point express independent momentum and a steady foundation for financial freedom.",
      ],
    ],
    flow: [
      "Choose an invoice",
      "Read its payment and allocation",
      "Explore the account ledger",
    ],
    tags: [
      "Web design",
      "Brand identity",
      "Fintech",
      "Banking",
      "Landing page",
      "Web design",
    ],
    accent: "#161614",
  },
  {
    slug: "bloom",
    title: "Bloom",
    tagline: "A little progress, every day.",
    category: "Learning dashboard",
    oneLiner: "Creative practice with a clear next step.",
    summary:
      "Bloom makes creative study feel organized and inviting. Two linked courses bring color, spacing, typography and observation into short lessons with clear prerequisites. Course cards show progress from completed practices, while a weekly timetable gives each lesson a place in the learner’s plan. Selecting a session opens its purpose, duration and exercise; completing a practice updates the course progress, learning activity and next available lesson together. A compact calendar, friendly illustrated invitation and milestone view support the same learning journey. Warm white surfaces, lime and rose accents, precise Jakarta Sans lettering and a slim navigation rail keep the workspace modern, gentle and easy to explore on a phone.",
    challenge:
      "Short lessons need a place in a week and a useful sense of progress. Prerequisites, completed practices and the next available session should tell one consistent learning story.",
    outcome:
      "A learning workspace with linked course prerequisites, lesson scheduling, interactive creative practices and consistent progress state.",
    decisions: [
      [
        "Give study a welcoming workspace",
        "An illustrated rose invitation sits beside course progress and a broad lesson timetable. A compact calendar and lime activity view add rhythm without taking over the page.",
      ],
      [
        "Let practice change progress",
        "Completing an exercise updates course progress, activity and prerequisites together. The timetable opens a lesson with its purpose, duration and practice task.",
      ],
      [
        "Growth through practice and reflection",
        "Four unfolding petals express the steady cycle of learning, practice, reflection, and growth.",
      ],
    ],
    flow: [
      "Choose a course or planned lesson",
      "Complete its creative exercise",
      "Read the updated progress and next step",
    ],
    tags: [
      "Web design",
      "Brand identity",
      "Education",
      "Dashboard",
      "Learning",
      "Lime",
    ],
    accent: "#E2EDB6",
  },
  {
    slug: "verdant",
    screenSizes: { desktop: [3200, 2000], mobile: [880, 1920] },
    title: "Verdant",
    tagline: "See where the energy goes.",
    category: "Renewable energy",
    oneLiner: "See where a site’s energy goes.",
    summary:
      "Verdant makes renewable energy easier to understand through the relationships that make a system useful. A cool white energy canvas connects generation, conversion, site demand and storage through original isometric hardware illustrations. Rounded source controls switch solar, wind and storage scenarios, while clear readout plates show balanced example flows. Selecting a component brings its role into a dark context bar. Graphite text, slate surfaces and solar yellow accents keep the technical information clear. Field photography carries the story into the landscape, and the horizon symbol connects natural potential with ordered infrastructure. A compact site planner provides a practical starting point for a future connection.",
    challenge:
      "Energy totals need the relationships between source, storage and demand to be useful. The workspace should keep connected hardware, balanced values and operating explanations visible together.",
    outcome:
      "A renewable systems website with balanced example flows, interactive isometric nodes, field project studies and a local project-outline form.",
    decisions: [
      [
        "Give the flow a clear surface",
        "Original isometric hardware sits on a cool white canvas with slate readout plates and a graphite context bar. Sora headings, Manrope annotations and solar yellow controls separate the operating roles.",
      ],
      [
        "Balance the examples across every source",
        "Solar, wind and storage choices update the complete balanced flow in kilowatts. Selecting a component shows its role beside the diagram, keeping generation, reserve and demand connected.",
      ],
      [
        "Field lines beneath a rising sun",
        "A rising sun sits over three field lines, connecting natural energy to a considered, ordered landscape.",
      ],
    ],
    flow: [
      "Choose an energy source",
      "Inspect the connected flow",
      "Read a node’s operating context",
    ],
    tags: [
      "Web design",
      "Brand identity",
      "Renewable energy",
      "Sustainability",
      "Architecture",
      "Landing page",
    ],
    accent: "#E5C24D",
  },
  {
    slug: "soundroom",
    title: "Soundroom",
    tagline: "Find your next obsession.",
    category: "Music platform",
    oneLiner: "A listening mood with a place to keep it.",
    summary:
      "Soundroom is a music discovery app for a small collection of independent ambient sketches. A wide recording-studio photograph gives the featured release a physical setting, while a compact track ledger makes the listening choices clear. Original abstract cover compositions carry each sound’s identity through the main list, mood rooms, discovery column, and persistent player. Amber selection states sit between a near-black listening canvas and a muted plum discovery desk. Listeners can play the actual short clips, seek within a track, set the volume, explore a mood, and keep a personal collection. Quiet Sora typography and carefully controlled depth make the interface feel direct, contemporary, and intimate.",
    challenge:
      "A small music collection needs a way to move from discovery to actual listening. Track selection, playback and a personal collection should remain visible in the same workspace.",
    outcome:
      "A music discovery website with real short audio playback, seeking, volume, mood rooms and a local saved collection.",
    decisions: [
      [
        "Give a release a physical setting",
        "A wide recording-studio photograph leads the dark discovery view. An amber track ledger and plum mood desk surround the persistent player.",
      ],
      [
        "Let the sound do the work",
        "The player uses the actual short recordings. Track changes, seeking, volume and saved collection state stay integrated with the discovery list.",
      ],
      [
        "A room around the source of sound",
        "Nested open frames form a listening room, with a central dot marking the source of sound.",
      ],
    ],
    flow: [
      "Explore a release or mood",
      "Play and seek within a track",
      "Keep it in the collection",
    ],
    tags: [
      "Web design",
      "Brand identity",
      "music",
      "dashboard",
      "album art",
      "independent artists",
    ],
    accent: "#111211",
  },
] satisfies readonly WebsiteStudyRecord[];
