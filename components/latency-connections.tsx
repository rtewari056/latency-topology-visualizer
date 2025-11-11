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

  console.log('🌐 LatencyConnections render:', {
    hasMap: !!map,
    connectionsCount: connections.length,
    showAnimation,
  });

  useEffect(() => {
    if (!map) {
      console.log('⚠️ Map not available yet');
      return;
    }

    console.log('🎯 First useEffect - Initializing layers');

    // Initialize layers with a delay to ensure map is ready
    const initLayers = () => {
      console.log('✅ Initializing layers (forced)...');
      try {
        initializeLayers(map);
        layersInitializedRef.current = true;

        // Update data immediately after layers are created if we have connections
        if (connections.length > 0) {
          console.log(`📊 Updating data with ${connections.length} connections`);
          updateConnectionData(map, connections);
        }
      } catch (error) {
        console.error('❌ Error initializing layers:', error);
      }
    };

    // Listen for style changes (when user switches map theme)
    const handleStyleLoad = () => {
      console.log('🔄 Style changed, reinitializing layers');
      layersInitializedRef.current = false;
      setTimeout(initLayers, 100);
    };

    // Use timeout to ensure map is ready (don't rely on isStyleLoaded)
    const timeoutId = setTimeout(initLayers, 500);

    // Listen for style changes
    map.on('style.load', handleStyleLoad);

    return () => {
      clearTimeout(timeoutId);
      const frameId = animationFrameRef.current;
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
      map.off('style.load', initLayers);
      map.off('style.load', handleStyleLoad);
      if (map.isStyleLoaded()) {
        cleanupLayers(map);
      }
      layersInitializedRef.current = false;
    };
  }, [map, connections]);

  useEffect(() => {
    if (!map || connections.length === 0 || !layersInitializedRef.current) {
      console.log('⚠️ Second useEffect - Skipping:', {
        hasMap: !!map,
        connectionsCount: connections.length,
        layersInitialized: layersInitializedRef.current
      });
      return;
    }

    console.log(`🔄 Second useEffect - Updating ${connections.length} connections`);

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
  console.log('🎨 Initializing latency connection layers...');
  
  // Check if layers already exist (to avoid duplicate layer errors)
  if (map.getLayer('latency-connections-base')) {
    console.log('ℹ️ Layers already exist, skipping initialization');
    return;
  }
  
  // Add source for connection lines
  if (!map.getSource('latency-connections')) {
    map.addSource('latency-connections', {
      type: 'geojson',
      lineMetrics: true, // Enable line metrics for better rendering
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });
    console.log('✅ Added latency-connections source');
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
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      paint: {
        'line-color': '#00ff00', // Bright green for testing
        'line-width': 4,
        'line-opacity': 0.8,
      },
    });
    console.log('✅ Added latency-connections-base layer with BRIGHT GREEN color');
  }

  // Add animated dashed line layer
  if (!map.getLayer('latency-connections-animated')) {
    map.addLayer({
      id: 'latency-connections-animated',
      type: 'line',
      source: 'latency-connections',
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      paint: {
        'line-color': '#ffff00', // Bright yellow for testing
        'line-width': 5,
        'line-opacity': 1,
        'line-dasharray': [2, 2],
      },
    });
    console.log('✅ Added latency-connections-animated layer with BRIGHT YELLOW color');
  }

  // Add circle layer for pulse points
  if (!map.getLayer('latency-pulse-points')) {
    map.addLayer({
      id: 'latency-pulse-points',
      type: 'circle',
      source: 'latency-pulses',
      layout: {},
      paint: {
        'circle-radius': 6,
        'circle-color': '#ff00ff', // Bright magenta for testing
        'circle-opacity': 0.8,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff',
        'circle-stroke-opacity': 0.5,
      },
    });
    console.log('✅ Added latency-pulse-points layer with BRIGHT MAGENTA color');
  }
  
  console.log('🎨 All layers initialized successfully');
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
  // Remove the style loaded check - if layers are initialized, we can update
  const source = map.getSource('latency-connections') as GeoJSONSource;
  if (!source) {
    console.warn('⚠️ latency-connections source not found!');
    return;
  }

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

  console.log(`📊 Updating connection data: ${lineFeatures.length} features`);
  console.log('🔍 Raw connections data:', connections.slice(0, 2).map(c => ({
    id: c.id,
    source: c.sourceCoordinates,
    target: c.targetCoordinates,
    latency: c.latencyMs,
    range: c.range
  })));
  
  if (lineFeatures.length > 0) {
    const sample = lineFeatures[0];
    console.log('🔍 Sample connection details:', {
      from: sample.geometry.coordinates[0],
      to: sample.geometry.coordinates[1],
      color: sample.properties.color,
      range: sample.properties.range,
      latency: sample.properties.latency
    });
    
    // Check if coordinates are valid
    const [fromLng, fromLat] = sample.geometry.coordinates[0];
    const [toLng, toLat] = sample.geometry.coordinates[1];
    console.log('🔍 Coordinate validation:', {
      fromValid: fromLng >= -180 && fromLng <= 180 && fromLat >= -90 && fromLat <= 90,
      toValid: toLng >= -180 && toLng <= 180 && toLat >= -90 && toLat <= 90,
      from: `[${fromLng}, ${fromLat}]`,
      to: `[${toLng}, ${toLat}]`
    });
  }
  
  source.setData({
    type: 'FeatureCollection',
    features: lineFeatures,
  });
  console.log('✅ Connection data updated successfully');
  
  // Force map repaint to ensure lines are rendered
  map.triggerRepaint();
  
  // Force layer visibility and check if layers exist
  const baseLayer = map.getLayer('latency-connections-base');
  const animLayer = map.getLayer('latency-connections-animated');
  
  if (baseLayer) {
    map.setLayoutProperty('latency-connections-base', 'visibility', 'visible');
    console.log('✅ Base layer exists and set to visible');
  } else {
    console.error('❌ Base layer NOT FOUND!');
  }
  
  if (animLayer) {
    map.setLayoutProperty('latency-connections-animated', 'visibility', 'visible');
    console.log('✅ Animated layer exists and set to visible');
  } else {
    console.error('❌ Animated layer NOT FOUND!');
  }
  
  console.log('🎨 Map projection:', map.getProjection());
  console.log('🎨 Map style loaded:', map.isStyleLoaded());
  console.log('🎨 Map zoom:', map.getZoom());
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
