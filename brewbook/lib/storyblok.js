import { storyblokInit, apiPlugin } from "@storyblok/react";
import Page from "@/components/Page";
import Hero from "@/components/blocks/Hero";
import Cafe from "@/components/blocks/Cafe";
import Event from "@/components/blocks/Event";
import CardGrid from "@/components/blocks/CardGrid";
// Map is dynamically imported to avoid SSR issues
import RichText from "@/components/blocks/RichText";
import Teaser from "@/components/blocks/Teaser";
import Fallback from "@/components/blocks/Fallback";

let isInitialized = false;

export function initStoryblok() {
  if (isInitialized || typeof window === 'undefined') return;

  try {
    storyblokInit({
      accessToken: process.env.NEXT_PUBLIC_STORYBLOK_TOKEN,
      use: [apiPlugin],
      components: {
        // Page structure
        page: Page,

        // Content blocks
        hero: Hero,
        cafe: Cafe,
        event: Event,
        card_grid: CardGrid,
        map: Fallback, // Map component replaced with fallback to avoid SSR issues
        richtext: RichText,

        // Teaser component (common Storyblok component)
        teaser: Teaser,

        // Additional aliases for common component names
        hero_section: Hero,
        content_grid: CardGrid,
        grid: CardGrid,
        text: RichText,

        // Fallback for unknown components
        fallback: Fallback,
      },
    });
    isInitialized = true;
    console.log("Storyblok initialized successfully with components:", Object.keys({
      page: Page,
      hero: Hero,
      cafe: Cafe,
      event: Event,
      card_grid: CardGrid,
      map: Fallback,
      richtext: RichText,
      teaser: Teaser,
      hero_section: Hero,
      content_grid: CardGrid,
      grid: CardGrid,
      text: RichText,
    }));
  } catch (error) {
    console.error("Failed to initialize Storyblok:", error);
  }
}
