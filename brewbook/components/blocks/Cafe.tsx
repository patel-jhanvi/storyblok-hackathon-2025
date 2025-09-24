import { storyblokEditable } from "@storyblok/react";
import Image from "next/image";
import { render } from "storyblok-rich-text-react-renderer";

interface CafeProps {
  blok: {
    _uid: string;
    component: string;
    name: string;
    description: any;
    image?: {
      filename: string;
      alt?: string;
    };
    location: string;
    metadata?: Array<{
      _uid: string;
      component: string;
      tags: string;
      rating: number;
      opening_hours: string;
    }>;
  };
}

export default function Cafe({ blok }: CafeProps) {
  const metadata = blok.metadata?.[0];

  return (
    <div {...storyblokEditable(blok)} className="cafe-block p-6 bg-white rounded-lg shadow-sm border">
      {/* Image */}
      {blok.image?.filename && (
        <div className="mb-4">
          <Image
            src={blok.image.filename}
            alt={blok.image.alt || blok.name}
            width={600}
            height={300}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Content */}
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-gray-900">{blok.name}</h2>

        {blok.location && (
          <p className="text-gray-600 flex items-center">
            <span className="mr-2">📍</span>
            {blok.location}
          </p>
        )}

        {blok.description && (
          <div className="text-gray-700 prose prose-sm max-w-none">
            {render(blok.description)}
          </div>
        )}

        {/* Metadata */}
        {metadata && (
          <div className="flex flex-wrap gap-2 mt-4">
            {metadata.tags && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {metadata.tags}
              </span>
            )}
            {metadata.rating && (
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                ★{metadata.rating}
              </span>
            )}
            {metadata.opening_hours && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                {metadata.opening_hours}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}