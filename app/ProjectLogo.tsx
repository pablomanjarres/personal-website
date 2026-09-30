import Image from "next/image";
import type { CSSProperties } from "react";

export type ProjectIdentity = {
  src: string;
  width: number;
  height: number;
};

export const projectIdentities: Record<string, ProjectIdentity> = {
  cortex: { src: "/brand/cortex/cortex-logo.svg?v=capsule-1", width: 1590, height: 320 },
  anki: { src: "/brand/anki/anki-logo.svg?v=geometric-1", width: 1398, height: 320 },
};

export default function ProjectLogo({
  identity,
  title,
  className,
  style,
}: {
  identity: ProjectIdentity;
  title: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <Image
      {...identity}
      alt={title}
      className={className}
      style={style}
      unoptimized
    />
  );
}
