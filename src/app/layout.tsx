import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "FullCalculator — Free Online Calculators",
    template: "%s | FullCalculator",
  },
  description:
    "Free online calculators for math, finance, health, and everyday life. Fast, accurate, no signup required.",
  metadataBase: new URL("https://fullcalculator.com"),
  openGraph: {
    type: "website",
    siteName: "FullCalculator",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <Header />
        <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
