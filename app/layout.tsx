import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Alfa_Slab_One } from "next/font/google";
import "./globals.css";
import { RifaProvider } from "@/lib/rifa-context";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const alfaSlabOne = Alfa_Slab_One({
  variable: "--font-fancy",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rifa-app-psi-beryl.vercel.app"),
  title: "Rifa Ford LTD Crown Victoria — Boletos a $500 MXN",
  description:
    "Participa en la rifa de un Ford LTD Crown Victoria clásico. 160 boletos disponibles a solo $500 MXN cada uno. Aparta tu boleto ahora.",
  keywords: ["rifa", "auto", "ford", "ltd", "crown victoria", "boleto", "sorteo", "500", "MXN"],
  openGraph: {
    title: "Rifa Ford LTD Crown Victoria — ¡Gana un clásico!",
    description: "160 boletos a $500 MXN. Aparta el tuyo ahora.",
    type: "website",
    images: [
      {
        url: "/auto/principal.jpeg",
        width: 1200,
        height: 630,
        alt: "Ford LTD Crown Victoria Clásico",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rifa Ford LTD Crown Victoria — ¡Gana un clásico!",
    description: "160 boletos a $500 MXN. Aparta el tuyo ahora.",
    images: ["/auto/principal.jpeg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html
        lang="es"
        className={`${inter.variable} ${jetbrainsMono.variable} ${alfaSlabOne.variable} antialiased`}
      >
      <body className="min-h-dvh bg-mesh font-sans">
        <RifaProvider>{children}</RifaProvider>
      </body>
    </html>
  );
}
