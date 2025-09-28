"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { storyblokEditable } from "@storyblok/react";
import { initStoryblok } from "@/lib/storyblok";
import Cafe from "@/components/blocks/Cafe";
import Event from "@/components/blocks/Event";

export default function SlugPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [story, setStory] = useState<{ id: string; name: string; slug: string; content: { body?: Array<{ component: string }> } } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ensure Storyblok is initialized
    initStoryblok();

    // Initialize Storyblok bridge for Visual Editor
    if (typeof window !== 'undefined' && window.storyblok && searchParams.get('_storyblok')) {
      window.storyblok.init({
        accessToken: process.env.NEXT_PUBLIC_STORYBLOK_TOKEN,
      });

      window.storyblok.on(['input', 'published', 'change'], (event: { action: string; story: { id: string; name: string; slug: string; content: { body?: Array<{ component: string }> } } }) => {
        if (event.action == 'input') {
          if (event.story.id === story?.id) {
            setStory(event.story);
          }
        } else {
          // Reload the page for published/change events
          window.location.reload();
        }
      });
    }

    const slug = params.slug as string;

    async function fetchStory() {
      try {
        const token = process.env.NEXT_PUBLIC_STORYBLOK_TOKEN;
        if (!token) {
          throw new Error("Storyblok token not configured");
        }

        const url = `https://api.storyblok.com/v2/cdn/stories/${slug}?token=${token}&version=draft`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setStory(data.story);
      } catch (error) {
        console.error("Error fetching story:", error);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchStory();
    }
  }, [params.slug, searchParams, story?.id]);

  const isPreview = searchParams.get('_storyblok') !== null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading story...</p>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Story Not Found</h1>
          <p className="text-gray-600">Could not load story: {params.slug}</p>
        </div>
      </div>
    );
  }

  const contentBlok = story.content.body?.[0] || story.content;
  const isCafe = (contentBlok as any)?.component === 'cafe' || (story.content as any).component === 'cafe';
  const isEvent = (contentBlok as any)?.component === 'event' || (story.content as any).component === 'event';

  return (
    <div {...storyblokEditable(story)} className={`min-h-screen bg-gray-50 ${isPreview ? 'storyblok__outline' : ''}`}>
      <div className="container mx-auto px-4 py-8">
        {isPreview && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              Visual Editor Mode Active - You should see green borders
            </p>
          </div>
        )}

        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          {story.name}
        </h1>

        {isCafe && <Cafe blok={story.content as any} />}
        {isEvent && <Event blok={story.content as any} />}

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Debug Info:</h3>
          <p className="text-sm text-blue-700">
            Story: {story.slug} | Component: {(contentBlok as any)?.component}
          </p>
        </div>
      </div>
    </div>
  );
}
