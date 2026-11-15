import type { ProjectStudy } from "./studies/data";
import { portfolioHref } from "./routes";
import { selectedWorkSlugs } from "./selected-work";
import { isWebsiteStudy } from "./web-studies/catalog";

export const websitesCollection = {
  id: "websites",
  label: "Websites",
  title: "Websites and identities.",
} as const;

export const websitesHref = `${portfolioHref}#${websitesCollection.id}`;

export type StudyGroups = {
  selected: readonly ProjectStudy[];
  products: readonly ProjectStudy[];
  websites: readonly ProjectStudy[];
};

export function groupStudies(studies: readonly ProjectStudy[]): StudyGroups {
  const studiesBySlug = new Map(studies.map(study => [study.project.slug, study]));
  const selectedSlugs = new Set<string>(selectedWorkSlugs);
  const selected = selectedWorkSlugs
    .map(slug => studiesBySlug.get(slug))
    .filter((study): study is ProjectStudy => Boolean(study));
  const remaining = studies.filter(study => !selectedSlugs.has(study.project.slug));
  return {
    selected,
    products: remaining.filter(study => !isWebsiteStudy(study.project.slug)),
    websites: remaining.filter(study => isWebsiteStudy(study.project.slug)),
  };
}
