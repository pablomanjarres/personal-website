import type { WebsiteStudyRecord } from "./types";

export const operations = [
  {
    slug: "orbit",
    title: "Orbit",
    tagline: "Good work finds its rhythm.",
    category: "Project workspace",
    oneLiner: "A clear week for a creative team.",
    summary:
      "Orbit brings a small creative team’s work into one considered studio dashboard. A broad week roadmap gives research, design, content, and review their own saturated stage colors, while a continuous allocation strip connects planned hours to the actual project. Compact task rows keep owners, deadlines, checklists, and progress close together. Team workload and a timed review agenda give the work a human rhythm without overwhelming the main view. A task drawer with violet controls opens the next useful decision: change a status, complete a step, or keep a working note. Quiet paper, precise typography, and clear contrast make the shared plan easy to read on a desktop or a phone.",
    challenge:
      "A project plan is hard to read when dates, ownership and progress are scattered. The workspace needs one working week that stays connected to the tasks underneath it.",
    outcome:
      "A working studio dashboard with editable tasks, shared roadmap dates, checklist progress and a visible weekly allocation.",
    decisions: [
      [
        "Give the week a surface",
        "Unequal saturated roadmap bars follow the actual task dates. A continuous allocation strip and compact ledger preserve the relationship between time and responsibility.",
      ],
      [
        "Open the next useful decision",
        "The task drawer keeps status, checklist progress and working notes together. Completing a step updates the same task that appears in the roadmap.",
      ],
      [
        "Contributions around a shared centre",
        "An orbital path and central point represent individual contributions moving around one shared purpose.",
      ],
    ],
    flow: [
      "Read the weekly roadmap",
      "Open a task and its checklist",
      "Update its status or working note",
    ],
    tags: [
      "Web design",
      "Brand identity",
      "Dashboard",
      "Project management",
      "Productivity",
      "SaaS",
    ],
    accent: "#242629",
  },
  {
    slug: "pulse",
    title: "Pulse",
    tagline: "A clearer day in care.",
    category: "Care workspace",
    oneLiner: "The care team, the week and the next patient.",
    summary:
      "Pulse brings the care team, the working week and the next patient into one clear clinical workspace. Its overview combines scheduled care time, accurate appointment totals and a selectable weekly activity chart with a portrait-led appointment ledger. Choosing a day updates every summary and the daily appointment list from the same visits. A separate calendar provides timed clinician lanes and a chronological phone agenda, while searchable patient records preserve context and editable conversation notes. New visits use the available schedule rather than creating conflicting appointments. Dark teal navigation, lemon accents and quiet white cards make the administrative view feel calm, precise and easy to scan.",
    challenge:
      "Clinical administration needs precise scheduling and patient context. Summaries, calendar lanes and appointment records must agree when the team changes the selected day.",
    outcome:
      "A responsive clinical workspace with linked appointment summaries, a timed schedule, patient records and conflict-aware local visit creation.",
    decisions: [
      [
        "Make activity readable",
        "A broad weekly care chart sits beside the daily appointment rail. Portraits, timed records and unequal card sizes support a humane working hierarchy.",
      ],
      [
        "Keep visits in one schedule",
        "Day and clinician choices use the same visit records. A patient sheet brings the appointment, clinician and conversation note into one editable context.",
      ],
      [
        "Steady care in a protective circle",
        "A continuous pulse line inside a protective circle represents steady, connected care.",
      ],
    ],
    flow: [
      "Choose a day or clinician",
      "Open the next appointment",
      "Review patient context and notes",
    ],
    tags: [
      "Web design",
      "Brand identity",
      "Healthcare",
      "Dashboard",
      "Medical",
      "Appointments",
    ],
    accent: "#176B63",
  },
  {
    slug: "meridian",
    title: "Meridian",
    tagline: "Every movement. In view.",
    category: "Logistics dashboard",
    oneLiner: "The destination handoff in one working map.",
    summary:
      "Meridian brings the freight desk onto a detailed destination planning map. A compact utility bar and icon rail frame richly layered shipment cards, each with an original vessel, aircraft, or truck illustration. Selecting a movement reveals its destination port schematic, expected arrival, cargo, and operational handoff state. Berth, collection, and transfer points support the next planning decision without implying live vehicle positioning. A secondary world view connects the same shipments over geographic coastlines, while the manifest provides a concise operational ledger. Midnight surfaces, restrained cyan routes, and clear status accents keep the working geography in focus. The crossing-route identity connects each destination to one shared operational view.",
    challenge:
      "The freight desk needs arrival, cargo and collection details beside the selected movement. A destination plan must be legible without pretending to show a live vehicle position.",
    outcome:
      "A freight workspace with selectable port plans, geographic route monitoring, cargo records and purposeful local shipment controls.",
    decisions: [
      [
        "Keep the map in command",
        "A midnight port schematic takes most of the workspace. A narrow shipment rail and floating arrival docks keep the operational context close without turning the map into a background.",
      ],
      [
        "Distinguish plan from position",
        "Each shipment selects its destination schematic and handoff facts. The secondary world view preserves geographic routes while the port view remains clearly labelled as a planning schematic.",
      ],
      [
        "Routes that meet at a shared node",
        "Two crossing routes join around a central node, showing connected destinations and a single operational view.",
      ],
    ],
    flow: [
      "Select a shipment",
      "Inspect its destination handoff",
      "Compare the global route or manifest",
    ],
    tags: [
      "Web design",
      "Brand identity",
      "Dashboard",
      "Logistics",
      "Data visualization",
      "Dark UI",
    ],
    accent: "#111B2A",
  },
  {
    slug: "helio",
    title: "Helio",
    tagline: "Your next idea, in orbit.",
    category: "Developer platform",
    oneLiner: "A release from traffic signal to build detail.",
    summary:
      "Helio is a developer workspace built around the life of an application. A pearl sidebar gives projects and environments a clear home; a wide cobalt traffic plot connects request volume, response health, and latency to a selected hour. The deployment ledger opens each commit into its build details, while a focused release dialog traces compilation, distribution, configuration errors, and recovery. A region view reveals the connected compute core, with concise code recipes and visible usage limits below the console. Compact typography, pale surfaces, and precise signal colors keep dense information calm. Its geometric identity expresses one application reaching a distributed network.",
    challenge:
      "A developer needs to connect request health to the release that produced it. Analytics and deployment records must offer useful detail without hiding the application itself.",
    outcome:
      "A developer console with selectable traffic, release records, an interactive build flow and a regional topology view.",
    decisions: [
      [
        "Use one dominant signal",
        "A cobalt request plot leads the pearl console. The compact release ledger and sidebar place build context around that primary application view.",
      ],
      [
        "Follow a release through its states",
        "Selecting a deployment reveals its commit and build facts. The release flow makes compilation, distribution and recovery visible as distinct steps.",
      ],
      [
        "One application, distributed",
        "A geometric compute core branches toward three deployment nodes, expressing one application distributed across a global network.",
      ],
    ],
    flow: [
      "Inspect the application traffic",
      "Open a deployment record",
      "Follow release and region details",
    ],
    tags: [
      "Web design",
      "Brand identity",
      "Cloud",
      "Developer tools",
      "Technical",
      "Cobalt",
    ],
    accent: "#234AFB",
  },
] satisfies readonly WebsiteStudyRecord[];
