"use client";
import { useEffect, useState } from "react";
import { StoryblokComponent, getStoryblokApi } from "@storyblok/react";

export default function TestPreviewPage() {
  const [story, setStory] = useState<{ name: string; content?: { body?: Array<{ _uid: string }> } } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStory() {
      try {
        // Try to fetch the Demo Coffee story for testing
        const storyblokApi = getStoryblokApi();
        const { data } = await storyblokApi.get('cdn/stories/demo-coffee', {
          version: "draft",
        });
        console.log('Fetched story:', data.story);
        setStory(data.story);
      } catch (error) {
        console.error("Error fetching story:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStory();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading Storyblok content...</p>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Story Not Found</h1>
          <p className="text-gray-600 mb-4">Could not load the Demo Coffee story.</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              Make sure you&apos;ve run the seeding script: <code className="bg-blue-100 px-2 py-1 rounded">python3 storyblok_seed.py</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header for testing */}
      <div className="bg-blue-50 border-b border-blue-200 p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-lg font-semibold text-blue-800">
            Visual Editor Test Page
          </h1>
          <p className="text-sm text-blue-600 mt-1">
            Story: <code className="bg-blue-100 px-2 py-1 rounded">{story.name}</code>
            | URL: <code className="bg-blue-100 px-2 py-1 rounded">/test-preview</code>
          </p>
        </div>
      </div>

      {/* Render the Storyblok story */}
      <div className="max-w-4xl mx-auto p-8">
        {story.content?.body?.map((blok: { _uid: string }) => (
          <StoryblokComponent blok={blok} key={blok._uid} />
        ))}
      </div>

      {/* Instructions */}
      <div className="bg-gray-50 border-t border-gray-200 p-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            How to Enable Visual Editor:
          </h2>
          <ol className="space-y-2 text-sm text-gray-600">
            <li className="flex">
              <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</span>
              Go to your Storyblok space → Settings → Visual Editor
            </li>
            <li className="flex">
              <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</span>
              Set Preview URL to: <code className="bg-gray-100 px-2 py-1 rounded ml-1">http://localhost:3000/</code>
            </li>
            <li className="flex">
              <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</span>
              Go to Content → &ldquo;Demo Coffee&rdquo; story → Visual Editor tab
            </li>
            <li className="flex">
              <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">4</span>
              You should see green borders around editable content!
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}