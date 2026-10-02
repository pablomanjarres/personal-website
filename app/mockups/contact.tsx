import Link from "next/link";
import { profile } from "../socials";
import type { ConceptId } from "./concepts";
import styles from "./contact.module.css";

type MailChoice = { label: string; detail: string; subject: string };
type ContactCopy = {
  variant: "spread" | "paths" | "brief" | "credits" | "folder" | "letter";
  title: string;
  intro: string;
  subject: string;
  note: string;
  choices?: MailChoice[];
};

const contactCopy: Record<ConceptId, ContactCopy> = {
  signal: {
    variant: "spread", title: "Tell me what you’re working on.",
    intro: "A product to build, a role to fill, or an idea to work through. I’d like to hear about it.",
    subject: "Something I am working on", note: "Start with an email. We can take it from there.",
  },
  "open-studio": {
    variant: "paths", title: "Say hello.",
    intro: "You don’t need a finished brief. A few lines about what you have in mind are enough.",
    subject: "Hello Pablo", note: "There’s room for a new conversation.",
    choices: [
      { label: "I have a role in mind", detail: "Tell me about the team and the work.", subject: "A role to discuss" },
      { label: "I have a project in mind", detail: "Tell me what you want to build.", subject: "A project to discuss" },
    ],
  },
  blueprint: {
    variant: "brief", title: "What are we building?",
    intro: "Send me the idea, the part you’re stuck on, or the role you’re hiring for.",
    subject: "A product to build together", note: "A few lines will do.",
    choices: [
      { label: "A product to build", detail: "Start a project email", subject: "A product to build together" },
      { label: "A place on the team", detail: "Start a role email", subject: "A place on the team" },
    ],
  },
  "after-hours": {
    variant: "credits", title: "Have a role in mind?",
    intro: "I work across software and product design. If that fits the work ahead, let’s talk.",
    subject: "A role to discuss", note: "The next part starts with a conversation.",
  },
  "green-room": {
    variant: "folder", title: "Let’s talk through it.",
    intro: "Tell me about the problem, the people using the product, and where you want to take it.",
    subject: "An idea to talk through", note: "Bring the question you’re still figuring out.",
  },
  "soft-focus": {
    variant: "letter", title: "Leave me a note.",
    intro: "If you have something you’d like to build, or a team you think I’d fit, write me a few lines. I’d like to hear about it.",
    subject: "A note for Pablo", note: "Thanks for taking a look at my work.",
  },
};

function mailHref(subject: string) {
  return `mailto:${profile.email}?subject=${encodeURIComponent(subject)}`;
}

function ContactPaths({ choices }: { choices: MailChoice[] }) {
  return <div className={styles.choices}>{choices.map(choice => (
    <a key={choice.subject} href={mailHref(choice.subject)} className={styles.choice}>
      <span>{choice.label}</span><small>{choice.detail}</small><span className={styles.choiceArrow} aria-hidden>↗</span>
    </a>
  ))}</div>;
}

function ContactLinks() {
  return <div className={styles.footerLinks}>
    <span>{profile.name}</span>
    <nav aria-label="Social profiles">{profile.socials.filter(social => ["gh", "in", "x"].includes(social.id)).map(social => (
      <a key={social.id} href={social.url} target="_blank" rel="noreferrer">{social.label}</a>
    ))}</nav>
    <Link href="/mockups">Compare the designs</Link>
  </div>;
}

export function ContactSection({ concept }: { concept: ConceptId }) {
  const copy = contactCopy[concept];
  return <footer id="contact" className={`${styles.contact} ${styles[copy.variant]}`}>
    <div className={styles.invitation} data-reveal>
      <svg className={styles.connector} viewBox="0 0 800 250" preserveAspectRatio="none" aria-hidden>
        <path d="M20 24C210 24 185 222 400 180S575 26 780 140" />
        <path className={styles.branch} d="M400 180C480 182 505 235 760 235" />
      </svg>
      <div className={styles.marker} aria-hidden>{copy.variant === "brief" ? "New conversation" : copy.variant === "folder" ? "Contact" : copy.variant === "letter" ? "A note" : ""}</div>
      <div className={styles.message}>
        <h2>{copy.title}</h2><p>{copy.intro}</p>
      </div>
      {copy.choices && <ContactPaths choices={copy.choices} />}
      <div className={styles.routes}>
        <a className={styles.email} href={mailHref(copy.subject)}>{copy.variant === "brief" && <small>To</small>}<span>{profile.email}</span><span aria-hidden>↗</span></a>
        <a className={styles.booking} href={profile.booking} target="_blank" rel="noreferrer">Book a conversation <span aria-hidden>↗</span></a>
      </div>
      <div className={styles.note}><p>{copy.note}</p>{copy.variant === "credits" ? <div className={styles.roles}>{profile.roles.map(role => <span key={role}>{role}</span>)}</div> : copy.variant === "letter" ? <span className={styles.signature}>Pablo</span> : null}</div>
    </div>
    <ContactLinks />
  </footer>;
}
