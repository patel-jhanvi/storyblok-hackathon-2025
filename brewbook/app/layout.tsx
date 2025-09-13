import "./globals.css";
import { ReactNode } from "react";
import { initStoryblok } from "../lib/storyblok";  // ⬅️ add this

// Initialize Storyblok SDK once, when app loads
initStoryblok();

export const metadata = {
  title: "Brewbook",
  description: "City Guide for Devs",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}

