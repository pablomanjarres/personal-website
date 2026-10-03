import type { ReactNode } from "react";
import { projects } from "@/app/projects";
import { profile } from "@/app/socials";
import {
  BuildingLink as CurrentBuildingLink,
  FooterLinks as SiteFooterLinks,
  ProjectArchive as AllProjects,
} from "@/app/portfolio/featured/components";
import type { ConceptId } from "../concepts";
import { conceptStudyHref } from "../project-studies/directions";

export function BuildingLink({ concept, ...props }: { concept: ConceptId; className?: string; children?: ReactNode }) {
  const project = projects.find(item => item.title === profile.building);
  if (!project) throw new Error(`Missing current project: ${profile.building}`);
  return <CurrentBuildingLink href={conceptStudyHref(concept, project.slug)} {...props} />;
}

export function ProjectArchive({ concept, ...props }: { concept: ConceptId; className?: string }) {
  return <AllProjects projectHref={slug => conceptStudyHref(concept, slug)} {...props} />;
}

export function FooterLinks(props: { className?: string }) {
  return <SiteFooterLinks destination={{ href: "/mockups", label: "Compare the designs" }} {...props} />;
}
