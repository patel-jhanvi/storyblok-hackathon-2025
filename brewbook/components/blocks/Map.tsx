"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { MapLoadingScreen } from "../ui/LoadingScreen";

interface MapProps {
    lat?: number;
    lng?: number;
    title: string;
    address?: string;
}

export default function MapBlock({ lat, lng, title, address }: MapProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [isIframeLoading, setIsIframeLoading] = useState(true);

    useEffect(() => {
        // Simulate map loading time for Leaflet maps
        if (lat && lng) {
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [lat, lng]);

    // If geocoding failed, fallback to Google Maps embed with address or title
    if (!lat || !lng) {
        return (
            <div className="relative w-full h-[700px] rounded-lg overflow-hidden">
                {isIframeLoading && <MapLoadingScreen />}
                <iframe
                    width="100%"
                    height="700"
                    className="rounded-lg"
                    loading="lazy"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(
                        address || title
                    )}&output=embed`}
                    onLoad={() => setIsIframeLoading(false)}
                />
            </div>
        );
    }

    return (
        <div className="relative w-full h-[700px] rounded-lg overflow-hidden">
            {isLoading && <MapLoadingScreen />}
            <MapContainer
                center={[lat, lng]}
                zoom={15}
                className="w-full h-[700px] rounded-lg"
                whenReady={() => setIsLoading(false)}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <Marker position={[lat, lng]}>
                    <Popup>
                        <strong>{title}</strong>
                        {address && <p>{address}</p>}
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}
