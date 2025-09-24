"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getStoryblokApi, StoryblokComponent } from "@storyblok/react";

export default function PreviewPage() {
  const searchParams = useSearchParams();
  const [story, setStory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get story path from search params
    const storyPath = searchParams.get('path') || 'home';

    async function fetchStory() {
      try {
        const storyblokApi = getStoryblokApi();
        const { data } = await storyblokApi.get(`cdn/stories/${storyPath}`, {
          version: "draft",
        });
        setStory(data.story);
      } catch (err: any) {
        console.error("Error fetching story:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStory();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading preview...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">No story found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {story.content?.body?.map((blok: any) => (
        <StoryblokComponent blok={blok} key={blok._uid} />
      ))}
    </div>
  );
}