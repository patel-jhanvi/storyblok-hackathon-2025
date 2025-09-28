"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { StoryblokComponent } from "@storyblok/react";
import { PageLoadingScreen } from "@/components/ui/LoadingScreen";
import { initStoryblok } from "@/lib/storyblok";

export default function PreviewPage() {
  const searchParams = useSearchParams();
  const [story, setStory] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize Storyblok
    initStoryblok();

    // Get story path from search params or URL params
    const storyPath = searchParams.get('path') || searchParams.get('slug') || 'home';

    async function fetchStory() {
      try {
        const token = process.env.NEXT_PUBLIC_STORYBLOK_TOKEN;
        if (!token) {
          throw new Error('Storyblok token not configured. Please add NEXT_PUBLIC_STORYBLOK_TOKEN to your .env file.');
        }

        // Use direct fetch for more reliable API calls
        const url = `https://api.storyblok.com/v2/cdn/stories/${storyPath}?token=${token}&version=draft`;

        console.log(`Fetching story: ${storyPath}`);
        const response = await fetch(url);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`Story "${storyPath}" not found. Check the story slug in Storyblok.`);
          }
          if (response.status === 401) {
            throw new Error('Invalid Storyblok token. Check your NEXT_PUBLIC_STORYBLOK_TOKEN.');
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.story) {
          throw new Error('Invalid response from Storyblok API');
        }

        setStory(data.story);
        console.log('Story loaded successfully:', data.story.name);
      } catch (err) {
        console.error("Error fetching story:", err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchStory();
  }, [searchParams]);

  // Listen for Storyblok bridge events
  useEffect(() => {
    const handleBridgeMessage = (event: MessageEvent) => {
      if (event.data.action === 'story-published' || event.data.action === 'story-changed') {
        // Refresh the story when content changes
        window.location.reload();
      }
    };

    window.addEventListener('message', handleBridgeMessage);
    return () => window.removeEventListener('message', handleBridgeMessage);
  }, []);

  if (loading) {
    return <PageLoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Preview Error</h1>
          <p className="text-gray-700 mb-4">Failed to load preview content</p>
          <p className="text-sm text-gray-500 bg-gray-100 p-3 rounded">
            {error}
          </p>
          <div className="mt-6">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#6B4026] text-white rounded hover:bg-[#4E2F1C] transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Content Found</h1>
          <p className="text-gray-600">
            No story found for the requested path. Check your Storyblok content or try a different path.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {story.content?.body?.map((blok: Record<string, unknown>) => (
        <StoryblokComponent blok={blok} key={blok._uid as string} />
      ))}
    </div>
  );
}