interface MapProps {
    lat?: number;
    lng?: number;
    title: string;
}

export default function Map({ lat, lng, title }: MapProps) {
    if (!lat || !lng) {
        return <div className="h-64 bg-gray-100 rounded-lg">Map coming soon</div>;
    }

    return (
        <iframe
            title={title}
            width="100%"
            height="250"
            className="rounded-lg"
            loading="lazy"
            src={`https://www.google.com/maps?q=${lat},${lng}&output=embed`}
        />
    );
}
