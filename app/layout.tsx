import type { Metadata } from "next";
import {
  Montserrat,
  Playfair_Display,
} from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ciro & Dino Live Music",
  description:
    "Ciro & Dino Live Music: musica dal vivo per hotel, matrimoni, eventi privati e serate speciali.",
  keywords: [
    "Ciro e Dino",
    "live music",
    "musica dal vivo",
    "duo musicale",
    "piano bar",
    "eventi musicali",
    "musica Sorrento",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={`${montserrat.variable} ${playfair.variable}`}>
        {children}
      </body>
    </html>
  );
}