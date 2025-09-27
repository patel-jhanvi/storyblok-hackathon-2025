// lib/utils/geocode.ts
export async function geocodeAddress(address: string) {
    if (!address) return { lat: undefined, lng: undefined };

    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`,
            { headers: { "User-Agent": "brewbook-app" } }
        );
        const data = await res.json();
        if (data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
            };
        }
    } catch (err) {
        console.error("Geocoding failed:", err);
    }

    return { lat: undefined, lng: undefined };
}
