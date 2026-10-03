import { notFound } from "next/navigation";
import { studies } from "../../project-studies/data";
import { getStudyDirection, studyDirections } from "../../project-studies/directions";
import { studyDesigns } from "../../project-studies/registry";
import { StudyShell } from "../../project-studies/shell";

export const dynamicParams = false;
export function generateStaticParams() { return studyDirections.map(direction => ({ direction: direction.id })); }

export default async function ProjectIndexMockup({ params }: { params: Promise<{ direction: string }> }) {
  const { direction: id } = await params;
  const direction = getStudyDirection(id);
  if (!direction) notFound();
  const { Index } = studyDesigns[direction.id];
  return <StudyShell direction={direction}><Index studies={studies} direction={direction.id} /></StudyShell>;
}
