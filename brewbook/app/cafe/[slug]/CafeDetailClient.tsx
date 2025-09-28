"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { MapPin, Wifi, Plug, Coffee, Car } from "lucide-react";

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
                    {cafe.image && (
                        <Image
                            src={cafe.image}
                            alt={cafe.title}
                            width={800}
                            height={400}
                            className="w-full h-64 object-cover rounded-lg"
                        />
                    )}

                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{cafe.title}</h1>
                        <span className="mt-2 inline-block px-3 py-1 rounded-full bg-[#EADDC8] text-[#6B4F37] text-sm font-medium">
                            {cafe.type}
                        </span>
                    </div>

                    <p className="text-base text-gray-700 leading-relaxed">{cafe.summary}</p>

                    {/* Tabs */}
                    <div className="flex gap-6 border-b text-sm">
                        <button className="font-semibold text-[#6B4F37] border-b-2 border-[#6B4F37] pb-2">
                            Overview
                        </button>
                        <button className="text-gray-500 hover:text-gray-700">Reviews</button>
                        <button className="text-gray-500 hover:text-gray-700">Price</button>
                        <button className="text-gray-500 hover:text-gray-700">Photos</button>
                    </div>

                    {/* Amenities */}
                    <div className="flex gap-6 mt-4 text-[#6B4F37]">
                        {cafe.amenities.includes("wifi") && (
                            <div className="flex items-center gap-2">
                                <Wifi className="w-5 h-5" /> Wi-Fi
                            </div>
                        )}
                        {cafe.amenities.includes("power") && (
                            <div className="flex items-center gap-2">
                                <Plug className="w-5 h-5" /> Power
                            </div>
                        )}
                        {cafe.amenities.includes("coffee") && (
                            <div className="flex items-center gap-2">
                                <Coffee className="w-5 h-5" /> Coffee
                            </div>
                        )}
                        {cafe.amenities.includes("parking") && (
                            <div className="flex items-center gap-2">
                                <Car className="w-5 h-5" /> Parking
                            </div>
                        )}
                    </div>
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
                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                cafe.address || `${cafe.lat},${cafe.lng}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 flex items-center gap-2 hover:text-blue-600"
                        >
                            <MapPin className="w-4 h-4 text-[#6B4F37]" />
                            {cafe.address}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
