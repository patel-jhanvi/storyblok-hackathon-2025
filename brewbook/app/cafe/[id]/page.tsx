"use client";

import Image from "next/image";
import { MapPin, Wifi, Plug, Coffee, Car } from "lucide-react";

export default function CafeDetailPage({ params }: { params: { id: string } }) {

  const mockData = {
    title: "Café Brew",
    type: "Café",
    summary:
      "A cozy café with reliable Wi-Fi, power outlets, and a peaceful atmosphere, ideal for remote work and study sessions.",
    image: "/coffee.jpg",
    address: "123 Main St, Hometown, USA",
    amenities: ["wifi", "power", "coffee", "parking", "quiet"],
  };

  return (
    <div className="p-8">
      {/* Main grid layout */}
      <div className="grid grid-cols-3 gap-8">
        {/* Left column (content) */}
        <div className="col-span-2 space-y-6">
          {/* Header image */}
          <Image
            src={mockData.image}
            alt={mockData.title}
            width={800}
            height={400}
            className="w-full h-64 object-cover rounded-lg"
          />

          {/* Title + Tag */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {mockData.title}
            </h1>
            <span className="mt-2 inline-block px-3 py-1 rounded-full bg-[#EADDC8] text-[#6B4F37] text-sm font-medium">
              {mockData.type}
            </span>
          </div>

          {/* AI Summary */}
          <p className="text-base text-gray-700 leading-relaxed">
            {mockData.summary}
          </p>

          {/* Tabs (static for now) */}
          <div className="flex gap-6 border-b text-sm">
            <button className="font-semibold text-[#6B4F37] border-b-2 border-[#6B4F37] pb-2">
              Overview
            </button>
            <button className="text-gray-500 hover:text-gray-700">Reviews</button>
            <button className="text-gray-500 hover:text-gray-700">Price</button>
            <button className="text-gray-500 hover:text-gray-700">Photos</button>
          </div>

          {/* Amenities row */}
          <div className="flex gap-6 mt-4 text-[#6B4F37]">
            <div className="flex items-center gap-2">
              <Wifi className="w-5 h-5" /> Wi-Fi
            </div>
            <div className="flex items-center gap-2">
              <Plug className="w-5 h-5" /> Power
            </div>
            <div className="flex items-center gap-2">
              <Coffee className="w-5 h-5" /> Coffee
            </div>
            <div className="flex items-center gap-2">
              <Car className="w-5 h-5" /> Parking
            </div>
          </div>

          {/* Reactions */}
          <div className="mt-6 text-sm">
            <p className="text-gray-600">How do you feel?</p>
            <div className="flex gap-4 mt-2 text-2xl">
              <span className="cursor-pointer">💡</span>
              <span className="cursor-pointer">👍</span>
              <span className="cursor-pointer">😊</span>
              <span className="cursor-pointer">😲</span>
              <span className="cursor-pointer">😡</span>
            </div>
          </div>
        </div>

        {/* Right column (map + location) */}
        <div className="col-span-1 space-y-4">
          <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
            Map placeholder
          </div>

          <div>
            <h2 className="font-bold text-lg">{mockData.title}</h2>
            <p className="text-gray-600 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#6B4F37]" />
              {mockData.address}
            </p>
            <button
              onClick={() =>
                window.open(`https://maps.google.com?q=${mockData.address}`)
              }
              className="mt-2 bg-[#6B4F37] text-white px-4 py-2 rounded-lg hover:bg-[#4E2F1C]"
            >
              Get directions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
