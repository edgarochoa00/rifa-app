import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Rifa Auto 2025 — Boletos a $750 MXN",
  description:
    "Participa en la rifa de un automóvil. 107 boletos disponibles a solo $750 MXN cada uno. Aparta tu boleto ahora.",
  keywords: ["rifa", "auto", "boleto", "sorteo", "750", "MXN"],
  openGraph: {
    title: "Rifa Auto 2025 — ¡Gana un auto!",
    description: "107 boletos a $750 MXN. Aparta el tuyo ahora.",
    type: "website",
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
      className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body className="min-h-dvh bg-mesh font-sans">
        <RifaProvider>{children}</RifaProvider>
      </body>
    </html>
  );
}
