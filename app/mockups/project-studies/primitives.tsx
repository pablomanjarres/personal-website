import type { ReactNode } from "react";
import { StudyLink as PortfolioStudyLink } from "@/app/portfolio/studies/primitives";
import { studyHref, type ProjectStudy, type StudyDirectionId } from "./data";

export { StudyActions, StudyDemo, StudyMedia } from "@/app/portfolio/studies/primitives";

export function StudyLink({ study, direction, children, className = "" }: { study: ProjectStudy; direction: StudyDirectionId; children: ReactNode; className?: string }) {
  return <PortfolioStudyLink href={studyHref(direction, study.project.slug)} className={className}>{children}</PortfolioStudyLink>;
}
