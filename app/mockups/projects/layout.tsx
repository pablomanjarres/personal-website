import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = { title: "Project page explorations — Pablo Manjarres", robots: { index: false, follow: false } };
export default function ProjectMockupLayout({ children }: { children: ReactNode }) { return children; }
