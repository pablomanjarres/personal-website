import type { ReactNode } from "react";
import { tokens } from "../theme";
import "./portfolio.css";

export default function PortfolioLayout({ children }: { children: ReactNode }) {
  // Expose the shared design tokens (--bg, --accent, --ff-*) to every portfolio
  // page, the same way the atelier poster does on the homepage.
  return (
    <div className="folio" style={tokens}>
      {children}
    </div>
  );
}
