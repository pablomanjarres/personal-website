import type { ReactNode } from "react";
import { SiteShell } from "@/app/site/components";
import { workbenchTheme } from "@/app/site/theme";
import { FooterLinks } from "@/app/portfolio/featured/components";
import styles from "./portfolio-shell.module.css";

const navigation = [
  { label: "Work", href: "/#work" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
] as const;

export function PortfolioShell({ children }: { children: ReactNode }) {
  return <SiteShell theme={workbenchTheme} navigation={navigation} brandHref="/">
    {children}
    <footer className={styles.footer}>
      <FooterLinks destination={{ href: "/", label: "Back home" }} />
    </footer>
  </SiteShell>;
}
