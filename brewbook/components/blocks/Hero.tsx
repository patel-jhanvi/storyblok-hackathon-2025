
import SearchBar from "../search/SearchBar";


export default function Hero() {
  return (
    <section className="relative bg-[#FAF9F6] py-16 text-center">
      <h1 className="text-5xl font-bold text-[#6B4026]">
        Code & Coffee’s smarter city guide
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        Find cafés, study spots, and meetups near you.
      </p>

      {/* floating search bar */}
      <div className="absolute left-1/2 bottom-[-32px] transform -translate-x-1/2 w-full max-w-2xl">
        <SearchBar />
      </div>
    </section>
  );
}

