import type { WebsiteStudyRecord } from "./types";

export const places = [
  {
    slug: "forma",
    title: "FORMA",
    tagline: "Space, shaped by living.",
    category: "Architecture studio",
    oneLiner: "Architecture, read as a measured dossier.",
    summary:
      "Forma presents architecture through the spaces themselves. A large framed photograph opens beside a narrow project archive, giving each interior room to speak before the studio describes its approach. Selecting a project changes its image, facts, material palette, and spatial study. The page then follows the scale of a physical dossier: a measured plan, a broad detail photograph, a smaller material crop, and quiet practice notes. Paper, charcoal, hairline rules, and compact technical labels recall an architect’s presentation board. The nested volume symbol expresses the relationship between structure and the lives it holds.",
    challenge:
      "An architecture practice needs to show the experience of a room and the decisions behind it. Photographs, plans and material facts should stay connected to the selected project.",
    outcome:
      "A responsive architecture archive with project selection, original spatial studies and a coordinated material dossier.",
    decisions: [
      [
        "Give the room the first word",
        "A large interior photograph sits beside a narrow project archive. The restrained frame and compact facts keep the opening closer to a presentation board than a promotional banner.",
      ],
      [
        "Keep a project through the dossier",
        "Selecting a residence changes its image, facts, material palette and spatial study. The dossier follows with a measured plan and unequal detail photographs.",
      ],
      [
        "Structure around the lives it holds",
        "An open, nested architectural volume represents the dialogue between structure and the lives it holds.",
      ],
    ],
    flow: [
      "Choose a project from the archive",
      "Study its room and spatial plan",
      "Read material and practice notes",
    ],
    tags: [
      "Web design",
      "Brand identity",
      "Architecture",
      "Interior design",
      "Studio",
      "Editorial",
    ],
    accent: "#F5F4EF",
  },
  {
    slug: "vestra",
    title: "vestra",
    tagline: "Come for the view. Stay for the stillness.",
    category: "Alpine retreat",
    oneLiner: "A stay shaped by the mountain.",
    summary:
      "Vestra is an intimate mountain retreat where the landscape sets the pace. The website opens as a quiet alpine panorama, with a small invitation placed near the valley and an arrival folio that stays out of the view until it is needed. Forest green, warm cream and delicate serif typography carry a measured hospitality identity. Guests can explore room details, select dates and prepare a stay outline, then move through a portrait room journal and the slower rituals of a mountain day. The folded-ridge symbol suggests a sheltered valley. Photography, restrained captions and generous space make the retreat feel connected to its setting.",
    challenge:
      "A retreat should let the landscape establish the pace while keeping room and date choices easy to reach. Practical planning needs to appear when the guest wants it.",
    outcome:
      "A hospitality website with a quiet panoramic opening, room journal and interactive stay outline.",
    decisions: [
      [
        "Leave the panorama open",
        "Low-corner serif copy and restrained chapter links accompany the alpine landscape. The linen arrival folio opens without replacing the view.",
      ],
      [
        "Outline a stay in context",
        "Guests choose a room, dates and guest count in one folio. The resulting stay outline keeps nights, room rate and total together.",
      ],
      [
        "A sheltered valley in two ridges",
        "Two folded mountain ridges meet in a sheltered valley, expressing a retreat held by nature.",
      ],
    ],
    flow: [
      "Explore the mountain setting",
      "Choose a room and arrival dates",
      "Prepare the stay outline",
    ],
    tags: [
      "Web design",
      "Brand identity",
      "Hotel",
      "Hospitality",
      "Travel",
      "Alpine",
    ],
    accent: "#203C31",
  },
  {
    slug: "salt",
    title: "Salt",
    tagline: "Coastal food. A generous table.",
    category: "Food & hospitality",
    oneLiner: "The menu is the invitation.",
    summary:
      "Salt is a coastal neighborhood kitchen with a generous table and a menu shaped by the season. Its website opens as a printed menu spread, pairing dish names, prices and ingredient notes with an overhead plate of garlic prawns. Tomato-red edge tabs make lunch, dinner and drinks easy to explore, while navy rules and cream paper bring the warmth of a restaurant menu into the page. A scallop-shell symbol connects the identity to the coast. Kitchen photographs continue the story, and a receipt-style table planner keeps the practical details close. The experience puts appetite, good company and clear information at the center.",
    challenge:
      "A neighborhood kitchen needs its dishes, prices and table details to be easy to find. The appetite and practical information should arrive together rather than in separate promotional sections.",
    outcome:
      "A responsive restaurant menu with three menu states, kitchen photography and a receipt-style table planner.",
    decisions: [
      [
        "Open the printed menu",
        "Cream paper, navy rules and tomato-red edge tabs frame price-aligned dishes. An overhead prawn plate occupies the space where a printed menu might hold an illustration.",
      ],
      [
        "Plan a table like a receipt",
        "Menu tabs switch between lunch, dinner and drinks. The table planner keeps guests and time in a compact serrated receipt with a clear local confirmation.",
      ],
      [
        "The coast brought to the table",
        "A fan-shaped scallop shell brings the coast to the table, with open ribs suggesting shared plates and good company.",
      ],
    ],
    flow: [
      "Choose a menu",
      "Compare dishes and prices",
      "Prepare the table receipt",
    ],
    tags: [
      "Web design",
      "Brand identity",
      "Restaurant",
      "Seafood",
      "Coastal",
      "Hospitality",
    ],
    accent: "#E64732",
  },
  {
    slug: "wayfarer",
    title: "Wayfarer",
    tagline: "Choose a line. Find a story.",
    category: "Guided travel",
    oneLiner: "A walking journey on an open field atlas.",
    summary:
      "Wayfarer is a field guide to small-group walking journeys. Its first page unfolds as a trail atlas, bringing route lines, contour drawings, destination photographs and practical itinerary details into one readable spread. Travelers can choose an alpine or countryside route, compare distance and ascent, and prepare a departure plan without losing the landscape. Blue ink, warm field paper and compact notebook typography connect the identity to time spent outdoors. Uneven editorial photographs and guide notes continue the story beyond the map. The winding trail symbol expresses a journey with room for discovery, while clear route facts help make the next step feel possible.",
    challenge:
      "A traveler needs to compare distance, ascent and itinerary without losing the landscape. Route facts and destination photographs should belong to the same selected journey.",
    outcome:
      "An interactive travel atlas with linked route drawings, itinerary facts, destination photography and a local departure plan.",
    decisions: [
      [
        "Unfold the route as an atlas",
        "Contour drawings, trail lines, a pinned photograph and narrow itinerary folio create a field-guide spread. Blue ink and compact notebook labels keep the map useful.",
      ],
      [
        "Keep the plan tied to the trail",
        "Choosing a destination updates the map, stops, photograph and route facts together. The departure plan records the selected journey and date.",
      ],
      [
        "A winding trail toward an open horizon",
        "Two winding trail lines rise toward a sun, expressing exploration and an open destination.",
      ],
    ],
    flow: [
      "Choose a walking route",
      "Compare its stops and ascent",
      "Prepare the departure plan",
    ],
    tags: [
      "Web design",
      "Brand identity",
      "travel",
      "editorial",
      "outdoors",
      "landing page",
    ],
    accent: "#162B3A",
  },
] satisfies readonly WebsiteStudyRecord[];
