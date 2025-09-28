"use client";

import { ArrowLeft } from "lucide-react";

interface FloatingBackButtonProps {
  label?: string;
  onClick?: () => void;
}

export default function FloatingBackButton({
  label = "Back",
  onClick
}: FloatingBackButtonProps) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      window.history.back();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:shadow-xl hover:bg-white transition-all duration-200 border border-white/20"
    >
      <ArrowLeft className="w-5 h-5 text-gray-700" />
      <span className="text-gray-700 font-medium">{label}</span>
    </button>
  );
}