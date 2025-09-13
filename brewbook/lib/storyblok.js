// lib/storyblok.js
import { storyblokInit, apiPlugin } from "@storyblok/react";

export function initStoryblok() {
  storyblokInit({
    accessToken: process.env.STORYBLOK_TOKEN,
    use: [apiPlugin],
    components: {
      // Hero, card_grid: CardGrid, etc.
    },
  });
}
