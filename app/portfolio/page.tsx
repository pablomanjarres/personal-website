import type { Metadata } from "next";
import { studies } from "@/app/portfolio/studies/data";
import { portfolioHref, projectHref } from "@/app/portfolio/routes";
import { WorkbenchIndex } from "@/app/portfolio/workbench/Workbench";
import { PortfolioShell } from "@/app/portfolio/workbench/PortfolioShell";

export const metadata: Metadata = {
  title: "Work | Pablo Manjarres",
  description: "Products, apps, and developer tools I’ve designed and built. Anki, ConstruCredit, Cortex, and the rest of my work.",
  alternates: { canonical: portfolioHref },
  robots: { index: true, follow: true },
  twitter: {
    card: "summary_large_image",
    title: "Work | Pablo Manjarres",
    description: "Products, apps, and developer tools I’ve designed and built.",
    images: ["/opengraph-image"],
  },
  openGraph: {
    title: "Work | Pablo Manjarres",
    description: "Products, apps, and developer tools I’ve designed and built.",
    url: portfolioHref,
    type: "website",
    images: ["/opengraph-image"],
  },
};

export default function PortfolioIndex() {
  return <PortfolioShell><WorkbenchIndex studies={studies} projectHref={projectHref} /></PortfolioShell>;
}
