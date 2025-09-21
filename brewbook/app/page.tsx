import Hero from "@/components/blocks/Hero";
import FiltersBar from "@/components/search/FiltersBar";
import CardGrid from "@/components/blocks/CardGrid";

export default function Home() {
  return (
    <main>

      <Hero />
      <div className="mt-12">
        <FiltersBar />
      </div>
      <CardGrid />
    </main>
  );
}
