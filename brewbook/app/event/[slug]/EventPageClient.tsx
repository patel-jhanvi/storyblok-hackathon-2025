"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { storyblokEditable } from "@storyblok/react";
import { initStoryblok } from "@/lib/storyblok";
import EventDetailClient from "./EventDetailClient";

interface EventPageClientProps {
  slug: string;
  initialStory: any;
  initialEvent: any;
}

export default function EventPageClient({ slug, initialStory, initialEvent }: EventPageClientProps) {
  const searchParams = useSearchParams();
  const [story, setStory] = useState(initialStory);
  const [event, setEvent] = useState(initialEvent);
  const isPreview = searchParams.get('_storyblok') !== null;

  console.log('EventPageClient rendering:', { slug, isPreview, hasStory: !!story, hasEvent: !!event });

  // Function to extract event data from story
  const extractEventData = (storyData: any) => {
    const bodyContent = storyData.content.body?.[0];
    const eventLocation = bodyContent?.location || storyData.content.location;

    return {
      title: bodyContent?.title || bodyContent?.name || storyData.name,
      type: bodyContent?.component || storyData.content.type,
      description: bodyContent?.description,
      summary: bodyContent?.description?.content?.[0]?.content?.[0]?.text || storyData.content.summary,
      image: bodyContent?.image?.filename || "/images/placeholder.png",
      location: eventLocation,
      date: bodyContent?.date || storyData.content.date,
      time: bodyContent?.time || storyData.content.time,
      price: bodyContent?.price || storyData.content.price,
      organizer: bodyContent?.organizer || storyData.content.organizer,
      tags: bodyContent?.metadata?.[0]?.tags || storyData.content.tags || "",
      amenities: bodyContent?.amenities || [],
    };
  };

  useEffect(() => {
    // Initialize Storyblok
    initStoryblok();

    // Initialize Storyblok bridge for Visual Editor
    if (typeof window !== 'undefined' && window.storyblok && isPreview) {
      window.storyblok.init({
        accessToken: process.env.NEXT_PUBLIC_STORYBLOK_TOKEN,
      });

      window.storyblok.on(['input', 'published', 'change'], (event: { action: string; story: any }) => {
        if (event.action === 'input') {
          if (event.story.id === story?.id) {
            setStory(event.story);
            setEvent(extractEventData(event.story));
          }
        } else {
          // Reload the page for published/change events
          window.location.reload();
        }
      });
    }
  }, [slug, story?.id, isPreview]);

  // Get the event blok for editing purposes
  const eventBlok = story?.content?.body?.[0];

  // Always use the custom EventDetailClient but with proper storyblok attributes for editing
  return (
    <div {...(isPreview ? storyblokEditable(story) : {})} className="min-h-screen bg-[#FAF9F6]">
      {isPreview && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 p-4 bg-green-100 border border-green-300 rounded-lg shadow-lg">
          <p className="text-sm text-green-800 font-medium">
            Visual Editor Active - Live editing enabled
          </p>
        </div>
      )}

      <EventDetailClient event={event} eventBlok={eventBlok} />
    </div>
  );
}