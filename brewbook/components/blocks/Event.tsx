import { storyblokEditable } from "@storyblok/react";
import Image from "next/image";
import { render } from "storyblok-rich-text-react-renderer";
import { Calendar, MapPin, Star } from "lucide-react";

interface EventProps {
  blok: {
    _uid: string;
    component: string;
    title: string;
    description: object;
    image?: {
      filename: string;
      alt?: string;
    };
    location: string;
    date: string;
    metadata?: Array<{
      _uid: string;
      component: string;
      tags: string;
      rating: number;
      opening_hours: string;
    }>;
  };
}

export default function Event({ blok }: EventProps) {
  const metadata = blok.metadata?.[0];
  const eventDate = new Date(blok.date);

  return (
    <div {...storyblokEditable(blok)} className="event-block p-6 bg-white rounded-lg shadow-sm border">
      {/* Image */}
      {blok.image?.filename && (
        <div className="mb-4">
          <Image
            src={blok.image.filename}
            alt={blok.image.alt || blok.title}
            width={600}
            height={300}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Content */}
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{blok.title}</h2>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            EVENT
          </span>
        </div>

        {/* Date and Location */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600">
          {blok.date && (
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {eventDate.toLocaleDateString()} at {eventDate.toLocaleTimeString()}
            </span>
          )}
          {blok.location && (
            <span className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              {blok.location}
            </span>
          )}
        </div>

        {blok.description && (
          <div className="text-gray-700 prose prose-sm max-w-none">
            {render(blok.description)}
          </div>
        )}

        {/* Metadata */}
        {metadata && (
          <div className="flex flex-wrap gap-2 mt-4">
            {metadata.tags && (
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                {metadata.tags}
              </span>
            )}
            {metadata.rating && (
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                <Star className="w-4 h-4 mr-1" />{metadata.rating}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}