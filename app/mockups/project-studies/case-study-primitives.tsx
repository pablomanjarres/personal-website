import { StudyBack as PortfolioStudyBack } from "@/app/portfolio/studies/case-study-primitives";
import { studyHref, type StudyDirectionId } from "./data";

export { StudyBrief, StudyComponents, StudyDecisions, StudyFlow, StudyMeasures, StudyProductVisual } from "@/app/portfolio/studies/case-study-primitives";

export function StudyBack({ direction, className = "" }: { direction: StudyDirectionId; className?: string }) {
  return <PortfolioStudyBack indexHref={studyHref(direction)} className={className} />;
}
