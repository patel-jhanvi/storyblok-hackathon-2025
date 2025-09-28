import "./globals.css";
import { ReactNode, Suspense } from "react";
import { initStoryblok } from "../lib/storyblok";
import { Outfit, Berkshire_Swash } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const berkshireSwash = Berkshire_Swash({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-berkshire-swash",
});

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
    <html lang="en" className={`${outfit.variable} ${berkshireSwash.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <script src="https://app.storyblok.com/f/storyblok-v2-latest.js" async />
      </head>
      <body className={`${outfit.className} antialiased bg-[#FAF9F6] text-gray-900`} suppressHydrationWarning={true}>
        <main>
          <Suspense fallback={<div>Loading...</div>}>
            {children}
          </Suspense>
        </main>
      </body>
    </html>
  );
}

