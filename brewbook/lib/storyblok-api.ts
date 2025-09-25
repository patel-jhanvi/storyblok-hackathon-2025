import { getStoryblokApi } from "@storyblok/react";

export interface StoryblokStory {
  id: number;
  slug: string;
  name: string;
  content: {
    component: string;
    _uid: string;
    body?: Array<{
      component: string;
      _uid: string;
      name?: string;
      title?: string;
      description?: any;
      location?: string;
      image?: {
        filename: string;
        alt?: string;
      };
      date?: string;
      metadata?: Array<{
        component: string;
        _uid: string;
        tags?: string;
        opening_hours?: string;
        rating?: number;
      }>;
    }>;
  };
}

export interface ProcessedCardData {
  type: "cafe" | "event";
  title: string;
  summary: string;
  image: string;
  metadata: string[];
  slug: string;
}

export async function fetchStoryblokStories(): Promise<ProcessedCardData[]> {
  try {
    const storyblokApi = getStoryblokApi();
    const { data } = await storyblokApi.get('cdn/stories', {
      version: 'draft',
      starts_with: '',
      is_startpage: false,
    });

    const stories: StoryblokStory[] = data.stories;

    return stories
      .filter(story =>
        story.content.body &&
        story.content.body.length > 0 &&
        story.slug !== 'home'
      )
      .map(story => {
        const bodyContent = story.content.body![0];
        const isEvent = bodyContent.component === 'event';
        const isCafe = bodyContent.component === 'cafe';

        if (!isEvent && !isCafe) return null;

        const metadata = bodyContent.metadata?.[0];
        const tags = metadata?.tags ? metadata.tags.split(',').map(t => t.trim()) : [];

        // Add location
        if (bodyContent.location) tags.push(bodyContent.location);

        // Add rating if available
        if (metadata?.rating) tags.push(`★${metadata.rating}`);

        // Add opening hours if available and not empty
        if (metadata?.opening_hours && metadata.opening_hours.trim()) {
          tags.push(metadata.opening_hours);
        }

        return {
          type: isEvent ? 'event' : 'cafe',
          title: bodyContent.name || bodyContent.title || story.name,
          summary: bodyContent.description?.content?.[0]?.content?.[0]?.text || `A ${isEvent ? 'great event' : 'cozy cafe'} to visit.`,
          image: bodyContent.image?.filename || '/images/placeholder.png',
          metadata: tags.slice(0, 5), // Limit to 5 tags to prevent overflow
          slug: story.slug,
        } as ProcessedCardData;
      })
      .filter(Boolean) as ProcessedCardData[];
  } catch (error) {
    console.error('Error fetching Storyblok stories:', error);
    return [];
  }
}

export async function fetchCafes(): Promise<ProcessedCardData[]> {
  const stories = await fetchStoryblokStories();
  return stories.filter(story => story.type === 'cafe');
}

export async function fetchEvents(): Promise<ProcessedCardData[]> {
  const stories = await fetchStoryblokStories();
  return stories.filter(story => story.type === 'event');
}