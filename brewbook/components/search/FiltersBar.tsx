"use client";
import { useState, useEffect, useRef } from "react";

export default function FiltersBar() {
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [openNow, setOpenNow] = useState(false);

  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpenFilter(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Dropdown renderer
  const Dropdown = ({ name, options }: { name: string; options: string[] }) => (
    <div className="relative">
      <button
        onClick={() => setOpenFilter(openFilter === name ? null : name)}
        className={`flex items-center gap-1 ${selected[name] && selected[name] !== "Any" && selected[name] !== "All"
          ? "text-[#6B4026] font-medium"
          : "text-gray-700"
          }`}
      >
        {name} ▾
      </button>
      {openFilter === name && (
        <div className="absolute top-8 left-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 w-48">
          {options.map((option) => (
            <div
              key={option}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${selected[name] === option ? "bg-[#FAF9F6] font-medium" : ""
                }`}
              onClick={() => {
                setSelected((prev) => ({ ...prev, [name]: option }));
                setOpenFilter(null);
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div ref={wrapperRef} className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-center gap-6 py-3 text-sm text-gray-700">

        <Dropdown name="Type" options={["All", "Café", "Study Spot", "Meetup"]} />
        <Dropdown name="Seating" options={["Any", "Solo", "Groups", "Outdoors", "Standing"]} />
        <Dropdown name="Power Outlets" options={["Any", "None", "Few", "Many"]} />
        <Dropdown name="Noise Level" options={["Any", "Quiet", "Moderate", "Loud"]} />
        <Dropdown name="Tags" options={["Networking", "Tech", "Workshop", "AI", "Student-friendly"]} />
        <Dropdown name="Amenities" options={["Coffee", "Food", "Restrooms", "Parking nearby", "Wi-Fi"]} />
        <Dropdown name="Vibe" options={["Cozy", "Modern", "Bright", "Quiet"]} />
        <Dropdown name="Accessibility" options={["Wheelchair accessible", "Pet friendly"]} />
        <Dropdown name="Date/Time" options={["Any", "Today", "Tomorrow", "This Weekend", "Pick a date"]} />
        <Dropdown name="Host" options={["Any", "Organization", "Individual"]} />
        <Dropdown name="Price" options={["Any", "Free", "Paid"]} />

        {/* Open Now */}
        <label
          className={`flex items-center gap-2 cursor-pointer ${openNow ? "text-[#6B4026] font-medium" : "text-gray-700"
            }`}
        >
          <input
            type="checkbox"
            checked={openNow}
            onChange={() => setOpenNow(!openNow)}
            className="w-4 h-4 text-[#6B4026] focus:ring-[#6B4026]"
          />
          Open Now
        </label>
      </div>
    </div>
  );
}
