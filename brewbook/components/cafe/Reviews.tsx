"use client";

export default function Reviews() {
    // Temporary placeholder until Storyblok / DB integration
    const reviews = [
        { user: "Alice", comment: "Loved the vibe and coffee!", rating: 5 },
        { user: "Bob", comment: "Nice spot for study, WiFi was great.", rating: 4 },
    ];

    return (
        <div className="mt-6 space-y-4">
            {reviews.map((review, idx) => (
                <div
                    key={idx}
                    className="p-4 border rounded-lg bg-white shadow-sm space-y-1"
                >
                    <p className="font-semibold text-gray-800">{review.user}</p>
                    <p className="text-sm text-gray-600">{review.comment}</p>
                    <p className="text-yellow-500">{"★".repeat(review.rating)}</p>
                </div>
            ))}
        </div>
    );
}
