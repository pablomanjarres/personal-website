import type { MetadataRoute } from "next";
import { projects } from "./projects";
import { heroes } from "./oss/heroes";
import { portfolioHref, projectHref } from "./portfolio/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", portfolioHref, ...projects.map(project => projectHref(project.slug)), "/oss", ...heroes.map(hero => `/oss/${hero.slug}`)];
  return paths.map(path => ({ url: `https://pablomanjarres.com${path}` }));
}
