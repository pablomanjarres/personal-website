import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { concepts, type ConceptId } from "../concepts";
import Signal from "../designs/Signal";
import OpenStudio from "../designs/OpenStudio";
import Blueprint from "../designs/Blueprint";
import AfterHours from "../designs/AfterHours";
import GreenRoom from "../designs/GreenRoom";
import SoftFocus from "../designs/SoftFocus";
import styles from "../review.module.css";

const designs = { signal: Signal, "open-studio": OpenStudio, blueprint: Blueprint, "after-hours": AfterHours, "green-room": GreenRoom, "soft-focus": SoftFocus } satisfies Record<ConceptId, React.ComponentType>;

export const dynamicParams = false;
export const metadata: Metadata = { title: "Homepage design explorations — Pablo Manjarres", robots: { index: false, follow: false } };
export function generateStaticParams() { return concepts.map(concept => ({ concept: concept.id })); }

export default async function ConceptPage({ params }: { params: Promise<{ concept: string }> }) {
  const { concept: id } = await params;
  const index = concepts.findIndex(concept => concept.id === id);
  if (index < 0) notFound();
  const concept = concepts[index];
  const Design = designs[concept.id];
  const next = concepts[(index + 1) % concepts.length];
  return <><div className={styles.reviewBar}><Link href="/mockups">All six designs</Link><span>{concept.number} / {concept.name}</span><Link href={`/mockups/${next.id}`}>Next design <span aria-hidden>↗</span></Link></div><Design /></>;
}
