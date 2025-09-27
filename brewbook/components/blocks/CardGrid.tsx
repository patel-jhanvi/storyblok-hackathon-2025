"use client";
import { useState, useEffect } from "react";
import { storyblokEditable } from "@storyblok/react";
import Card from "../ui/Card";
import { fetchStoriesSimple, ProcessedCardData } from "@/lib/storyblok-fetch";

interface CardGridProps {
  blok?: {
    _uid: string;
    component: string;
    title?: string;
  };
}

export default function CardGrid({ blok }: CardGridProps) {
  const [data, setData] = useState<ProcessedCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    async function loadData() {
      try {
        const stories = await fetchStoriesSimple();
        setData(stories);
      } catch (error) {
        console.error('Failed to load stories:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleViewMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  if (loading) {
    return (
      <section className="p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-gray-200 animate-pulse rounded-lg h-64"></div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section {...(blok ? storyblokEditable(blok) : {})} className="p-8">
      {blok?.title && (
        <h2 className="text-3xl font-bold text-center mb-8 text-[#6B4026]">
          {blok.title}
        </h2>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.slice(0, visibleCount).map((item, index) => (
          <Card
            key={item.slug || index}
            id={item.slug}
            type={item.type || "cafe"}
            title={item.title}
            summary={item.summary}
            image={item.image}
            metadata={item.metadata || []}
          />
        ))}
      </div>

      {data.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No stories found. Make sure to run the seeding script first.
        </div>
      )}

      {visibleCount < data.length && (
        <div className="text-center mt-6">
          <span
            onClick={handleViewMore}
            className="cursor-pointer text-[#6B4026] font-medium hover:underline"
          >
            View More ({data.length - visibleCount} more)
          </span>
        </div>
      )}
    </section>
  );
}
