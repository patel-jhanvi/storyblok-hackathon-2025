
import { storyblokEditable } from "@storyblok/react";
import AlgoliaSearch from "../search/AlgoliaSearch";

interface HeroProps {
  blok?: {
    _uid: string;
    component: string;
    headline?: string;
    subtitle?: string;
  };
}

export default function Hero({ blok }: HeroProps) {
  return (
    <section
      {...(blok ? storyblokEditable(blok) : {})}
      className="relative pt-8 pb-16 text-center z-[9999]"
    >
      {/* Logo */}
      <div className="mb-4">
        <img
          src="/logos/brewbook-logo.png"
          alt="Brewbook Logo"
          className="h-32 w-96 mx-auto object-cover object-center"
        />
      </div>

      <h1 className="text-5xl font-bold text-[#6B4026]">
        {blok?.headline || "Code & Coffee's smarter city guide"}
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        {blok?.subtitle || "Find cafés, study spots, and meetups near you."}
      </p>

      {/* floating search bar */}
      <div className="absolute left-1/2 bottom-[-32px] transform -translate-x-1/2 w-full max-w-2xl">
        <AlgoliaSearch isHeroMode={true} />
      </div>
    </section>
  );
}

