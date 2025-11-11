'use client';

import { useEffect } from 'react';
import { useMapContext } from '@/context/map-context';
import type { Map as MapboxMap } from 'mapbox-gl';
import { ExchangeServer } from '@/lib/types/exchange-server';

interface SimpleConnectionsProps {
  servers: ExchangeServer[];
}

let animationFrameId: number | null = null;

export default function SimpleConnections({ servers }: SimpleConnectionsProps) {
  const { map } = useMapContext();

  useEffect(() => {
    if (!map || servers.length === 0) return;

    // Wait for style to load before adding layers
    const initLayers = () => {
      if (!map.isStyleLoaded()) {
        // If style not loaded, wait for it
        map.once('style.load', () => {
          setTimeout(() => updateConnections(map, servers), 100);
        });
      } else {
        // Style already loaded
        setTimeout(() => updateConnections(map, servers), 100);
      }
    };

    const timer = setTimeout(initLayers, 1000);

    return () => {
      clearTimeout(timer);
      // Clean up animation when component unmounts
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };
  }, [map, servers]);

  return null;
}

function getLatencyColor(latencyMs: number): string {
  if (latencyMs < 100) return '#10b981'; // Green - low latency
  if (latencyMs < 300) return '#eab308'; // Yellow - medium latency
  return '#ef4444'; // Red - high latency
}

function calculateDistance(
  coord1: [number, number],
  coord2: [number, number]
): number {
  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;
  const dx = lon2 - lon1;
  const dy = lat2 - lat1;
  return Math.sqrt(dx * dx + dy * dy);
}

function updateConnections(map: MapboxMap, servers: ExchangeServer[]) {
  // Cancel any existing animation first
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  // Remove existing layers/sources (remove layers first, then source)
  try {
    if (map.getLayer('simple-connections-pulse')) {
      map.removeLayer('simple-connections-pulse');
    }
    if (map.getLayer('simple-connections')) {
      map.removeLayer('simple-connections');
    }
    if (map.getSource('simple-connections')) {
      map.removeSource('simple-connections');
    }
  } catch (error) {
    console.warn('Error removing layers:', error);
  }

  const features = [];
  const connectedPairs = new Set<string>();
  
  // Connect ALL servers to their 4 nearest neighbors (creates denser mesh)
  for (let i = 0; i < servers.length; i++) {
    const server = servers[i];
    const from: [number, number] = [server.location.longitude, server.location.latitude];

    // Find 4 nearest servers
    const nearest = servers
      .map((target, idx) => {
        if (idx === i) return null;
        const to: [number, number] = [target.location.longitude, target.location.latitude];
        const dist = calculateDistance(from, to);
        return { target, dist, idx };
      })
      .filter(d => d !== null)
      .sort((a, b) => a!.dist - b!.dist)
      .slice(0, 4);

    // Create line features with color based on latency
    for (const { target, idx } of nearest) {
      // Avoid duplicate lines (A->B and B->A)
      const pairKey = [i, idx].sort().join('-');
      if (connectedPairs.has(pairKey)) continue;
      connectedPairs.add(pairKey);

      const to: [number, number] = [target.location.longitude, target.location.latitude];
      
      // Use actual server latency if available, otherwise estimate from distance
      const avgLatency = ((server.latency || 0) + (target.latency || 0)) / 2;
      // More realistic latency estimation: ~1ms per degree of distance
      const latency = avgLatency > 0 ? avgLatency : calculateDistance(from, to) * 1;
      const color = getLatencyColor(latency);
      
      features.push({
        type: 'Feature' as const,
        properties: {
          latency,
          color,
        },
        geometry: {
          type: 'LineString' as const,
          coordinates: [from, to],
        },
      });
    }
  }

  console.log(`✅ Updating ${features.length} connections`);

  // Add source
  map.addSource('simple-connections', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: features,
    },
  });

  // Add base layer with data-driven colors
  map.addLayer({
    id: 'simple-connections',
    type: 'line',
    source: 'simple-connections',
    paint: {
      'line-color': ['get', 'color'],
      'line-width': 2.5,
      'line-opacity': 0.7,
    },
  });

  // Add animated pulse layer
  map.addLayer({
    id: 'simple-connections-pulse',
    type: 'line',
    source: 'simple-connections',
    paint: {
      'line-color': ['get', 'color'],
      'line-width': 3.5,
      'line-opacity': 0.4,
      'line-dasharray': [0, 2, 4],
    },
  });

  // Animate the pulse effect with safety checks
  let offset = 0;
  function animatePulse() {
    // Check if map and layer still exist before updating
    try {
      if (!map || !map.getStyle() || !map.getLayer('simple-connections-pulse')) {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
        return;
      }

      offset = (offset + 0.1) % 4;
      map.setPaintProperty('simple-connections-pulse', 'line-dasharray', [0, offset, 4]);
      animationFrameId = requestAnimationFrame(animatePulse);
    } catch {
      // Map or layer was removed, stop animation
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    }
  }
  
  animatePulse();
}
