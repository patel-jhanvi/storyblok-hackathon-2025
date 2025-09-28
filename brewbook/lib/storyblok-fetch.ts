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
      `https://api.storyblok.com/v2/cdn/stories?token=${process.env.NEXT_PUBLIC_STORYBLOK_TOKEN}&version=published&starts_with=&is_startpage=false`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const stories = data.stories;

    return stories
      .filter((story: { content: { body?: Array<{ component: string }> }; slug: string }) =>
        story.content.body &&
        story.content.body.length > 0 &&
        story.slug !== 'home'
      )
      .map((story: { content: { body: Array<{ component: string; name?: string; title?: string; description?: { content?: Array<{ content?: Array<{ text?: string }> }> }; image?: { filename: string } }> }; slug: string; name: string }) => {
        const bodyContent = story.content.body[0];
        const isEvent = bodyContent.component === 'event';
        const isCafe = bodyContent.component === 'cafe';

        if (!isEvent && !isCafe) return null;

        const metadata = (bodyContent as any).metadata?.[0];
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
        if ((bodyContent as any).location) {
          const cityName = (bodyContent as any).location.split(',')[0].trim();
          tags.push(cityName);
        }

        // Add rating if available
        if (metadata?.rating) {
          tags.push(`★${metadata.rating}`);
        }

        // Add opening hours if available and not empty (simplified)
        if (metadata?.opening_hours) {
          // Extract text from richtext format
          let hoursText = '';
          if (typeof metadata.opening_hours === 'string') {
            hoursText = metadata.opening_hours;
          } else if (metadata.opening_hours?.content?.[0]?.content?.[0]?.text) {
            hoursText = metadata.opening_hours.content[0].content[0].text;
          }

          if (hoursText && hoursText.trim()) {
            // Simplify opening hours display
            if (hoursText.includes('08:00–18:00') || hoursText.includes('8:00-18:00')) {
              tags.push('8AM-6PM');
            } else if (hoursText.includes('7:00-19:00') || hoursText.includes('07:00-19:00')) {
              tags.push('7AM-7PM');
            } else {
              tags.push('Open');
            }
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
          amenities: story.content.amenities && story.content.amenities.length > 0
            ? story.content.amenities
            : ["WiFi", "Power Outlets", "Pet Friendly"],
        };
      })
      .filter(Boolean);
  } catch (error) {
    console.error('Error fetching Storyblok stories:', error);
    return [];
  }
}

// Single story processor (for detail pages)
export function processSingleStory(story: { content: { body?: Array<{ component: string; metadata?: Array<{ tags?: string }> }> } }): ProcessedCardData {
  const bodyContent = story.content.body?.[0];
  const isEvent = bodyContent?.component === "event";
  // const isCafe = bodyContent?.component === "cafe";

  const metadata = bodyContent?.metadata?.[0];
  const tags: string[] = [];

  if (metadata?.tags) {
    const metaTags = metadata.tags.split(",").map((t: string) => t.trim());
    const meaningfulTags = metaTags.filter(
      (tag: string) => !["test", "demo"].includes(tag.toLowerCase())
    );
    tags.push(...meaningfulTags);
  }

  if ((bodyContent as any)?.location) {
    const cityName = (bodyContent as any).location.split(",")[0].trim();
    tags.push(cityName);
  }

  if ((metadata as any)?.rating) {
    tags.push(`★${(metadata as any).rating}`);
  }

  if ((metadata as any)?.opening_hours && (metadata as any).opening_hours.trim()) {
    if ((metadata as any).opening_hours.includes("08:00–18:00")) {
      tags.push("8AM-6PM");
    } else {
      tags.push("Open");
    }
  }

  return {
    type: isEvent ? "event" : "cafe",
    title: (bodyContent as any)?.name || (bodyContent as any)?.title || (story as any).name,
    summary:
      (bodyContent as any)?.description?.content?.[0]?.content?.[0]?.text ||
      `A ${isEvent ? "great event" : "cozy cafe"} to visit.`,
    image: (bodyContent as any)?.image?.filename || "/images/placeholder.png",
    metadata: tags.slice(0, 5),
    slug: story.slug,
    address: story.content.address || "",
    lat: story.content.lat || null,
    lng: story.content.lng || null,
    amenities: story.content.amenities && story.content.amenities.length > 0
      ? story.content.amenities
      : ["WiFi", "Power Outlets", "Pet Friendly"],
  };
}
