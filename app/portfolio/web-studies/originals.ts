import type { WebsiteStudyRecord } from "./types";

export const originals = [
  {
    slug: "offgrid-original",
    title: "Offgrid · Original",
    tagline: "Good ideas go off script.",
    category: "Creative studio",
    oneLiner: "Good weird, pasted up as a studio poster.",
    summary:
      "Offgrid gives a creative studio a website with the energy of a pasted-up street poster. Wide retro typography sits against cobalt blue and marigold, with fashion photography, ribbed-glass imagery and offset project frames making the work feel physical. The layout changes scale from a loud first screen to a clear project index, then a simple brief builder. Visitors can filter the work by discipline and assemble a short project note. The symbol is an open grid with one cell moved outside its frame, giving the studio a recognizable mark that expresses an idea leaving the expected structure.",
    challenge:
      "The studio needs to make its personality immediate while leaving its work easy to browse. A loud first screen should give way to clear disciplines and a useful project note.",
    outcome:
      "The original studio composition, with discipline filters, expressive project cards and a working local brief builder.",
    decisions: [
      [
        "Treat the page as a physical collage",
        "Wide retro typography, offset fashion photographs and ribbed-glass imagery sit against cobalt and marigold. The scales change between poster, project index and brief.",
      ],
      [
        "Turn a discipline into a starting point",
        "Visitors filter the work by Brand or Digital. Two brief choices produce a readable local starting-point note rather than an external contact submission.",
      ],
      [
        "A cell that leaves its frame",
        "An open structural grid with one displaced cell represents an idea finding a different position.",
      ],
    ],
    flow: [
      "Filter the studio work",
      "Choose a discipline and stage",
      "Assemble a starting-point brief",
    ],
    tags: [
      "Web design",
      "Brand identity",
      "agency",
      "creative studio",
      "branding",
      "portfolio",
    ],
    accent: "#1743E8",
  },
  {
    slug: "archive-original",
    title: "Archive · Original",
    tagline: "New forms. Lasting presence.",
    category: "Fashion & commerce",
    oneLiner: "New forms with a direct retail rhythm.",
    summary:
      "Archive is a fashion destination for people who dress with intention. The collection brings together expressive outerwear, everyday foundations, and considered accessories, selected for their shape, material, and lasting presence. Its visual language is direct: compressed display typography, strong monochrome campaign photography, and a single decisive cherry accent. Editorial compositions introduce the mood of a collection before a clean catalogue makes the pieces easy to explore. The shopping experience stays light and immediate, with category filters, size choices, and a local shopping bag. Archive treats clothes as part of a personal visual vocabulary, giving each silhouette enough room to make its own statement.",
    challenge:
      "Expressive fashion needs room to establish a mood while sizes and prices remain easy to find. The collection should move from campaign statement to an immediate garment choice.",
    outcome:
      "The original fashion website with category filters, size choices, repeat quantities and a working shopping bag.",
    decisions: [
      [
        "Use a compressed campaign statement",
        "Large monochrome fashion photography and Sublime display type define the opening. A decisive cherry accent connects the campaign to the clean product catalogue.",
      ],
      [
        "Keep a size in the bag",
        "Category filters lead to each garment’s details and size selector. The local bag preserves size and quantity, with removal and subtotal updating together.",
      ],
      [
        "Shelves with room for discovery",
        "Three staggered archival shelves turn storage into a graphic rhythm, with an open middle shelf pointing toward new discoveries.",
      ],
    ],
    flow: [
      "Explore the campaign and current edit",
      "Choose a garment and size",
      "Review the local shopping bag",
    ],
    tags: [
      "Web design",
      "Brand identity",
      "Fashion",
      "Ecommerce",
      "Editorial",
      "Monochrome",
    ],
    accent: "#FFFFFF",
  },
  {
    slug: "monograph-original",
    title: "Monograph · Original",
    tagline: "A different way of seeing.",
    category: "Art & culture",
    oneLiner: "An art journal with the scale of a printed issue.",
    summary:
      "Monograph is an independent art and culture journal for curious readers. Its editorial world brings together exhibition visits, artist conversations, and considered writing on the spaces around us. A generous serif masthead and deep gallery blue establish a confident publishing identity, while warm paper surfaces give photographs room to breathe. The magazine moves between large visual essays and shorter studio notes without flattening them into the same format. Readers can explore stories by subject and save the pieces they want to return to. The experience feels like opening a beautifully printed issue, with the ease of a digital reading room.",
    challenge:
      "A journal needs to move between a large visual essay and smaller studio notes without flattening their editorial differences. The printed issue should feel connected to the digital reading room.",
    outcome:
      "The original editorial composition with subject filters, expandable story notes, a saved cover essay and an illustrated printed-issue spread.",
    decisions: [
      [
        "Give the masthead a generous pause",
        "A large Commune masthead establishes gallery blue and warm paper before the opening visual essay. The cover, byline and editor note retain a magazine-like hierarchy.",
      ],
      [
        "Make the small reading choices visible",
        "Subject filters reveal the studio notes, story controls open an excerpt and the cover essay can be saved for the visit. A full-width printed-issue spread closes the journal.",
      ],
      [
        "An open journal spread",
        "Two open editorial columns form an abstract journal spread, holding art and criticism in conversation.",
      ],
    ],
    flow: [
      "Read the opening visual essay",
      "Filter or expand a studio note",
      "Explore the printed issue",
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
    slug: "sprinto-original",
    title: "Sprinto · Original",
    tagline: "Make your next move.",
    category: "Padel club",
    oneLiner: "Less scroll. More time on the court.",
    summary:
      "Sprinto brings the energy of the court into a digital club experience. Built for an urban padel community, the identity combines electric violet, sharp chartreuse, and condensed display typography with an expressive ball-in-motion symbol. The website puts play first: an immediate court view, a compact booking interaction, and clear paths into coaching and social matches. Oversized headlines and diagonal graphic details communicate speed, while the layout stays practical enough to organize a real session. Its purpose is to remove the small obstacles between wanting to play and stepping onto the court, making the club feel open, social, and full of momentum.",
    challenge:
      "An urban sports club needs to make its energy immediate and its court choices practical. Visitors should be able to find a nearby session and keep it without a complicated flow.",
    outcome:
      "The original padel composition with location filters, court-time dialogs and a persistent local session confirmation.",
    decisions: [
      [
        "Let athletic type set the pace",
        "Violet and chartreuse carry a large condensed slogan, diagonal details and cropped court photography. A compact booking card keeps the practical next move close.",
      ],
      [
        "Save the selected court session",
        "Location filters narrow the court cards. Selecting a time opens that court’s session details, and saving it keeps a visible confirmation for the visit.",
      ],
      [
        "A ball already in motion",
        "A ball and three trailing strokes capture the speed, rhythm, and shared energy of a rally.",
      ],
    ],
    flow: [
      "Choose a location",
      "Open a court time",
      "Save the session for the visit",
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
