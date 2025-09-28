"use client";

import { useRefinementList, useCurrentRefinements } from 'react-instantsearch';
import { Wifi, Zap, Volume2, DollarSign, X } from 'lucide-react';

interface FilterButtonProps {
  label: string;
  count?: number;
  isRefined: boolean;
  onRefine: () => void;
  icon?: React.ReactNode;
}

function FilterButton({ label, count, isRefined, onRefine, icon }: FilterButtonProps) {
  return (
    <button
      onClick={onRefine}
      className={`
        flex items-center gap-2 px-4 py-3 rounded-full border-2 transition-all duration-300 transform hover:scale-105 active:scale-95
        ${isRefined
          ? 'bg-[#6B4026] text-white border-[#6B4026] shadow-lg ring-2 ring-[#6B4026]/20'
          : 'bg-white/80 backdrop-blur-sm text-gray-700 border-gray-200 hover:border-[#6B4026] hover:text-[#6B4026] hover:bg-white hover:shadow-md'
        }
      `}
    >
      {icon}
      <span className="font-semibold text-sm">{label}</span>
      {count !== undefined && count > 0 && (
        <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold min-w-[24px] text-center ${
          isRefined
            ? 'bg-white/25 text-white'
            : 'bg-[#6B4026]/10 text-[#6B4026]'
        }`}>
          {count}
        </span>
      )}
    </button>
  );
}

function WorkFriendlyFilter() {
  const { items: wifiItems, refine: refineWifi } = useRefinementList({
    attribute: 'wifi',
  });
  const { items: powerItems, refine: refinePower } = useRefinementList({
    attribute: 'power_outlets',
  });

  // Find the "true" items for both attributes
  const wifiTrueItem = wifiItems.find(item => item.label === 'true');
  const powerTrueItem = powerItems.find(item => item.label === 'true');

  // Check if both are selected
  const bothSelected = !!(wifiTrueItem?.isRefined && powerTrueItem?.isRefined);
  const anySelected = !!(wifiTrueItem?.isRefined || powerTrueItem?.isRefined);

  const handleToggle = () => {
    if (bothSelected) {
      // Unselect both
      if (wifiTrueItem?.isRefined) refineWifi(wifiTrueItem.value);
      if (powerTrueItem?.isRefined) refinePower(powerTrueItem.value);
    } else if (anySelected) {
      // If one is selected, select both
      if (wifiTrueItem && !wifiTrueItem.isRefined) refineWifi(wifiTrueItem.value);
      if (powerTrueItem && !powerTrueItem.isRefined) refinePower(powerTrueItem.value);
    } else {
      // Select both from unselected state
      if (wifiTrueItem) refineWifi(wifiTrueItem.value);
      if (powerTrueItem) refinePower(powerTrueItem.value);
    }
  };

  // Calculate intersecting count (places that have both wifi AND power)
  const count = Math.min(wifiTrueItem?.count || 0, powerTrueItem?.count || 0);

  return (
    <FilterButton
      label="Work Friendly"
      count={count > 0 ? count : undefined}
      isRefined={bothSelected}
      onRefine={handleToggle}
      icon={<div className="flex -space-x-1">
        <Wifi className="w-4 h-4" />
        <Zap className="w-4 h-4" />
      </div>}
    />
  );
}

function NoiseFilter() {
  const { items, refine } = useRefinementList({
    attribute: 'noise_level',
  });

  return (
    <div className="flex gap-2">
      {items
        .filter(item => ['quiet', 'moderate'].includes(item.label.toLowerCase()))
        .map((item) => (
          <FilterButton
            key={item.value}
            label={item.label.charAt(0).toUpperCase() + item.label.slice(1)}
            count={item.count}
            isRefined={item.isRefined}
            onRefine={() => refine(item.value)}
            icon={<Volume2 className="w-4 h-4" />}
          />
        ))}
    </div>
  );
}

function PriceFilter() {
  const { items, refine } = useRefinementList({
    attribute: 'price_range',
  });

  const priceLabels: Record<string, string> = {
    'budget': '$',
    'moderate': '$$',
    'expensive': '$$$'
  };

  return (
    <div className="flex gap-2">
      {items.map((item) => (
        <FilterButton
          key={item.value}
          label={priceLabels[item.label] || item.label}
          count={item.count}
          isRefined={item.isRefined}
          onRefine={() => refine(item.value)}
          icon={<DollarSign className="w-4 h-4" />}
        />
      ))}
    </div>
  );
}

function ClearFilters() {
  const { items, refine } = useCurrentRefinements();

  if (items.length === 0) return null;

  const activeFiltersCount = items.reduce((total, item) => total + item.refinements.length, 0);

  return (
    <button
      onClick={() => items.forEach(item =>
        item.refinements.forEach(refinement =>
          refine(refinement)
        )
      )}
      className="flex items-center gap-2 px-4 py-3 rounded-full border-2 border-red-200 text-red-600 hover:text-white hover:bg-red-500 hover:border-red-500 transition-all duration-300 transform hover:scale-105 active:scale-95 bg-white/80 backdrop-blur-sm hover:shadow-md"
    >
      <X className="w-4 h-4" />
      <span className="font-semibold text-sm">Clear All</span>
      {activeFiltersCount > 0 && (
        <span className="text-xs px-2.5 py-0.5 rounded-full font-bold min-w-[24px] text-center bg-red-100 text-red-600">
          {activeFiltersCount}
        </span>
      )}
    </button>
  );
}

export default function InstantFilters() {
  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-center gap-4 px-4 py-6">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <WorkFriendlyFilter />
          <NoiseFilter />
          <PriceFilter />
        </div>
        <ClearFilters />
      </div>
    </div>
  );
}