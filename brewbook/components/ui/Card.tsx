import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IconMap } from "./IconMap";


interface CardProps {
  id: string;
  type: "cafe" | "event" | "study";
  title: string;
  summary: string;
  image: string;
  metadata: string[];
}

export default function Card({ id, type, title, summary, image, metadata }: CardProps) {
  const reactions = ["💡", "👏", "❤️", "😖"];
  const [active, setActive] = useState<string | null>(null);

  const MapIcon = IconMap["location"] as React.ComponentType<any> | undefined;

  const handleClick = (emoji: string) => {
    setActive(emoji);
    setTimeout(() => setActive(null), 800);
  };

  // pick route based on type
  const href =
    type === "cafe"
      ? `/cafe/${id}`
      : type === "study"
        ? `/study/${id}`
        : `/event/${id}`;

  return (
    <Link href={`/cafe/${id}`} className="block hover:shadow-md transition">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col cursor-pointer hover:shadow-md transition">
        {/* Image */}
        <Image
          src={image}
          alt={title}
          width={400}
          height={225}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="text-sm text-gray-600 mt-2 line-clamp-3">{summary}</p>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Type Tag + Map Icon */}
          <div className="flex items-center justify-between mb-2">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white
                ${type === "cafe" ? "bg-[#A9745B]" :
                  type === "event" ? "bg-[#82B0D8]" :
                    type === "study" ? "bg-[#8FBF8F]" :
                      "bg-[#82B0D8]"}`}
            >
              {type.toUpperCase()}
            </span>

            {MapIcon && (
              <MapIcon className="w-6 h-6 text-gray-500 hover:text-gray-700" />
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
              {reactions.map((emoji) => (
                <span
                  key={emoji}
                  onClick={() => handleClick(emoji)}
                  className={`cursor-pointer text-2xl transition-transform hover:scale-125 ${active === emoji ? "scale-125 drop-shadow-md" : ""
                    }`}
                >
                  {emoji}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
