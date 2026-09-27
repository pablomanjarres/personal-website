import Image from "next/image";
import type { CSSProperties } from "react";

export type ProjectIdentity = {
  src: string;
  width: number;
  height: number;
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
