'use client';

import { MapProvider } from '@/context/map-context';
import { ThemeProvider } from '@/context/theme-context';
import { MapboxProvider } from '@/lib/mapbox/provider';
import { LocationMarker } from '@/components/location-marker';
import { MapZoomControls } from '@/components/map/map-zoom-controls';
import { MapStyleSelector } from '@/components/map/map-theme-toggle';
import { MapLegend } from '@/components/map/map-legend';
import { ExchangeServerMarkers } from '@/components/exchange-server-markers';
import LatencyConnections from '@/components/latency-connections';
import LatencyControls from '@/components/map/map-latency-controls';
import { useState, useEffect, useRef, useMemo } from 'react';
import { fetchExchangeServerData } from '@/lib/api/exchange-data';
import {
  fetchLatencyData,
  fetchLatencyUpdates,
  filterConnectionsByRange,
} from '@/lib/api/latency-data';
import { LatencyConnection, LatencyStats, LatencyRange } from '@/lib/types/latency';
import { ExchangeServer } from '@/lib/types/exchange-server';

const Home = () => {
  const [serverCounts, setServerCounts] = useState({ AWS: 0, GCP: 0, Azure: 0 });
  const [servers, setServers] = useState<ExchangeServer[]>([]);

  // Latency visualization state
  const [latencyEnabled, setLatencyEnabled] = useState(true);
  const [updateInterval, setUpdateInterval] = useState(5000); // 5 seconds default
  const [allConnections, setAllConnections] = useState<LatencyConnection[]>([]);
  const [latencyStats, setLatencyStats] = useState<LatencyStats | undefined>();
  const [activeRanges, setActiveRanges] = useState<Set<LatencyRange>>(
    new Set(['low', 'medium', 'high'])
  );

  const updateTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch exchange servers on mount
  useEffect(() => {
    fetchExchangeServerData().then((data) => {
      setServerCounts(data.summary.byProvider);
      setServers(data.servers);
    });
  }, []);

  // Initialize latency connections when servers are loaded
  useEffect(() => {
    if (servers.length === 0) return;

    fetchLatencyData(servers).then((data) => {
      setAllConnections(data.connections);
      setLatencyStats(data.stats);
    });
  }, [servers]);

  // Filter connections based on active ranges (using useMemo for performance)
  const filteredConnections = useMemo(() => {
    return filterConnectionsByRange(allConnections, Array.from(activeRanges));
  }, [allConnections, activeRanges]);

  // Auto-update latency data at regular intervals
  useEffect(() => {
    if (!latencyEnabled || allConnections.length === 0) {
      if (updateTimerRef.current) {
        clearInterval(updateTimerRef.current);
        updateTimerRef.current = null;
      }
      return;
    }

    // Set up interval for updates
    updateTimerRef.current = setInterval(() => {
      fetchLatencyUpdates(allConnections).then((data) => {
        setAllConnections(data.connections);
        setLatencyStats(data.stats);
      });
    }, updateInterval);

    return () => {
      if (updateTimerRef.current) {
        clearInterval(updateTimerRef.current);
      }
    };
  }, [latencyEnabled, allConnections, updateInterval]);

  const handleRangeToggle = (range: LatencyRange) => {
    const newRanges = new Set(activeRanges);
    if (newRanges.has(range)) {
      newRanges.delete(range);
    } else {
      newRanges.add(range);
    }
    setActiveRanges(newRanges);
  };

  return (
    <ThemeProvider>
      <MapProvider>
        <MapboxProvider>
          <LocationMarker />
          <ExchangeServerMarkers />
          {latencyEnabled && (
            <LatencyConnections
              connections={filteredConnections}
              showAnimation={true}
            />
          )}
          <MapZoomControls />
          <MapStyleSelector />
          <LatencyControls
            isEnabled={latencyEnabled}
            onToggle={setLatencyEnabled}
            updateInterval={updateInterval}
            onIntervalChange={setUpdateInterval}
            activeRanges={activeRanges}
            onRangeToggle={handleRangeToggle}
            stats={latencyStats}
          />
          <MapLegend serverCounts={serverCounts} />
        </MapboxProvider>
      </MapProvider>
    </ThemeProvider>
  );
};

export default Home;