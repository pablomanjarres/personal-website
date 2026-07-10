import type { ComponentType } from "react";
import type { Hero } from "../../heroes";
import DefaultHero from "./DefaultHero";
import Cortex from "./cortex";
import BandOfAgents from "./band-of-agents";
import ContentPipeline from "./content-pipeline";
import Forge from "./forge";
import Archgraph from "./archgraph";
import Omegahack from "./omegahack";
import LocalhostMirror from "./localhost-mirror";
import LumenFrontier from "./lumen-frontier";
import GritXAwa from "./grit-x-awa";
import StudyHub from "./study-hub";
import Valhalla from "./valhalla";
import Redline from "./redline";
import Lumen from "./lumen";
import Portpeek from "./portpeek";

// The contract every design (bespoke or default) satisfies.
export type DesignComponent = ComponentType<{ hero: Hero; slug: string }>;

// slug → bespoke design. Slugs absent here (e.g. nella, noelle) fall through to
// DefaultHero via getDesign(). Shared file — per-project agents do NOT edit it;
// their stub file path is already wired in below.
const registry: Record<string, DesignComponent> = {
  cortex: Cortex,
  "band-of-agents": BandOfAgents,
  "content-pipeline": ContentPipeline,
  forge: Forge,
  archgraph: Archgraph,
  omegahack: Omegahack,
  "localhost-mirror": LocalhostMirror,
  "lumen-frontier": LumenFrontier,
  "grit-x-awa": GritXAwa,
  "study-hub": StudyHub,
  valhalla: Valhalla,
  redline: Redline,
  lumen: Lumen,
  portpeek: Portpeek,
};

export function getDesign(slug: string): DesignComponent {
  return registry[slug] ?? DefaultHero;
}
