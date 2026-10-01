import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FitAI — AI-Powered Fitness & Wellness Platform",
  description: "Next-generation fitness platform combining biomechanical computer vision, ML progressive overload prediction, and data-grounded AI coaching.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#080c14] text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
