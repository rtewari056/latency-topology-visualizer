'use client';

import { useMapContext } from '@/context/map-context';

export const MapZoomControls = () => {
  const { map } = useMapContext();

  const handleZoomIn = () => {
    if (map) {
      map.zoomIn({ duration: 300 });
    }
  };

  const handleZoomOut = () => {
    if (map) {
      map.zoomOut({ duration: 300 });
    }
  };

  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
      <button
        onClick={handleZoomIn}
        className="w-10 h-10 bg-white hover:bg-gray-100 active:bg-gray-200 rounded-md shadow-lg flex items-center justify-center text-gray-800 font-bold text-xl transition-colors duration-200"
        aria-label="Zoom in"
      >
        +
      </button>
      <button
        onClick={handleZoomOut}
        className="w-10 h-10 bg-white hover:bg-gray-100 active:bg-gray-200 rounded-md shadow-lg flex items-center justify-center text-gray-800 font-bold text-xl transition-colors duration-200"
        aria-label="Zoom out"
      >
        −
      </button>
    </div>
  );
};
