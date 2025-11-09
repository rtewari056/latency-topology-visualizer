'use client';

import { useEffect, useRef } from 'react';
import { useMapContext } from '@/context/map-context';
import { LatencyConnection, getLatencyColor } from '@/lib/types/latency';
import type { Map as MapboxMap, GeoJSONSource } from 'mapbox-gl';

interface LatencyConnectionsProps {
  connections: LatencyConnection[];
  showAnimation?: boolean;
}

interface PulsePoint {
  coordinates: [number, number];
  color: string;
  progress: number;
  connectionId: string;
}

export default function LatencyConnections({
  connections,
  showAnimation = true,
}: LatencyConnectionsProps) {
  const { map } = useMapContext();
  const animationFrameRef = useRef<number | null>(null);
  const pulseDataRef = useRef<Map<string, number>>(new Map());
  const layersInitializedRef = useRef(false);

  useEffect(() => {
    if (!map) return;

    // Wait for style to load before adding layers
    const initLayers = () => {
      if (!map.isStyleLoaded()) return;
      initializeLayers(map);
      layersInitializedRef.current = true;

      // Update data immediately after layers are created if we have connections
      if (connections.length > 0) {
        updateConnectionData(map, connections);
      }
    };

    if (map.isStyleLoaded()) {
      initializeLayers(map);
      layersInitializedRef.current = true;

      // Update data immediately if we have connections
      if (connections.length > 0) {
        updateConnectionData(map, connections);
      }
    } else {
      map.once('style.load', initLayers);
    }

    return () => {
      const frameId = animationFrameRef.current;
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
      map.off('style.load', initLayers);
      if (map.isStyleLoaded()) {
        cleanupLayers(map);
      }
      layersInitializedRef.current = false;
    };
  }, [map, connections]);

  useEffect(() => {
    if (!map || connections.length === 0 || !map.isStyleLoaded() || !layersInitializedRef.current) return;

    // Update connection data
    updateConnectionData(map, connections);

    // Initialize pulse data for new connections
    connections.forEach((conn) => {
      if (!pulseDataRef.current.has(conn.id)) {
        pulseDataRef.current.set(conn.id, Math.random());
      }
    });

    // Start animation
    if (showAnimation) {
      const frameId = animationFrameRef.current;
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
      startAnimation(map, connections, pulseDataRef, animationFrameRef);
    }

    return () => {
      const frameId = animationFrameRef.current;
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [map, connections, showAnimation]);

  return null;
}

function initializeLayers(map: MapboxMap) {
  // Add source for connection lines
  if (!map.getSource('latency-connections')) {
    map.addSource('latency-connections', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });
  }

  // Add source for animated pulses
  if (!map.getSource('latency-pulses')) {
    map.addSource('latency-pulses', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });
  }

  // Add line layer for connections (base layer)
  if (!map.getLayer('latency-connections-base')) {
    map.addLayer({
      id: 'latency-connections-base',
      type: 'line',
      source: 'latency-connections',
      paint: {
        'line-color': ['get', 'color'],
        'line-width': 2,
        'line-opacity': 0.4,
      },
    });
  }

  // Add animated dashed line layer
  if (!map.getLayer('latency-connections-animated')) {
    map.addLayer({
      id: 'latency-connections-animated',
      type: 'line',
      source: 'latency-connections',
      paint: {
        'line-color': ['get', 'color'],
        'line-width': 2.5,
        'line-opacity': 0.7,
        'line-dasharray': [0, 4, 3],
      },
    });
  }

  // Add circle layer for pulse points
  if (!map.getLayer('latency-pulse-points')) {
    map.addLayer({
      id: 'latency-pulse-points',
      type: 'circle',
      source: 'latency-pulses',
      paint: {
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['get', 'progress'],
          0,
          3,
          0.5,
          7,
          1,
          3,
        ],
        'circle-color': ['get', 'color'],
        'circle-opacity': [
          'interpolate',
          ['linear'],
          ['get', 'progress'],
          0,
          0.6,
          0.5,
          1,
          1,
          0.4,
        ],
        'circle-blur': 0.4,
      },
    });
  }
}

function cleanupLayers(map: MapboxMap) {
  const layersToRemove = [
    'latency-pulse-points',
    'latency-connections-animated',
    'latency-connections-base',
  ];

  layersToRemove.forEach((layerId) => {
    if (map.getLayer(layerId)) {
      map.removeLayer(layerId);
    }
  });

  const sourcesToRemove = ['latency-connections', 'latency-pulses'];
  sourcesToRemove.forEach((sourceId) => {
    if (map.getSource(sourceId)) {
      map.removeSource(sourceId);
    }
  });
}

function updateConnectionData(map: MapboxMap, connections: LatencyConnection[]) {
  const lineFeatures = connections.map((conn) => ({
    type: 'Feature' as const,
    properties: {
      id: conn.id,
      latency: conn.latencyMs,
      range: conn.range,
      color: getLatencyColor(conn.range),
    },
    geometry: {
      type: 'LineString' as const,
      coordinates: [conn.sourceCoordinates, conn.targetCoordinates],
    },
  }));

  const source = map.getSource('latency-connections') as GeoJSONSource;
  if (source) {
    source.setData({
      type: 'FeatureCollection',
      features: lineFeatures,
    });
  }
}

function startAnimation(
  map: MapboxMap,
  connections: LatencyConnection[],
  pulseDataRef: React.MutableRefObject<Map<string, number>>,
  animationFrameRef: React.MutableRefObject<number | null>
) {
  let dashOffset = 0;
  const animationSpeed = 0.005; // Speed of pulse movement

  function animate() {
    dashOffset = (dashOffset + 0.5) % 10;

    // Update animated dash line
    if (map.getLayer('latency-connections-animated')) {
      map.setPaintProperty('latency-connections-animated', 'line-dasharray', [
        0,
        4 - dashOffset / 10,
        3,
      ]);
    }

    // Update pulse points
    const pulsePoints: PulsePoint[] = [];
    connections.forEach((conn) => {
      const progress = pulseDataRef.current.get(conn.id) || 0;
      const newProgress = (progress + animationSpeed) % 1;
      pulseDataRef.current.set(conn.id, newProgress);

      const point = interpolatePoint(
        conn.sourceCoordinates,
        conn.targetCoordinates,
        newProgress
      );

      pulsePoints.push({
        coordinates: point,
        color: getLatencyColor(conn.range),
        progress: newProgress,
        connectionId: conn.id,
      });
    });

    // Update pulse source
    const pulseSource = map.getSource('latency-pulses') as GeoJSONSource;
    if (pulseSource) {
      pulseSource.setData({
        type: 'FeatureCollection',
        features: pulsePoints.map((pulse) => ({
          type: 'Feature' as const,
          properties: {
            color: pulse.color,
            progress: pulse.progress,
          },
          geometry: {
            type: 'Point' as const,
            coordinates: pulse.coordinates,
          },
        })),
      });
    }

    animationFrameRef.current = requestAnimationFrame(animate);
  }

  animate();
}

function interpolatePoint(
  start: [number, number],
  end: [number, number],
  progress: number
): [number, number] {
  const lon = start[0] + (end[0] - start[0]) * progress;
  const lat = start[1] + (end[1] - start[1]) * progress;
  return [lon, lat];
}
