"use client";
import { useState } from "react";
import Card from "../ui/Card";

const mockData = [
  {
    type: "cafe" as const,
    title: "Caffeine Hub",
    summary: "A cozy café with reliable Wi-Fi and plenty of outlets with available working space.",
    image: "/images/cafe.png",
    metadata: ["wifi", "power", "quiet"],
  },
  {
    type: "meetup" as const,
    title: "Code & Coffee Meetup",
    summary: "Weekly developer meetup for networking & hacking.",
    image: "/images/meetup.png",
    metadata: ["date", "host", "price"],
  },
  {
    type: "study" as const,
    title: "Study Loft",
    summary: "Quiet study spot with natural light and group seating.",
    image: "/images/study.png",
    metadata: ["seating", "quiet", "hours"],
  },
  // ➕ add more dummy items so we can test "View More"
  {
    type: "cafe" as const,
    title: "Java Junction",
    summary: "Perfect for long focus sessions with strong coffee.",
    image: "/images/cafe.png",
    metadata: ["wifi", "power", "moderate"],
  },
  {
    type: "study" as const,
    title: "Library Nook",
    summary: "Group seating and plenty of quiet corners.",
    image: "/images/study.png",
    metadata: ["ambience", "seating", "quiet"],
  },
  {
    type: "meetup" as const,
    title: "Tech Friday",
    summary: "Networking and AI workshops every week.",
    image: "/images/meetup.png",
    metadata: ["date", "host", "price", "free"],
  },
];

export default function CardGrid() {
  const [visibleCount, setVisibleCount] = useState(6); // show 6 cards first

  const handleViewMore = () => {
    setVisibleCount((prev) => prev + 6); // load 6 more
  };

  return (
    <section className="p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockData.slice(0, visibleCount).map((item, index) => (
          <Card key={index} {...item} />
        ))}
      </div>

      {/* View More link */}
      {visibleCount < mockData.length && (
        <div className="text-center mt-6">
          <span
            onClick={handleViewMore}
            className="cursor-pointer text-[#6B4026] font-medium hover:underline"
          >
            View More
          </span>
        </div>
      )}
    </section>
  );
}
