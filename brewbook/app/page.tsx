"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { StoryblokComponent } from "@storyblok/react";
import Hero from "@/components/blocks/Hero";
import UnifiedSearchExperience from "@/components/search/UnifiedSearchExperience";

export default function Home() {
  const searchParams = useSearchParams();
  const [story, setStory] = useState<{ content?: { body?: Array<{ _uid: string }> } } | null>(null);
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    // Check if we're in Storyblok preview mode
    const storyblokParam = searchParams.get('_storyblok');
    const isEditMode = storyblokParam || window.location.search.includes('_storyblok');

    if (isEditMode) {
      setIsPreview(true);
      // Fetch home story for preview mode
      async function fetchHomeStory() {
        try {
          const token = process.env.NEXT_PUBLIC_STORYBLOK_TOKEN;
          if (!token) {
            console.error('Storyblok token not configured');
            return;
          }

          const url = `https://api.storyblok.com/v2/cdn/stories/home?token=${token}&version=draft`;
          const response = await fetch(url);

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const data = await response.json();
          setStory(data.story);
        } catch (error) {
          console.error("Error fetching home story:", error);
        }
      }
      fetchHomeStory();
    }
  }, [searchParams]);

  // If in preview mode and we have a story, render it
  if (isPreview && story) {
    return (
      <main>
        {story.content?.body?.map((blok: { _uid: string }) => (
          <StoryblokComponent blok={blok} key={blok._uid} />
        ))}
      </main>
    );
  }

  // Default static rendering
  return (
    <main>
      <Hero />

      {/* Unified Search Experience with Filters and Results */}
      <div className="mt-16">
        <UnifiedSearchExperience />
      </div>
    </main>
  );
}
