import { WorkbenchDetail, WorkbenchIndex } from "@/app/portfolio/workbench/Workbench";
import type { ProjectStudy } from "@/app/portfolio/studies/data";
import { demoHref } from "@/app/portfolio/routes";
import { studyHref, type StudyDirectionId } from "../project-studies/data";

type IndexProps = { studies: readonly ProjectStudy[]; direction: StudyDirectionId };
type DetailProps = { study: ProjectStudy; direction: StudyDirectionId };

export function ProductWorkbenchIndex({ studies, direction }: IndexProps) {
  return <WorkbenchIndex studies={studies} projectHref={slug => studyHref(direction, slug)} />;
}

export function ProductWorkbenchDetail({ study, direction }: DetailProps) {
  return <WorkbenchDetail study={study} indexHref={studyHref(direction)} demoHref={demoHref(study.project.slug)} />;
}
