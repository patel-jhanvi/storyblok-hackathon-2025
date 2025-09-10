import Card from "../ui/Card";

const mockData = [
  { title: "Caffeine Hub", description: "Cozy café with WiFi", image: "/next.svg" },
  { title: "Code & Coffee Meetup", description: "Weekly dev meetup", image: "/vercel.svg" },
  { title: "Study Loft", description: "Quiet spot for long hours", image: "/globe.svg" }
];

export default function CardGrid() {
  return (
    <section className="p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Featured Spots</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockData.map((item, index) => (
          <Card key={index} {...item} />
        ))}
      </div>
    </section>
  );
}
