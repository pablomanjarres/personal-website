export { studies, getStudy, getStudyPreview } from "@/app/portfolio/studies/data";
export type { ProjectStudy, StudyAsset } from "@/app/portfolio/studies/data";

export type StudyDirectionId = "cinema" | "gallery" | "workbench" | "atlas" | "stack" | "playground";

export function studyHref(direction: StudyDirectionId, slug?: string) {
  return `/mockups/projects/${direction}${slug ? `/${slug}` : ""}`;
}
