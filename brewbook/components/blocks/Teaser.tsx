import { storyblokEditable } from "@storyblok/react";
import Image from "next/image";
import Link from "next/link";

interface TeaserProps {
  blok: {
    _uid: string;
    component: string;
    title?: string;
    headline?: string;
    description?: string;
    text?: string;
    image?: {
      filename: string;
      alt?: string;
    };
    link?: {
      cached_url?: string;
      url?: string;
    };
    button_text?: string;
  };
}

export default function Teaser({ blok }: TeaserProps) {
  const title = blok.title || blok.headline || 'Teaser';
  const description = blok.description || blok.text || '';
  const linkUrl = blok.link?.cached_url || blok.link?.url || '#';
  const buttonText = blok.button_text || 'Learn More';

  return (
    <div {...storyblokEditable(blok)} className="teaser-block p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      {blok.image?.filename && (
        <div className="mb-4">
          <Image
            src={blok.image.filename}
            alt={blok.image.alt || title}
            width={600}
            height={300}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}

      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>

        {description && (
          <p className="text-gray-700 leading-relaxed">{description}</p>
        )}

        {linkUrl && linkUrl !== '#' && (
          <div className="mt-4">
            <Link
              href={linkUrl}
              className="inline-block px-6 py-3 bg-[#6B4026] text-white font-medium rounded-lg hover:bg-[#4E2F1C] transition-colors"
            >
              {buttonText}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}