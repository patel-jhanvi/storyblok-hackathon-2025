"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Tag,
  Share,
  Heart,
  Download
} from "lucide-react";
import { ComponentLoadingScreen } from "@/components/ui/LoadingScreen";
import FloatingBackButton from "@/components/ui/FloatingBackButton";
import { render } from "storyblok-rich-text-react-renderer";
import { geocodeAddress } from "@/lib/utils/geocode";

// Dynamically import MapBlock only on client
const MapBlock = dynamic(() => import("@/components/blocks/Map"), {
    ssr: false,
    loading: () => <ComponentLoadingScreen message="Loading map..." />
});

interface EventDetailClientProps {
  event: {
    title: string;
    type: string;
    description?: Record<string, unknown>;
    summary: string;
    image: string;
    location?: string;
    date?: string;
    time?: string;
    price?: string;
    organizer?: string;
    tags?: string;
    amenities?: string[];
  };
}

export default function EventDetailClient({ event }: EventDetailClientProps) {
    const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });
    const [isGeocoding, setIsGeocoding] = useState(true);

    useEffect(() => {
        async function getCoordinates() {
            if (event.location) {
                try {
                    const coords = await geocodeAddress(event.location);
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
    }, [event.location]);
    const eventDate = event.date ? new Date(event.date) : null;
    const tagList = event.tags ? event.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];

    return (
        <div className="min-h-screen bg-[#FAF9F6]">
            <FloatingBackButton label="Back to Home" />

            {/* Hero Section */}
            <div className="relative h-96 mb-8">
                <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Floating Action Buttons */}
                <div className="absolute top-6 right-6 flex gap-3">
                    <button className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors">
                        <Share className="w-5 h-5 text-gray-700" />
                    </button>
                    <button className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors">
                        <Heart className="w-5 h-5 text-gray-700" />
                    </button>
                </div>

                {/* Hero Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="max-w-4xl">
                        <span className="inline-block px-4 py-2 rounded-full bg-[#82B0D8] text-white text-sm font-medium mb-4">
                            {event.type?.toUpperCase() || 'EVENT'}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-berkshire">
                            {event.title}
                        </h1>
                        {eventDate && (
                            <div className="flex items-center text-white/90 text-lg">
                                <Calendar className="w-5 h-5 mr-2" />
                                {eventDate.toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                                {event.time && (
                                    <>
                                        <Clock className="w-5 h-5 ml-6 mr-2" />
                                        {event.time}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Event Info Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Date & Time Card */}
                            {eventDate && (
                                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                    <div className="flex items-center mb-3">
                                        <div className="p-2 bg-[#82B0D8]/10 rounded-lg">
                                            <Calendar className="w-5 h-5 text-[#82B0D8]" />
                                        </div>
                                        <h3 className="text-lg font-semibold ml-3">When</h3>
                                    </div>
                                    <p className="text-gray-700 font-medium">
                                        {eventDate.toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </p>
                                    {event.time && (
                                        <p className="text-gray-600 mt-1">{event.time}</p>
                                    )}
                                </div>
                            )}

                            {/* Location Card */}
                            {event.location && (
                                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                    <div className="flex items-center mb-3">
                                        <div className="p-2 bg-[#82B0D8]/10 rounded-lg">
                                            <MapPin className="w-5 h-5 text-[#82B0D8]" />
                                        </div>
                                        <h3 className="text-lg font-semibold ml-3">Where</h3>
                                    </div>
                                    <p className="text-gray-700">{event.location}</p>
                                </div>
                            )}

                            {/* Price Card */}
                            {event.price && (
                                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                    <div className="flex items-center mb-3">
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <DollarSign className="w-5 h-5 text-green-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold ml-3">Price</h3>
                                    </div>
                                    <p className="text-gray-700 font-medium">{event.price}</p>
                                </div>
                            )}

                            {/* Organizer Card */}
                            {event.organizer && (
                                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                    <div className="flex items-center mb-3">
                                        <div className="p-2 bg-purple-100 rounded-lg">
                                            <Users className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold ml-3">Organizer</h3>
                                    </div>
                                    <p className="text-gray-700">{event.organizer}</p>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">About This Event</h2>
                            {event.description ? (
                                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                                    {render(event.description)}
                                </div>
                            ) : (
                                <p className="text-gray-700 leading-relaxed text-lg">
                                    {event.summary}
                                </p>
                            )}
                        </div>

                        {/* Tags */}
                        {tagList.length > 0 && (
                            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                    <Tag className="w-5 h-5 mr-2" />
                                    Tags
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {tagList.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-4 py-2 bg-[#82B0D8]/10 text-[#82B0D8] rounded-full text-sm font-medium hover:bg-[#82B0D8]/20 transition-colors cursor-pointer"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Map */}
                        {event.location && (
                            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                                <div className="h-64">
                                    {isGeocoding ? (
                                        <ComponentLoadingScreen message="Loading location..." />
                                    ) : (
                                        <MapBlock
                                            lat={coordinates.lat}
                                            lng={coordinates.lng}
                                            title={event.title}
                                            address={event.location}
                                        />
                                    )}
                                </div>
                                <div className="p-6">
                                    <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                                    <button
                                        onClick={() => {
                                            window.open(
                                                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                                    event.location || `${coordinates.lat},${coordinates.lng}`
                                                )}`,
                                                '_blank',
                                                'noopener,noreferrer'
                                            );
                                        }}
                                        className="w-full bg-[#82B0D8] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#6B9BD1] transition-colors flex items-center justify-center gap-2"
                                    >
                                        <MapPin className="w-4 h-4" />
                                        Get Directions
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
                            <button className="w-full bg-[#6B4026] text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-[#4E2F1C] transition-colors">
                                Register for Event
                            </button>
                            <button className="w-full border-2 border-[#6B4026] text-[#6B4026] py-3 px-6 rounded-lg font-medium hover:bg-[#6B4026] hover:text-white transition-colors flex items-center justify-center gap-2">
                                <Download className="w-4 h-4" />
                                Add to Calendar
                            </button>
                        </div>

                        {/* Event Stats */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h3 className="font-bold text-lg mb-4">Event Details</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Event Type</span>
                                    <span className="font-medium">{event.type || 'Event'}</span>
                                </div>
                                {eventDate && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Date</span>
                                        <span className="font-medium">{eventDate.toLocaleDateString()}</span>
                                    </div>
                                )}
                                {event.price && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Price</span>
                                        <span className="font-medium text-green-600">{event.price}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}