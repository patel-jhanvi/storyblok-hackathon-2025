"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface MapProps {
    lat?: number;
    lng?: number;
    title: string;
    address?: string;
}

export default function MapBlock({ lat, lng, title, address }: MapProps) {
    // If geocoding failed, fallback to Google Maps embed with address or title
    if (!lat || !lng) {
        return (
            <iframe
                width="100%"
                height="700"
                className="rounded-lg"
                loading="lazy"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                    address || title
                )}&output=embed`}
            />
        );
    }

    return (
        <MapContainer
            center={[lat, lng]}
            zoom={15}
            className="w-full h-[700px] rounded-lg"
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
    );
}
