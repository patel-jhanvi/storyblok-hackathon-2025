import Card from "../ui/Card";

const mockData = [
  {
    type: "cafe" as const,
    title: "Caffeine Hub",
    summary: "A cozy café with reliable Wi-Fi and plenty of outlets.",
    image: "/images/cafe.png",
    metadata: ["📶 Wi-Fi", "🔌 Power", "🔊 Quiet"],
  },
  {
    type: "meetup" as const,
    title: "Code & Coffee Meetup",
    summary: "Weekly developer meetup for networking & hacking.",
    image: "/images/meetup.png",
    metadata: ["📅 Sun, Aug 21", "👤 Tech SF", "💵 Free"],
  },
  {
    type: "study" as const,
    title: "Study Loft",
    summary: "Quiet study spot with natural light and group seating.",
    image: "/images/study.png",
    metadata: ["🪑 Spacious", "🔊 Quiet", "⏰ 8am–10pm"],
  },
];

export default function CardGrid() {
  return (
    <section className="p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockData.map((item, index) => (
          <Card key={index} {...item} />
        ))}
      </div>
    </section>
  );
}
