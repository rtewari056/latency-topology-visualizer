'use client';

import { useEffect, useRef, ReactNode, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapContext } from '@/context/map-context';
import { useTheme } from '@/context/theme-context';
import { getUserLocation, createMapConfig, DEFAULT_LOCATION, getMapStyle } from './utils';
import { MapLoadingIndicator } from '@/components/map-loading-indicator';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

interface MapboxProviderProps {
  children?: ReactNode;
}

export const MapboxProvider = ({ children }: MapboxProviderProps) => {
  const { setMap, setCenter, setIsUserLocation } = useMapContext();
  const { mapStyle } = useTheme();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_LOCATION);
  const [isReady, setIsReady] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Get user's current location on mount
  useEffect(() => {
    getUserLocation()
      .then((location) => {
        const coords: [number, number] = [location.longitude, location.latitude];
        setMapCenter(coords);
        setCenter(coords);
        setIsUserLocation(true);
        console.log('User location obtained:', location);
      })
      .catch((error) => {
        console.error('Failed to get user location:', error.message);
        setMapCenter(DEFAULT_LOCATION);
        setCenter(DEFAULT_LOCATION);
        setIsUserLocation(false);
      })
      .finally(() => {
        setIsReady(true);
      });
  }, [setCenter, setIsUserLocation]);

  // Initialize map when container is ready and location is determined
  useEffect(() => {
    if (!mapContainerRef.current || !isReady || mapInstanceRef.current) return;

    const mapConfig = createMapConfig(mapCenter, { style: getMapStyle(mapStyle) });

    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current,
      ...mapConfig,
      attributionControl: false,
      logoPosition: 'bottom-right',
      projection: 'globe', // Use globe projection
    });

    // Wait for map to fully load
    mapInstance.on('load', () => {
      setIsMapLoaded(true);
    });

    mapInstanceRef.current = mapInstance;
    setMap(mapInstance);

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        setMap(null);
      }
    };
  }, [isReady, mapCenter, mapStyle, setMap]);

  // Update map style when mapStyle changes
  useEffect(() => {
    if (mapInstanceRef.current && isMapLoaded) {
      mapInstanceRef.current.setStyle(getMapStyle(mapStyle));
    }
  }, [mapStyle, isMapLoaded]);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
      {!isMapLoaded && <MapLoadingIndicator />}
      {children}
    </div>
  );
};
