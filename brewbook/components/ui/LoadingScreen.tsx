"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
  overlay?: boolean;
}

export default function LoadingScreen({
  message = "Brewing something special...",
  fullScreen = false,
  overlay = false
}: LoadingScreenProps) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const containerClass = fullScreen
    ? "fixed inset-0 z-50 flex items-center justify-center bg-[#FAF9F6]"
    : overlay
    ? "absolute inset-0 z-40 flex items-center justify-center bg-[#FAF9F6]/90 backdrop-blur-sm"
    : "flex items-center justify-center py-16";

  return (
    <div className={containerClass}>
      <div className="text-center">
        {/* Coffee Pot Animation Container */}
        <div className="relative mb-8">
          {/* Subtle background circle with gradient */}
          <div className="absolute inset-0 -m-8 bg-gradient-to-br from-[#6B4026]/10 to-[#A9745B]/10 rounded-full blur-xl"></div>

          {/* Main coffee pot container */}
          <div className="relative bg-white/50 backdrop-blur-sm rounded-full p-8 shadow-lg border border-white/20">
            <Image
              src="/coffee-pot.gif"
              alt="Loading..."
              width={120}
              height={120}
              className="mx-auto"
              priority
              unoptimized
            />

            {/* Floating steam particles */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 h-1 bg-[#6B4026]/30 rounded-full animate-bounce"
                    style={{
                      animationDelay: `${i * 0.2}s`,
                      animationDuration: '1.5s'
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Outer glow ring */}
          <div className="absolute inset-0 -m-4 rounded-full border-2 border-[#6B4026]/20 animate-pulse"></div>
        </div>

        {/* Loading Text */}
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-[#6B4026] font-berkshire">
            {message.split(' ').slice(0, -1).join(' ')}
            <span className="text-[#A9745B]"> {message.split(' ').slice(-1)}</span>
            <span className="text-[#6B4026]">{dots}</span>
          </h3>

          {/* Subtitle with coffee quotes */}
          <p className="text-sm text-gray-600 max-w-xs mx-auto leading-relaxed">
            Great coffee takes time, just like great experiences
          </p>

          {/* Animated progress indicator */}
          <div className="flex justify-center mt-6">
            <div className="flex space-x-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-[#6B4026] rounded-full animate-pulse"
                  style={{
                    animationDelay: `${i * 0.3}s`,
                    animationDuration: '1.5s'
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Specific loading variants for different use cases
export function MapLoadingScreen() {
  return (
    <LoadingScreen
      message="Mapping coffee spots..."
      overlay={true}
    />
  );
}

export function PageLoadingScreen() {
  return (
    <LoadingScreen
      message="Brewing your experience..."
      fullScreen={true}
    />
  );
}

export function ComponentLoadingScreen({ message }: { message?: string }) {
  return (
    <LoadingScreen
      message={message || "Loading content..."}
      fullScreen={false}
      overlay={false}
    />
  );
}