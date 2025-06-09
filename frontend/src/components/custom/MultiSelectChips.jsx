'use client';
// import { X } from 'lucide-react';

export function MultiSelect({ options, selected, onChange, className = '' }) {
  const toggleSelect = (option) => {
    if (selected.includes(option)) {
      onChange(selected.filter((o) => o !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className={`flex flex-wrap gap-2 p-2 rounded-lg ${className}`}>
      {options.map((option) => (
        <div
          key={option}
          onClick={() => toggleSelect(option)}
          className={`px-3 py-1 rounded-full cursor-pointer text-sm ${
            selected.includes(option)
              ? ' bg-purple-dark font-semibold border border-white/20 '
              : 'border border-white/20'
          }`}
        >
          {option}
        </div>
      ))}
    </div>
  );
}
