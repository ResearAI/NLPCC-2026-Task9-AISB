import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "AISB 2026 -- AI Scientist Benchmark | NLPCC Shared Task",
  description:
    "The first benchmark evaluating autonomous AI research systems with integrity verification. 12 directions, 113 benchmarks, 2 competition tracks. NLPCC 2026 Shared Task organized by Westlake University NLP Lab.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col dna-bg">
        <Nav />
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
