import EventPageClient from "./EventPageClient";
import EventDetailClient from "./EventDetailClient";

export default async function EventDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const search = await searchParams;

  console.log("Fetching event story for slug:", slug);

  // Fetch Storyblok story
  const token = process.env.STORYBLOK_TOKEN || process.env.NEXT_PUBLIC_STORYBLOK_TOKEN;
  console.log("Using token:", token ? "Token present" : "No token found");

  // Check if this is a preview request
  const isPreview = search._storyblok !== undefined;
  const version = isPreview ? 'draft' : 'published';

  const url = `https://api.storyblok.com/v2/cdn/stories/${slug}?token=${token}&version=${version}`;
  console.log("Fetching from URL:", url.replace(token || "", "***"));

  const res = await fetch(url, { cache: "no-store" });

  console.log("Response status:", res.status);

  if (!res.ok) {
    console.error("Failed to fetch story:", res.status, res.statusText);
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Event Not Found</h1>
        <p className="text-gray-600">Could not find event with slug: <code className="bg-gray-100 px-2 py-1 rounded">{slug}</code></p>
        <p className="text-sm text-gray-500 mt-2">Response: {res.status} {res.statusText}</p>
      </div>
    );
  }

  const data = await res.json();
  console.log("Storyblok response:", data);

  const story = data.story;

  if (!story) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Event Not Found</h1>
        <p className="text-gray-600">Story exists in response but is empty for slug: <code className="bg-gray-100 px-2 py-1 rounded">{slug}</code></p>
        <pre className="text-xs bg-gray-100 p-2 rounded mt-4 text-left overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    );
  }

  const bodyContent = story.content.body?.[0];
  const eventLocation = bodyContent?.location || story.content.location;

  const event = {
    title: bodyContent?.title || bodyContent?.name || story.name,
    type: bodyContent?.component || story.content.type,
    description: bodyContent?.description,
    summary: bodyContent?.description?.content?.[0]?.content?.[0]?.text || story.content.summary,
    image: bodyContent?.image?.filename || "/images/placeholder.png",
    location: eventLocation,
    date: bodyContent?.date || story.content.date,
    time: bodyContent?.time || story.content.time,
    price: bodyContent?.price || story.content.price,
    organizer: bodyContent?.organizer || story.content.organizer,
    tags: bodyContent?.metadata?.[0]?.tags || story.content.tags || "",
    amenities: bodyContent?.amenities || [],
  };

  if (isPreview) {
    // For preview mode, return a client component that handles the visual editor
    return <EventPageClient slug={slug} initialStory={story} initialEvent={event} />;
  }

  // For regular mode, just return the event detail directly
  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <EventDetailClient event={event} />
    </div>
  );
}