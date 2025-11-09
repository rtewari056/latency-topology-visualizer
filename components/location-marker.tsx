'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { useMapContext } from '@/context/map-context';
import { getMarkerColor } from '@/lib/mapbox/utils';

interface LocationMarkerProps {
  color?: string;
}

export const LocationMarker = ({ color }: LocationMarkerProps) => {
  const { map, center, isUserLocation } = useMapContext();
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!map) return;

    // Remove existing marker if any
    if (markerRef.current) {
      markerRef.current.remove();
    }

    // Create new marker
    const markerColor = color ?? getMarkerColor(isUserLocation);
    markerRef.current = new mapboxgl.Marker({ color: markerColor })
      .setLngLat(center)
      .addTo(map);

    // Cleanup on unmount
    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
      }
    };
  }, [map, center, isUserLocation, color]);

  return null; // This is a logical component, no UI rendering
};
