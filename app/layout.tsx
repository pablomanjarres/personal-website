import type { Metadata } from "next";
import { Archivo_Black, IBM_Plex_Sans, IBM_Plex_Mono, Pixelify_Sans } from "next/font/google";
import "./globals.css";

const pixelify = Pixelify_Sans({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const archivo = Archivo_Black({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pablomanjarres.com"),
  title: "Pablo Manjarres",
  description: "17 y/o solo founder & content creator. Building Noelle.",
  openGraph: {
    title: "Pablo Manjarres",
    description: "17 y/o solo founder & content creator. Building Noelle.",
    url: "https://pablomanjarres.com",
    siteName: "Pablo Manjarres",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Pablo Manjarres",
    description: "17 y/o solo founder & content creator. Building Noelle.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${archivo.variable} ${plexSans.variable} ${plexMono.variable} ${pixelify.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
