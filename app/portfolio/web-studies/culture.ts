import type { WebsiteStudyRecord } from "./types";

export const culture = [
  {
    slug: "offgrid",
    title: "Offgrid",
    tagline: "Good ideas go off script.",
    category: "Creative studio",
    oneLiner: "Good ideas need room to go off script.",
    summary:
      "Offgrid is an independent design studio with a clear appetite for the unexpected. Its first screen is a cobalt typographic poster: a small manifesto, a ruled vertical project menu, and a large cropped Tahoe wordmark carry the identity without a promotional image. Selected work opens into three different art-directed worlds, combining original typographic compositions, photographic material, printed pieces, and purposeful changes in scale. Warm milk and marigold give the supporting pages a direct, tactile character. Visitors can switch projects to see their visual language, scope, and story, read the studio’s working principles, and build a downloadable project brief as a starting point for a future conversation.",
    challenge:
      "A creative studio needs a strong identity without reducing every project to the same promotional tile. The work should show distinct visual languages and offer a clear starting point for a brief.",
    outcome:
      "A studio website with a typographic opening, three distinct project worlds and a downloadable local brief.",
    decisions: [
      [
        "Make the opening a poster",
        "A dramatically cropped Tahoe wordmark fills cobalt. An upper-corner manifesto and ruled vertical project menu establish the studio before any case-study image appears.",
      ],
      [
        "Give each project its own world",
        "Project selection changes the art direction, scope and story. The brief builder then turns a few chosen inputs into a downloadable starting point.",
      ],
      [
        "One idea outside the grid",
        "An open structural grid with one displaced cell represents an idea finding a different position.",
      ],
    ],
    flow: [
      "Choose a studio project",
      "Read its visual language and scope",
      "Build a project brief",
    ],
    tags: [
      "Web design",
      "Brand identity",
      "agency",
      "creative studio",
      "branding",
      "portfolio",
    ],
    accent: "#1D37DD",
  },
  {
    slug: "monograph",
    title: "Monograph",
    tagline: "A different way of seeing.",
    category: "Art & culture",
    oneLiner: "A living wall for curious eyes.",
    summary:
      "Monograph is an independent journal for curious eyes. A narrow gallery-blue index accompanies a living wall of photographs, essays, and studio observations on warm paper. Four unequal columns create a reading rhythm of their own: a long exhibition view, a floating colour study, a sculptural detail, and a small record of work. Delicate serif headlines and precise publishing notes keep the imagery in focus. Readers can change the issue, explore subjects, open a longer essay, and keep a personal reading list. Below the wall, exhibition archives and a printed edition invite a slower encounter with art, objects, and the spaces between them.",
    challenge:
      "An art journal should let essays, photographs and smaller observations keep their different scales. Issue navigation and saved reading should support that editorial rhythm.",
    outcome:
      "An editorial website with issue and subject controls, complete story details, reading-list state and exhibition notes.",
    decisions: [
      [
        "Build an unequal editorial wall",
        "Four different column rhythms sit beside a navy issue rail. Exhibition views, color studies and small studio records retain their own shape rather than becoming equal cards.",
      ],
      [
        "Keep the reading context",
        "Readers can change issue and subject, open a complete story drawer and save a piece. Credits and opening paragraphs stay with the selected essay.",
      ],
      [
        "Two columns in conversation",
        "Two open editorial columns form an abstract journal spread, holding art and criticism in conversation.",
      ],
    ],
    flow: [
      "Choose an issue or subject",
      "Open a visual essay",
      "Keep a personal reading list",
    ],
    tags: [
      "Web design",
      "Brand identity",
      "Editorial",
      "Art magazine",
      "Culture",
      "Exhibitions",
    ],
    accent: "#182A63",
  },
  {
    slug: "estelle",
    title: "Estelle",
    tagline: "A quiet kind of extraordinary.",
    category: "Luxury & jewelry",
    oneLiner: "An intimate study of metal and touch.",
    summary:
      "Estelle presents sculptural jewellery as a quiet exhibition of form, material, and touch. Two unequal photographic apertures show each piece close and worn, separated by a slender atelier wordmark on ivory. A folded ring and a pair of elongated petal earrings establish a small, considered collection. Visitors can study gold and silver through matching views, read dimensions and finish notes, and move from the polished object to the workbench behind it. Delicate serif titles and fine annotations keep the attention on the metal. A personal viewing folio gathers the chosen piece, material, and preferred atelier hour into one unhurried encounter.",
    challenge:
      "Jewelry needs both a close view of its form and a sense of how it is worn. Material selection must keep those views and the product facts aligned.",
    outcome:
      "A jewelry presentation with linked macro and worn studies, material choices and a personal viewing folio.",
    decisions: [
      [
        "Hold two unequal apertures",
        "Macro and worn photographs flank a slender atelier identity on ivory. Fine annotations describe the object without competing with its surface.",
      ],
      [
        "Study a material before a viewing",
        "Gold and silver choices reveal matching photographs and dimensions. A viewing folio carries the selected piece, material and preferred hour into one local outline.",
      ],
      [
        "A quiet point of evening light",
        "Four curved rays surround a central point of light, recalling the evening star and the quiet radiance of jewelry worn close.",
      ],
    ],
    flow: [
      "Choose a sculptural piece",
      "Compare its material studies",
      "Prepare a viewing folio",
    ],
    tags: [
      "Web design",
      "Brand identity",
      "Jewelry",
      "Luxury",
      "Atelier",
      "Gold",
    ],
    accent: "#211419",
  },
  {
    slug: "sprinto",
    title: "Sprinto",
    tagline: "Meet you at the net.",
    category: "Padel club",
    oneLiner: "The next game starts at the court.",
    summary:
      "Sprinto is an urban padel club built around getting people onto the court. A warm playing environment fills the opening screen, with a compact date, court and time selector anchored directly within it. Electric violet and chartreuse give the club a clear athletic identity without hiding the practical booking details. An exposed availability board makes open sessions easy to scan, while ruled fixture rows introduce weekly social matches and coaching. The ball-in-motion symbol captures the rhythm of a rally. Condensed club typography, direct pricing and large selected states bring the energy of padel into an approachable experience for new players and regulars alike.",
    challenge:
      "A player needs to see which court and time are available without navigating away from the club. A selected session must stay valid as the date or court changes.",
    outcome:
      "A padel website with a working availability board, valid session selection, local reservation state and social-match fixtures.",
    decisions: [
      [
        "Put booking inside the playing environment",
        "A warm court photograph fills the first screen. A compact cream date, court and time stack sits within it, with chartreuse confirmation and a small violet identity.",
      ],
      [
        "Use one availability rule",
        "Date and court choices keep the selected time enabled. Reserving records the same court, date and duration shown by the booking controls.",
      ],
      [
        "The speed and rhythm of a rally",
        "A ball and three trailing strokes capture the speed, rhythm, and shared energy of a rally.",
      ],
    ],
    flow: [
      "Choose a day and court",
      "Select an available time",
      "Hold the session and explore fixtures",
    ],
    tags: [
      "Web design",
      "Brand identity",
      "Padel",
      "Sports",
      "Booking",
      "Landing page",
    ],
    accent: "#6535F4",
  },
] satisfies readonly WebsiteStudyRecord[];
