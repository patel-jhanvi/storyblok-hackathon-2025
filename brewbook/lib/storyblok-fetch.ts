// Simple fetch-based API without SDK dependencies
export interface ProcessedCardData {
  type: "cafe" | "event";
  title: string;
  summary: string;
  image: string;
  metadata: string[];
  slug: string;
  address?: string;
  lat?: number;
  lng?: number;
  amenities?: string[];
}

export async function fetchStoriesSimple(): Promise<ProcessedCardData[]> {
  try {
    const response = await fetch(
      `https://api.storyblok.com/v2/cdn/stories?token=${process.env.NEXT_PUBLIC_STORYBLOK_TOKEN}&version=draft&starts_with=&is_startpage=false`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const stories = data.stories;

    return stories
      .filter((story: any) =>
        story.content.body &&
        story.content.body.length > 0 &&
        story.slug !== 'home'
      )
      .map((story: any) => {
        const bodyContent = story.content.body[0];
        const isEvent = bodyContent.component === 'event';
        const isCafe = bodyContent.component === 'cafe';

        if (!isEvent && !isCafe) return null;

        const metadata = bodyContent.metadata?.[0];
        const tags: string[] = [];

        // Add meaningful tags from the metadata
        if (metadata?.tags) {
          const metaTags = metadata.tags.split(',').map((t: string) => t.trim());
          // Filter out generic tags and only keep meaningful ones
          const meaningfulTags = metaTags.filter((tag: string) =>
            !['test', 'demo'].includes(tag.toLowerCase())
          );
          tags.push(...meaningfulTags);
        }

        // Add location (city only, without country code)
        if (bodyContent.location) {
          const cityName = bodyContent.location.split(',')[0].trim();
          tags.push(cityName);
        }

        // Add rating if available
        if (metadata?.rating) {
          tags.push(`★${metadata.rating}`);
        }

        // Add opening hours if available
        if (metadata?.opening_hours && Array.isArray(metadata.opening_hours)) {
          const today = new Date().getDay(); // 0 = Sunday
          const todayHours = metadata.opening_hours[today];

          if (todayHours && todayHours.open && todayHours.close) {
            tags.push(`${todayHours.open}-${todayHours.close}`);
          } else {
            tags.push("Open");
          }
        }


        return {
          type: isEvent ? 'event' : 'cafe',
          title: bodyContent.name || bodyContent.title || story.name,
          summary: bodyContent.description?.content?.[0]?.content?.[0]?.text || `A ${isEvent ? 'great event' : 'cozy cafe'} to visit.`,
          image: bodyContent.image?.filename || '/images/placeholder.png',
          metadata: tags.slice(0, 5), // Limit to 5 tags to prevent overflow
          slug: story.slug,
          address: story.content.address,
          lat: story.content.lat,
          lng: story.content.lng,
          amenities: story.content.amenities || [],
        };
      })
      .filter(Boolean);
  } catch (error) {
    console.error('Error fetching Storyblok stories:', error);
    return [];
  }
}

export function processSingleStory(story: any): ProcessedCardData {
  const bodyContent = story.content.body?.[0];
  const isEvent = bodyContent?.component === "event";
  const isCafe = bodyContent?.component === "cafe";

  const metadata = bodyContent?.metadata?.[0];
  const tags: string[] = [];

  if (metadata?.tags) {
    const metaTags = metadata.tags.split(",").map((t: string) => t.trim());
    const meaningfulTags = metaTags.filter(
      (tag: string) => !["test", "demo"].includes(tag.toLowerCase())
    );
    tags.push(...meaningfulTags);
  }

  if (bodyContent?.location) {
    const cityName = bodyContent.location.split(",")[0].trim();
    tags.push(cityName);
  }

  if (metadata?.rating) {
    tags.push(`★${metadata.rating}`);
  }

  if (metadata?.opening_hours && metadata.opening_hours.trim()) {
    if (metadata.opening_hours.includes("08:00–18:00")) {
      tags.push("8AM-6PM");
    } else {
      tags.push("Open");
    }
  }

  return {
    type: isEvent ? "event" : "cafe",
    title: bodyContent?.name || bodyContent?.title || story.name,
    summary:
      bodyContent?.description?.content?.[0]?.content?.[0]?.text ||
      `A ${isEvent ? "great event" : "cozy cafe"} to visit.`,
    image: bodyContent?.image?.filename || "/images/placeholder.png",
    metadata: tags.slice(0, 5),
    slug: story.slug,
    address: story.content.address || "",
    lat: story.content.lat || null,
    lng: story.content.lng || null,
    amenities: story.content.amenities || [],
  };
}
