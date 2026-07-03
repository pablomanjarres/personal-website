import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getHero, heroes } from "../heroes";
import { getDesign } from "./designs/registry";

export const dynamicParams = false;

export function generateStaticParams() {
  return heroes.map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const h = getHero(slug);
  if (!h) return { title: "Not found" };
  const title = `${h.title} — ${h.titleLead} ${h.titleMain}`;
  return {
    title,
    description: h.subtitle,
    openGraph: {
      title,
      description: h.subtitle,
      url: `https://pablomanjarres.com/oss/${h.slug}`,
      type: "website",
      // NOTE: openGraph.images intentionally omitted. The per-slug OG image is
      // produced by the file-convention route app/oss/[slug]/opengraph-image.tsx
      // (added by the OG agent); Next auto-injects og:image + twitter:image from
      // it. Hardcoding /og/<slug>.png here would double up and drift from the
      // generated card.
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: h.subtitle,
      // twitter image likewise comes from the generated opengraph-image route.
    },
  };
}

export default async function OssHero({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const h = getHero(slug);
  if (!h) notFound();

  const Design = getDesign(slug);
  return <Design hero={h} slug={slug} />;
}
