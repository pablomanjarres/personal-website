import OpenStudio from "@/app/home/OpenStudio";
import { conceptStudyHref } from "../project-studies/directions";

export default function OpenStudioMockup() {
  return <OpenStudio
    projectHref={slug => conceptStudyHref("open-studio", slug)}
    archiveHref={conceptStudyHref("open-studio")}
    footerDestination={{ href: "/mockups", label: "Compare the designs" }}
  />;
}
