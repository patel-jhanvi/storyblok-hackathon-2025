import { storyblokInit, apiPlugin } from "@storyblok/react";

let isInitialized = false;

export function initStoryblok() {
  if (isInitialized) return;

  try {
    storyblokInit({
      accessToken: process.env.NEXT_PUBLIC_STORYBLOK_TOKEN,
      use: [apiPlugin],
      components: {
        // Components will be handled directly in pages, not here
      },
    });
    isInitialized = true;
    console.log("Storyblok initialized successfully");
  } catch (error) {
    console.error("Failed to initialize Storyblok:", error);
  }
}
