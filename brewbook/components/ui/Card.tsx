"use client";
import { useState } from "react";
import Image from "next/image";

interface CardProps {
  type: "cafe" | "study" | "meetup";
  title: string;
  summary: string;
  image: string;
  metadata: string[];
}

export default function Card({ type, title, summary, image, metadata }: CardProps) {
  const [showReactions, setShowReactions] = useState(false);

  const typeColors: Record<string, string> = {
    cafe: "bg-amber-700",
    study: "bg-blue-600",
    meetup: "bg-green-600",
  };

  const reactions = [
    { emoji: "💡", color: "hover:text-yellow-400", tooltip: "Insight" },
    { emoji: "👏", color: "hover:text-blue-500", tooltip: "Helpful" },
    { emoji: "❤️", color: "hover:text-red-500", tooltip: "Loved it" },
    { emoji: "😖", color: "hover:text-orange-600", tooltip: "Oh no!" },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative w-full h-40">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>

      {/* Text content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Type tag */}
        <span
          className={`inline-block px-3 py-1 text-xs font-semibold text-white rounded-full ${typeColors[type]} mb-2`}
        >
          {type.toUpperCase()}
        </span>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>

        {/* AI Summary */}
        <p className="text-sm text-gray-600 mt-2 line-clamp-3">{summary}</p>

        {/* Metadata */}
        <div className="flex gap-4 text-gray-500 text-sm mt-3">
          {metadata.map((meta, i) => (
            <span key={i}>{meta}</span>
          ))}
        </div>

        {/* Reaction row */}

        <div
          className="mt-4 flex justify-center items-center h-8 relative cursor-pointer"
          onMouseEnter={() => setShowReactions(true)}
          onMouseLeave={() => setShowReactions(false)}
          onClick={() => setShowReactions((prev) => !prev)}
        >
          {/* Default ghost text */}
          <span
            className={`absolute transition-opacity duration-200 text-sm text-gray-400 ${showReactions ? "opacity-0" : "opacity-100"
              }`}
          >
            How do you feel?
          </span>

          {/* Reaction emojis */}
          <div
            className={`flex gap-4 transition-all duration-300 ${showReactions
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2 pointer-events-none"
              }`}
          >
            <button className="text-gray-500 text-lg transition transform hover:scale-125 hover:text-yellow-400" title="Insight">
              💡
            </button>
            <button className="text-gray-500 text-lg transition transform hover:scale-125 hover:text-blue-500" title="Helpful">
              👏
            </button>
            <button className="text-gray-500 text-lg transition transform hover:scale-125 hover:text-red-500" title="Loved it">
              ❤️
            </button>
            <button className="text-gray-500 text-lg transition transform hover:scale-125 hover:text-orange-600" title="Oh no!">
              😖
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
