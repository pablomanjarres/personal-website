import type { Metadata } from "next";
import OpenStudio from "./home/OpenStudio";
import { projectHref } from "./portfolio/routes";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return <OpenStudio projectHref={projectHref} />;
}
