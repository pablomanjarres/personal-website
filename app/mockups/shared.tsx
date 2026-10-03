import type { ReactNode } from "react";
import type { Concept } from "./concepts";
import { SiteShell } from "@/app/site/components";
export { SiteMark, Portrait, ActionLinks, RoleSummary } from "@/app/site/components";

export function MockupShell({ concept, children }: { concept: Concept; children: ReactNode }) {
  return <SiteShell theme={concept}>{children}</SiteShell>;
}
