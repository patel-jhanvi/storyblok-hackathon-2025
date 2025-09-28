export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16 py-8">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="space-y-4">
          {/* Event Info */}
          <div className="text-lg font-medium text-gray-700">
            Storyblok × Code & Coffee Hackathon 2025
          </div>

          {/* Creators */}
          <div className="text-sm text-gray-600">
            Created by{" "}
            <a
              href="https://ernestosoftware.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline decoration-blue-300 hover:decoration-blue-600 underline-offset-2 transition-all duration-200 hover:scale-105 inline-block"
            >
              Ernesto Martinez
            </a>{" "}
            &{" "}
            <a
              href="https://jhanvi-patel.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline decoration-blue-300 hover:decoration-blue-600 underline-offset-2 transition-all duration-200 hover:scale-105 inline-block"
            >
              Jhanvi Patel
            </a>
          </div>

          {/* Tech Stack & Links */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-gray-500">
            <span>Powered by Storyblok + Algolia</span>
            <span className="hidden sm:inline">·</span>
            <a
              href="https://github.com/patel-jhanvi/storyblok-hackathon-2025/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline decoration-blue-300 hover:decoration-blue-600 underline-offset-2 transition-all duration-200 hover:scale-105 inline-block"
            >
              GitHub Repo
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}