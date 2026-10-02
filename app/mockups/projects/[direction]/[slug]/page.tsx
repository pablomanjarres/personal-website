import { notFound } from "next/navigation";
import { studies, getStudy, nextStudy } from "../../../project-studies/data";
import { getStudyDirection, studyDirections } from "../../../project-studies/directions";
import { studyDesigns } from "../../../project-studies/registry";
import { StudyShell } from "../../../project-studies/shell";

export const dynamicParams = false;
export function generateStaticParams() { return studyDirections.flatMap(direction => studies.map(study => ({ direction: direction.id, slug: study.project.slug }))); }

export default async function ProjectDetailMockup({ params }: { params: Promise<{ direction: string; slug: string }> }) {
  const { direction: id, slug } = await params;
  const direction = getStudyDirection(id);
  const study = getStudy(slug);
  if (!direction || !study) notFound();
  const { Detail } = studyDesigns[direction.id];
  return <StudyShell direction={direction}><Detail study={study} nextStudy={nextStudy(slug)} direction={direction.id} /></StudyShell>;
}
