'use client';

import { useState } from 'react';
import { useMapContext } from '@/context/map-context';
import { getUserLocation } from '@/lib/mapbox/utils';

export const LocateMeButton = () => {
  const { map, setCenter, setIsUserLocation } = useMapContext();
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLocateMe = async () => {
    if (!map) return;

    setIsLocating(true);
    setError(null);

    try {
      const location = await getUserLocation();
      const coords: [number, number] = [location.longitude, location.latitude];
      
      setCenter(coords);
      setIsUserLocation(true);
      
      // Fly to user's location with smooth animation
      map.flyTo({
        center: coords,
        zoom: 10,
        duration: 2000,
        essential: true,
      });

      console.log('✅ User location found:', location);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get location';
      setError(errorMessage);
      console.error('❌ Location error:', errorMessage);
      
      // Clear error after 3 seconds
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <div className="absolute top-4 right-20 z-10 flex flex-col items-end gap-2">
      <button
        onClick={handleLocateMe}
        disabled={isLocating || !map}
        className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-4 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
        title="Find my location"
      >
        {isLocating ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Locating...</span>
          </>
        ) : (
          <>
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>Locate Me</span>
          </>
        )}
      </button>

      {error && (
        <div className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-fadeIn">
          {error}
        </div>
      )}
    </div>
  );
};
