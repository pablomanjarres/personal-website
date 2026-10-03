import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { openStudioTheme } from "./site/theme";

export const alt = "Pablo Manjarres: software engineer, product designer, and founder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const portrait = await readFile(join(process.cwd(), "public/images/portraits/forest-og.jpg"));
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: openStudioTheme.paper, color: openStudioTheme.ink, padding: 60, alignItems: "center", gap: 56 }}>
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <span style={{ fontSize: 42, fontWeight: 900 }}>pm.</span>
        <div style={{ display: "flex", fontSize: 88, fontWeight: 900, lineHeight: 1.04, letterSpacing: -6, marginTop: 46 }}>Ideas taking shape.</div>
        <div style={{ display: "flex", fontSize: 27, marginTop: 30 }}>Software engineer. Product designer. Founder.</div>
        <div style={{ display: "flex", fontSize: 22, marginTop: 40, color: openStudioTheme.accent }}>Pablo Manjarres · pablomanjarres.com</div>
      </div>
      {/* ImageResponse renders an embedded bitmap, rather than a browser image. */}
      <img src={`data:image/jpeg;base64,${portrait.toString("base64")}`} alt="" width={310} height={430} style={{ objectFit: "cover", borderRadius: "48%" }} />
    </div>, size,
  );
}
