import { getFeaturedProjects as featuredProjects } from "@/app/portfolio/featured/content";
import type { ConceptId } from "../concepts";
import { conceptStudyHref } from "../project-studies/directions";

export { capabilities, type FeaturedProject } from "@/app/portfolio/featured/content";

export function getFeaturedProjects(concept: ConceptId) {
  return featuredProjects(slug => conceptStudyHref(concept, slug));
}
