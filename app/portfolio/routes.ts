export const portfolioHref = "/portfolio";
export const projectHref = (slug: string) => `${portfolioHref}/projects/${encodeURIComponent(slug)}`;
export const demoHref = (slug: string) => `${portfolioHref}/${encodeURIComponent(slug)}/demo`;
