import "./globals.css";
import { ReactNode } from "react";
import { initStoryblok } from "../lib/storyblok";  
import Navbar from "@/components/layout/navbar";


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
      <Navbar /> 
       <main> {children} </main> 
      </body>
    </html>
  );
}

