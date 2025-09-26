"use client";
import { useState } from "react";
import { MapPin } from "lucide-react";

export default function SearchBar() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const handleUseLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`Lat: ${latitude.toFixed(2)}, Lng: ${longitude.toFixed(2)}`);
        },
        () => alert("Could not fetch location.")
      );
    }
  };

  return (
    <div className="flex items-center justify-center mt-6">
      <div className="flex w-full max-w-3xl h-16 rounded-full border border-gray-300 bg-white shadow-md overflow-hidden items-center">

        {/* Keyword input */}
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search cafés, events, study spots..."
          className="flex-grow px-4 text-gray-700 placeholder-gray-400 focus:outline-none"
        />

        {/* Divider */}
        <div className="w-px h-6 bg-gray-300"></div>

        {/* Location input */}
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="City, State, or ZIP"
          className="w-40 px-3 text-gray-700 placeholder-gray-400 focus:outline-none"
        />
        <button
          onClick={handleUseLocation}
          className="px-2 text-[#6B4026] hover:text-[#4E2F1C]"
          title="Use my location"
        >
          <MapPin className="w-4 h-4" />
        </button>

        {/* Search button */}
        <button className="h-full px-6 bg-[#6B4026] text-white font-semibold hover:bg-[#4E2F1C]">
          Search
        </button>
      </div>
    </div>
  );
}
