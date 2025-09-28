"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { MapPin } from "lucide-react";
import Overview from "@/components/cafe/Overview";

// Dynamically import MapBlock only on client
const MapBlock = dynamic(() => import("@/components/blocks/Map"), {
    ssr: false,
});

export default function CafeDetailClient({ cafe }: { cafe: any }) {
    return (
        <div className="p-8">
            <div className="grid grid-cols-3 gap-8">
                {/* Left column */}
                <div className="col-span-2 space-y-6">
                    {/* Hero Image */}
                    {cafe.image && (
                        <Image
                            src={cafe.image}
                            alt={cafe.title}
                            width={800}
                            height={400}
                            className="w-full h-64 object-cover rounded-lg"
                        />
                    )}

                    {/* Title + Type */}
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{cafe.title}</h1>
                        <span className="mt-2 inline-block px-3 py-1 rounded-full bg-[#EADDC8] text-[#6B4F37] text-sm font-medium">
                            {cafe.type}
                        </span>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-6 border-b text-sm">
                        <button className="font-semibold text-[#6B4F37] border-b-2 border-[#6B4F37] pb-2">
                            Overview
                        </button>
                        <button className="text-gray-500 hover:text-gray-700">Reviews</button>
                        <button className="text-gray-500 hover:text-gray-700">Price</button>
                        <button className="text-gray-500 hover:text-gray-700">Photos</button>
                    </div>

                    {/* Overview Section */}
                    <Overview summary={cafe.summary} amenities={cafe.amenities} />
                </div>

                {/* Right column */}
                <div className="col-span-1 space-y-4">
                    <MapBlock
                        lat={cafe.lat}
                        lng={cafe.lng}
                        title={cafe.title}
                        address={cafe.address}
                    />

                    <div>
                        <h2 className="font-bold text-lg">{cafe.title}</h2>
                        <div className="text-gray-600 flex items-center gap-2">
                            <button
                                onClick={() =>
                                    window.open(
                                        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                            cafe.address || `${cafe.lat},${cafe.lng}`
                                        )}`,
                                        "_blank"
                                    )
                                }
                                className="flex items-center gap-2 text-left"
                            >
                                <MapPin className="w-4 h-4 text-[#6B4F37]" />
                                {cafe.address}
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
