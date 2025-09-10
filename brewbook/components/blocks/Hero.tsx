import Hero from "@/components/blocks/Hero";

export default function Home() {
  return (
    <section className="bg-gray-100 py-16 text-center">
      <h1 className="text-5xl font-bold">Brewbook: City Guide for Devs</h1>
      <p className="mt-6 text-lg text-gray-700">
        Discover cafés, study spots, and meetups — AI-powered, search-enabled.
      </p>
      <button className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700">
        Start Exploring
      </button>
    </section>
    
  );
}
