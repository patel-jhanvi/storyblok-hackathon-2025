// Global Storyblok type definitions
declare global {
  interface Window {
    storyblok: {
      init: (config: { accessToken?: string }) => void;
      on: (events: string[], callback: (event: { action: string; story: any }) => void) => void;
    };
  }
}

export {};