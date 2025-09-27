import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IconMap } from "./IconMap";
import { ThumbsUp, Hand, Heart, Frown } from "lucide-react";

interface CardProps {
  id: string;
  type: "cafe" | "event" | "study";
  title: string;
  summary: string;
  image: string;
  metadata: string[];
  address?: string;
  lat?: number;
  lng?: number;
}

export default function Card({
  id,
  type,
  title,
  summary,
  image,
  metadata,
  address,
  lat,
  lng,
}: CardProps) {
  const [active, setActive] = useState<string | null>(null);

  const reactions = [
    { name: "+1", icon: ThumbsUp },
    { name: "clap", icon: Hand },
    { name: "heart", icon: Heart },
    { name: "sad", icon: Frown },
  ];

  const MapIcon = IconMap["location"] as React.ComponentType<any> | undefined;

  const handleClick = (reactionName: string) => {
    setActive(reactionName);
    setTimeout(() => setActive(null), 800);
  };

  // Pick route based on type
  const href =
    type === "cafe"
      ? `/cafe/${id}`
      : type === "study"
        ? `/study/${id}`
        : `/event/${id}`;

  return (
    <Link href={href} className="block hover:shadow-md transition">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col cursor-pointer hover:shadow-md transition">
        {/* Image */}
        <Image
          src={image}
          alt={title}
          width={400}
          height={225}
          className="w-full h-48 object-cover"
        />

        <div className="p-4 flex flex-col flex-grow">
          {/* Type Tag + Map Icon */}
          <div className="flex items-center justify-between mb-2">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white
                ${type === "cafe"
                  ? "bg-[#A9745B]"
                  : type === "event"
                    ? "bg-[#82B0D8]"
                    : type === "study"
                      ? "bg-[#8FBF8F]"
                      : "bg-[#82B0D8]"
                }`}
            >
              {type.toUpperCase()}
            </span>

            {MapIcon && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  address || `${lat},${lng}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapIcon className="w-6 h-6 text-gray-500 hover:text-gray-700" />
              </a>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>

          {/* Summary */}
          <p className="text-sm text-gray-600 mt-2 line-clamp-3">{summary}</p>

          {/* Meta Row */}
          <div className="flex flex-wrap gap-2 mt-3 text-[#6B4F37]">
            {metadata.map((item, idx) => {
              const Icon = IconMap[item.toLowerCase()];
              return Icon ? (
                <div key={idx} className="relative group">
                  <Icon className="w-5 h-5 cursor-pointer" />
                  <span
                    className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block
                      whitespace-nowrap bg-[#FAF9F6] text-[#6B4F37] text-xs px-2 py-1 rounded-md shadow-md"
                  >
                    {item}
                  </span>
                </div>
              ) : (
                <span
                  key={idx}
                  className="bg-[#F5F5DC] text-[#6B4F37] text-xs px-2 py-1 rounded-full"
                >
                  {item}
                </span>
              );
            })}
          </div>

          {/* Reaction Row */}
          <div className="mt-4 text-sm text-gray-500 text-center group">
            <p>How do you feel?</p>
            <div className="flex justify-center gap-6 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {reactions.map((reaction) => {
                const Icon = reaction.icon;
                return (
                  <Icon
                    key={reaction.name}
                    onClick={() => handleClick(reaction.name)}
                    className={`cursor-pointer w-6 h-6 transition-transform text-gray-500 hover:text-gray-700
                      hover:scale-125 ${active === reaction.name
                        ? "scale-125 drop-shadow-md text-gray-700"
                        : ""
                      }`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
