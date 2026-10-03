import Link from "next/link";
import { studyDirections } from "../project-studies/directions";
import { studies } from "@/app/portfolio/studies/data";
import { studyHref } from "../project-studies/data";
import { ReviewCard, ReviewGallery, ReviewPreview } from "../review";

export default function ProjectMockupGallery() {
  return <ReviewGallery
    header={<><Link href="/mockups">Homepage designs</Link><h1>See the products.</h1><p>Six ways to browse the projects and take a closer look.</p></>}
    footer={<>Open a project to see the full page. Each direction includes all {studies.length} projects.</>}
  >
    {studyDirections.map((direction, index) => <ReviewCard key={direction.id} href={studyHref(direction.id)} number={`0${index + 1}`} name={direction.name} description={direction.description}>
      <ReviewPreview src={`/mockups/project-previews/${direction.id}.webp?v=mobile-edge-1`} alt={`${direction.name} project page`} background={direction.paper} />
    </ReviewCard>)}
  </ReviewGallery>;
}
