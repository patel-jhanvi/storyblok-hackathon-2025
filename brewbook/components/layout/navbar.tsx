export default function Navbar() {
    return (
      <nav className="w-full h-16 bg-white flex items-center justify-between px-6 shadow-sm">
        {/* Left: Logo */}
        <div className="flex items-center">
          <img
            src="/logos/brewbook-logo.png"
            alt="Brewbook Logo"
            className="h-12 w-auto"
          />
        </div>
  
        {/* Center: Pill Navigation */}
        <div className="flex justify-center flex-1">
          <div className="flex border border-gray-200 rounded-full bg-white">
            <button className="px-5 py-2 text-gray-800 text-sm font-medium hover:bg-gray-50 rounded-l-full">
              Meetups
            </button>
            <button className="px-5 py-2 text-gray-800 text-sm font-medium hover:bg-gray-50">
              Cafés
            </button>
            <button className="px-5 py-2 text-gray-800 text-sm font-medium hover:bg-gray-50 rounded-r-full">
              Study Spots
            </button>
          </div>
        </div>
  
        {/* Right: Empty for now */}
        <div className="w-16" />
      </nav>
    );
  }
  