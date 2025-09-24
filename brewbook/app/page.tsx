"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getStoryblokApi, StoryblokComponent } from "@storyblok/react";
import Hero from "@/components/blocks/Hero";
import FiltersBar from "@/components/search/FiltersBar";
import CardGrid from "@/components/blocks/CardGrid";

export default function Home() {
  const searchParams = useSearchParams();
  const [story, setStory] = useState<any>(null);
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
          const storyblokApi = getStoryblokApi();
          const { data } = await storyblokApi.get('cdn/stories/home', {
            version: "draft",
          });
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
        {story.content?.body?.map((blok: any) => (
          <StoryblokComponent blok={blok} key={blok._uid} />
        ))}
      </main>
    );
  }

  // Default static rendering
  return (
    <main>
      <Hero />
      <div className="mt-12">
        <FiltersBar />
      </div>
      <CardGrid />
    </main>
  );
}
