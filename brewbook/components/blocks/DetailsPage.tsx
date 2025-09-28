import Map from "./Map";
import { IconMap } from "@/components/ui/IconMap";


interface DetailPageProps {
    title: string;
    type: "cafe" | "study" | "event";
    aiSummary: string;
    photos: string[];
    amenities: string[];
    address?: string;
    lat?: number;
    lng?: number;
    reviews?: Array<{ text: string }>;
    price?: string;
}

export default function DetailPage({
    title,
    type,
    aiSummary,
    photos,
    amenities,
    address,
    lat,
    lng,
    reviews,
}: DetailPageProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-6 py-10">
            {/* LEFT COLUMN */}
            <div className="col-span-2 space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                    <span className="inline-block mt-2 rounded-full px-3 py-1 text-sm text-white bg-[#6B4F37]">
                        {type.toUpperCase()}
                    </span>
                </div>

                {/* AI Summary */}
                <p className="text-base text-gray-700 leading-relaxed">{aiSummary}</p>

                {/* Photos */}
                <div className="grid grid-cols-3 gap-2">
                    {photos.map((src, i) => (
                        <img
                            key={i}
                            src={src}
                            alt={`${title} photo ${i + 1}`}
                            className="rounded-lg object-cover h-32 w-full"
                        />
                    ))}
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-4 mt-4">
                    {amenities.map((a, i) => (
                        <div key={i} className="flex items-center gap-2">
                            {IconMap[a]} <span className="sr-only">{a}</span>
                        </div>
                    ))}
                </div>

                {/* Reviews */}
                {reviews && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Reviews</h2>
                        {reviews.map((r, i) => (
                            <div key={i} className="border rounded-lg p-3">
                                <p className="text-gray-700">{r.text}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* RIGHT COLUMN */}
            <div className="col-span-1 space-y-4">
                <Map lat={lat} lng={lng} title={title} />
                {address && (
                    <div className="space-y-2">
                        <p className="flex items-center gap-2 text-gray-700">
                            📍 {address}
                        </p>
                        <a
                            href={`https://maps.google.com?q=${lat},${lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full text-center bg-[#6B4F37] text-white rounded-lg px-4 py-2 hover:bg-[#4E2F1C]"
                        >
                            Get Directions
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
