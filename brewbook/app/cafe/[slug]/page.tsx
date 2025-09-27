import { geocodeAddress } from "@/lib/utils/geocode";
import CafeDetailClient from "./CafeDetailClient";
import { processSingleStory } from "@/lib/storyblok-fetch";

export default async function CafeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Fetch Storyblok story
  const res = await fetch(
    `https://api.storyblok.com/v2/cdn/stories/${slug}?token=${process.env.STORYBLOK_TOKEN}`,
    { cache: "no-store" }
  );
  const data = await res.json();
  const story = data.story;

  if (!story) {
    return <div className="p-8">Not found</div>;
  }

  console.log("Storyblok address:", story.content.address);
  // Auto geocode address -> lat/lng
  const coords = await geocodeAddress(story.content.address);
  const bodyContent = story.content.body?.[0];

  const cafe = {
    title: bodyContent?.name || bodyContent?.title || story.name,
    type: bodyContent?.component || story.content.type,
    summary:
      bodyContent?.description?.content?.[0]?.content?.[0]?.text ||
      story.content.summary,
    image: bodyContent?.image?.filename || "/images/placeholder.png",
    address: bodyContent?.location || story.content.location,
    amenities: bodyContent?.amenities || [],
    lat: coords.lat,
    lng: coords.lng,
  };

  return <CafeDetailClient cafe={cafe} />;
}
