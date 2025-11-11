'use client';

import { MapProvider } from '@/context/map-context';
import { ThemeProvider } from '@/context/theme-context';
import { MapboxProvider } from '@/lib/mapbox/provider';
import { LocationMarker } from '@/components/location-marker';
import { MapZoomControls } from '@/components/map/map-zoom-controls';
import { MapStyleSelector } from '@/components/map/map-theme-toggle';
import { MapLegend } from '@/components/map/map-legend';
import { ExchangeServerMarkers } from '@/components/exchange-server-markers';
import SimpleConnections from '@/components/latency-connections-simple';
import { useState, useEffect, useRef } from 'react';
import { fetchRealTimeExchangeData } from '@/lib/api/real-time-exchange-data';
import { ExchangeServer } from '@/lib/types/exchange-server';

const REFRESH_INTERVAL = 5000; // 5 seconds

const Home = () => {
  const [serverCounts, setServerCounts] = useState({ AWS: 0, GCP: 0, Azure: 0 });
  const [servers, setServers] = useState<ExchangeServer[]>([]);
  const updateTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch exchange servers on mount
  useEffect(() => {
    console.log('🚀 Fetching servers...');

    fetchRealTimeExchangeData()
      .then((data) => {
        console.log('✅ Loaded:', data.servers.length, 'servers');
        setServerCounts(data.summary.byProvider);
        setServers(data.servers);
      })
      .catch((error) => {
        console.error('❌ Failed to fetch data:', error);
      });
  }, []);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    if (servers.length === 0) return;

    console.log(`⏱️ Auto-refresh every ${REFRESH_INTERVAL}ms`);

    updateTimerRef.current = setInterval(async () => {
      const timestamp = new Date().toLocaleTimeString();
      console.log(`🔄 [${timestamp}] Refreshing...`);
      
      try {
        const data = await fetchRealTimeExchangeData();
        console.log(`✅ [${timestamp}] Updated ${data.servers.length} servers`);
        
        setServers(data.servers);
        setServerCounts(data.summary.byProvider);
      } catch (error) {
        console.error(`❌ [${timestamp}] Refresh failed:`, error);
      }
    }, REFRESH_INTERVAL);

    return () => {
      if (updateTimerRef.current) {
        clearInterval(updateTimerRef.current);
        updateTimerRef.current = null;
      }
    };
  }, [servers.length]);

  return (
    <ThemeProvider>
      <MapProvider>
        <MapboxProvider>
          <LocationMarker />
          <ExchangeServerMarkers servers={servers} />
          <SimpleConnections servers={servers} />
          <MapZoomControls />
          <MapStyleSelector />
          <MapLegend serverCounts={serverCounts} />
        </MapboxProvider>
      </MapProvider>
    </ThemeProvider>
  );
};

export default Home;