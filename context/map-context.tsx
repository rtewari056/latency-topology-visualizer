'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import mapboxgl from 'mapbox-gl';

interface MapContextType {
  map: mapboxgl.Map | null;
  setMap: (map: mapboxgl.Map | null) => void;
  center: [number, number];
  setCenter: (center: [number, number]) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  isUserLocation: boolean;
  setIsUserLocation: (isUserLocation: boolean) => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider = ({ children }: { children: ReactNode }) => {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [center, setCenter] = useState<[number, number]>([-74.5, 40]);
  const [zoom, setZoom] = useState<number>(9);
  const [isUserLocation, setIsUserLocation] = useState<boolean>(false);

  return (
    <MapContext.Provider
      value={{
        map,
        setMap,
        center,
        setCenter,
        zoom,
        setZoom,
        isUserLocation,
        setIsUserLocation,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export const useMapContext = () => {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error('useMapContext must be used within a MapProvider');
  }
  return context;
};
