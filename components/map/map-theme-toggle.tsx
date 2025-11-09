'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/context/theme-context';

export const MapStyleSelector = () => {
  const { mapStyle, setMapStyle } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const styles = [
    { value: 'standard', label: 'Standard', icon: '🗺️' },
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'dark', label: 'Dark', icon: '🌙' },
  ] as const;

  const currentStyle = styles.find((s) => s.value === mapStyle) || styles[0];

  return (
    <div ref={dropdownRef} className="absolute top-4 left-4 z-10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="min-w-[140px] h-10 px-4 bg-white hover:bg-gray-50 active:bg-gray-100 rounded-md shadow-lg flex items-center justify-between text-gray-800 font-medium text-sm transition-colors duration-200"
        aria-label="Select map style"
      >
        <span className="flex items-center gap-2">
          <span>{currentStyle.icon}</span>
          <span>{currentStyle.label}</span>
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-12 left-0 min-w-[140px] bg-white rounded-md shadow-xl border border-gray-200 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
          {styles.map((style) => (
            <button
              key={style.value}
              onClick={() => {
                setMapStyle(style.value);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors duration-150 ${
                mapStyle === style.value
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>{style.icon}</span>
              <span>{style.label}</span>
              {mapStyle === style.value && (
                <svg
                  className="w-4 h-4 ml-auto"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
