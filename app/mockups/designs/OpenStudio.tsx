import OpenStudio from "@/app/home/OpenStudio";
import { conceptStudyHref } from "../project-studies/directions";

export default function OpenStudioMockup() {
  return <OpenStudio
    projectHref={slug => conceptStudyHref("open-studio", slug)}
    footerDestination={{ href: "/mockups", label: "Compare the designs" }}
  />;
}
