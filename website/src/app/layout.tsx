import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "AISB 2026 -- AI Scientist Benchmark Platform",
  description:
    "AI Scientist Benchmark platform for integrity-verified AI research evaluation, competitions, leaderboards, benchmark papers, and the current NLPCC 2026 public shared task.",
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
