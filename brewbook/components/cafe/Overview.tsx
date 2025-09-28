"use client";

import { IconMap } from "@/components/ui/IconMap";

interface OverviewProps {
    summary: string;
    amenities: string[];
}

export default function Overview({ summary, amenities }: OverviewProps) {
    return (
        <div className="mt-6">
            {/* Summary */}
            <p className="text-base text-gray-700 leading-relaxed">{summary}</p>

            {/* Amenities */}
            {amenities?.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Amenities
                    </h3>
                    <div className="flex flex-wrap gap-4">
                        {amenities.map((item, idx) => {
                            const Icon = IconMap[item.toLowerCase()];
                            return Icon ? (
                                <div
                                    key={idx}
                                    className="flex items-center gap-2 bg-[#FAF9F6] px-3 py-2 rounded-lg shadow-sm"
                                >
                                    <Icon className="w-5 h-5 text-[#6B4F37]" />
                                    <span className="text-sm text-gray-700 capitalize">
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
                </div>
            )}
        </div>
    );
}
