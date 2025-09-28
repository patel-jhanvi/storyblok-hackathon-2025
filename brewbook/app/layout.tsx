import "./globals.css";
import { ReactNode, Suspense } from "react";
import { initStoryblok } from "../lib/storyblok";
import Navbar from "@/components/layout/navbar";


// Initialize Storyblok SDK once, when app loads
initStoryblok();

export const metadata = {
  title: "Brewbook",
  description: "City Guide for Devs",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <script src="https://app.storyblok.com/f/storyblok-v2-latest.js" async />
      </head>
      <body className="antialiased bg-white text-gray-900">
        <Navbar />
        <main>
          <Suspense fallback={<div>Loading...</div>}>
            {children}
          </Suspense>
        </main>
      </body>
    </html>
  );
}

