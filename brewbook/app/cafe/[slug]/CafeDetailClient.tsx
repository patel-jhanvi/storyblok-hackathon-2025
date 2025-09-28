"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { MapPin } from "lucide-react";
import Overview from "@/components/cafe/Overview";
import { useState } from "react";
import { ComponentLoadingScreen } from "@/components/ui/LoadingScreen";
import FloatingBackButton from "@/components/ui/FloatingBackButton";
import { geocodeAddress } from "@/lib/utils/geocode";

// Dynamically import MapBlock only on client
const MapBlock = dynamic(() => import("@/components/blocks/Map"), {
    ssr: false,
    loading: () => <ComponentLoadingScreen message="Loading map..." />
});

interface Cafe {
  image?: string;
  title: string;
  type: string;
  summary: string;
  amenities: string[];
  address: string;
}

export default function CafeDetailClient({ cafe }: { cafe: Cafe }) {
    const [activeTab, setActiveTab] = useState<"overview" | "reviews">("overview");
    const [reviews, setReviews] = useState([
        { name: "Alice", text: "Loved the vibe and coffee!", rating: 5 },
        { name: "Bob", text: "Great WiFi, perfect for study.", rating: 4 },
    ]);
    const [newReview, setNewReview] = useState({ name: "", text: "", rating: 5 });

    const handleAddReview = () => {
        if (!newReview.name || !newReview.text) return;
        setReviews([...reviews, newReview]);
        setNewReview({ name: "", text: "", rating: 5 });
    };

    const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });
    const [isGeocoding, setIsGeocoding] = useState(true);

    useEffect(() => {
        async function getCoordinates() {
            if (cafe.address) {
                try {
                    const coords = await geocodeAddress(cafe.address);
                    setCoordinates({
                        lat: coords.lat ?? 0,
                        lng: coords.lng ?? 0
                    });
                } catch (error) {
                    console.error("Failed to geocode address:", error);
                    setCoordinates({ lat: 0, lng: 0 });
                }
            }
            setIsGeocoding(false);
        }

        getCoordinates();
    }, [cafe.address]);
    return (
        <div className="min-h-screen bg-[#FAF9F6]">
            <FloatingBackButton label="Back to Home" />

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
                        <button
                            onClick={() => setActiveTab("overview")}
                            className={`pb-2 ${activeTab === "overview"
                                ? "font-semibold text-[#6B4F37] border-b-2 border-[#6B4F37]"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab("reviews")}
                            className={`pb-2 ${activeTab === "reviews"
                                ? "font-semibold text-[#6B4F37] border-b-2 border-[#6B4F37]"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Reviews
                        </button>
                    </div>

                    {/* Content by Tab */}
                    {activeTab === "overview" && (
                        <Overview summary={cafe.summary} amenities={cafe.amenities} />
                    )}

                    {activeTab === "reviews" && (
                        <div className="space-y-4">
                            {/* Existing Reviews */}
                            {reviews.map((r, i) => (
                                <div
                                    key={i}
                                    className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white"
                                >
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold text-gray-800">{r.name}</p>
                                        <p className="text-yellow-500 text-sm">
                                            {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                                        </p>
                                    </div>
                                    <p className="text-gray-600 mt-1">{r.text}</p>
                                </div>
                            ))}

                            {/* Add Review Form */}
                            <div className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white space-y-3">
                                <input
                                    type="text"
                                    placeholder="Your name"
                                    value={newReview.name}
                                    onChange={(e) =>
                                        setNewReview({ ...newReview, name: e.target.value })
                                    }
                                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-1 focus:ring-[#6B4F37]"
                                />
                                <textarea
                                    placeholder="Write your review..."
                                    value={newReview.text}
                                    onChange={(e) =>
                                        setNewReview({ ...newReview, text: e.target.value })
                                    }
                                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-1 focus:ring-[#6B4F37]"
                                />
                                <div className="flex items-center gap-3">
                                    <select
                                        value={newReview.rating}
                                        onChange={(e) =>
                                            setNewReview({ ...newReview, rating: Number(e.target.value) })
                                        }
                                        className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-1 focus:ring-[#6B4F37]"
                                    >
                                        {[5, 4, 3, 2, 1].map((star) => (
                                            <option key={star} value={star}>
                                                {star} Stars
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={handleAddReview}
                                        className="bg-[#6B4F37] text-white px-4 py-2 rounded hover:bg-[#553320]"
                                    >
                                        Submit Review
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right column */}
                <div className="col-span-1 space-y-4">
                    {isGeocoding ? (
                        <ComponentLoadingScreen message="Loading location..." />
                    ) : (
                        <MapBlock
                            lat={coordinates.lat}
                            lng={coordinates.lng}
                            title={cafe.title}
                            address={cafe.address}
                        />
                    )}

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
                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                cafe.address || `${coordinates.lat},${coordinates.lng}`
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
        </div>
    );
}
