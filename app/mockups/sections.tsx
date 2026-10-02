import Link from "next/link";
import { profile } from "../socials";
import styles from "./sections.module.css";

const capabilities = [
  { title: "AI products", text: "Agent workflows, retrieval, and tools that keep people in control.", examples: "Noelle / Nella" },
  { title: "Web apps and systems", text: "The interface, APIs, and infrastructure behind a working product.", examples: "ConstruCredit / Cortex" },
  { title: "Developer tools", text: "Software for the people building the next thing.", examples: "Nella / Forge" },
];

function Capabilities() {
  return <div className={styles.capabilities}>{capabilities.map((item, index) => <div key={item.title} data-reveal><span className={styles.number}>0{index + 1}</span><h3>{item.title}</h3><p>{item.text}</p><small>{item.examples}</small></div>)}</div>;
}

export function AboutSection({ variant = "split" }: { variant?: "split" | "compact" | "cards" | "note" }) {
  return (
    <section id="about" className={styles.about} data-variant={variant}>
      <div className={styles.intro} data-reveal><span className={styles.label}>A little about how I work</span><h2>I care about the product<br />and how it’s built.</h2><p>I’m Pablo, a software engineer, product designer, and founder. I work across the interface and the systems behind it, from the first product decisions to the code that makes them real.</p><a href="https://trynoelle.com" target="_blank" rel="noreferrer">Currently building Noelle <span aria-hidden>↗</span></a></div>
      <Capabilities />
    </section>
  );
}

function FooterLinks() {
  return <div className={styles.footer}><span>{profile.name}</span><div>{profile.socials.filter(social => ["gh", "in", "x"].includes(social.id)).map(social => <a key={social.id} href={social.url} target="_blank" rel="noreferrer">{social.label}</a>)}</div><Link href="/mockups">Compare the designs</Link></div>;
}

export function ContactSection({ variant = "banner" }: { variant?: "banner" | "inline" | "orb" }) {
  return (
    <footer id="contact" className={styles.contact} data-variant={variant}>
      <div className={styles.invitation} data-reveal><span className={styles.label}>Have a project or a role in mind?</span><h2>Let’s make<br />something good.</h2><div className={styles.actions}><a href={`mailto:${profile.email}`}>{profile.email} <span aria-hidden>↗</span></a><a className={styles.call} href={profile.booking} target="_blank" rel="noreferrer">Book a call <span aria-hidden>↗</span></a></div></div>
      <FooterLinks />
    </footer>
  );
}
