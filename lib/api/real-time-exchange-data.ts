import { ExchangeServer, NetworkLatencyData } from '@/lib/types/exchange-server';
import { getEndpointByRegion } from '@/lib/data/region-endpoints';
import {
  EXCHANGE_REGION_MAPPINGS,
  getExchangeRegions,
} from '@/lib/data/exchange-region-mapping';
import {
  measureMultipleEndpoints,
  LatencyMeasurement,
} from '@/lib/services/latency-measurement';

/**
 * Fetch real-time exchange server data with actual latency measurements
 */
export async function fetchRealTimeExchangeData(): Promise<NetworkLatencyData> {
  const servers: ExchangeServer[] = [];

  // Measure latency to all relevant regions
  console.log('📡 Starting latency measurements...');

  // Get unique regions used by exchanges
  const uniqueRegions = new Set<string>();
  EXCHANGE_REGION_MAPPINGS.forEach((mapping) => {
    mapping.regions.forEach((r) => uniqueRegions.add(r.region));
  });

  // Get endpoints for these regions
  const endpointsToMeasure = Array.from(uniqueRegions)
    .map((region) => getEndpointByRegion(region))
    .filter((ep) => ep !== undefined);

  // Measure latency in parallel
  const measurements = await measureMultipleEndpoints(endpointsToMeasure);

  // Create a map for quick lookup
  const latencyMap = new Map<string, LatencyMeasurement>();
  measurements.forEach((m) => {
    latencyMap.set(m.region, m);
    console.log(`📍 ${m.region}: ${m.latencyMs}ms (${m.status})`);
  });

  console.log(`✅ Measured ${measurements.length} regions`);

  // Generate ExchangeServer objects
  EXCHANGE_REGION_MAPPINGS.forEach((mapping) => {
    mapping.regions.forEach((regionInfo, index) => {
      const endpoint = getEndpointByRegion(regionInfo.region);
      const measurement = latencyMap.get(regionInfo.region);

      if (!endpoint || !measurement) return;

      // Determine status based on measurement (more lenient thresholds)
      let status: 'online' | 'degraded' | 'offline' = 'online';
      if (measurement.status === 'timeout' || measurement.status === 'failed') {
        status = 'offline';
      } else if (measurement.latencyMs > 500) {
        // Only mark as degraded if > 500ms (was 200ms)
        status = 'degraded';
      }

      const server: ExchangeServer = {
        id: `${mapping.exchange.toLowerCase()}-${regionInfo.region}-${index + 1}`,
        exchange: mapping.exchange,
        location: {
          city: endpoint.location.city,
          country: endpoint.location.country,
          latitude: endpoint.location.latitude,
          longitude: endpoint.location.longitude,
        },
        cloudProvider: regionInfo.provider,
        region: regionInfo.region,
        latency: measurement.latencyMs,
        status,
      };

      servers.push(server);
    });
  });

  // Calculate summary (include degraded servers in average)
  const activeServers = servers.filter((s) => s.status !== 'offline');
  const onlineServers = servers.filter((s) => s.status === 'online');
  const averageLatency =
    activeServers.length > 0
      ? Math.round(activeServers.reduce((sum, s) => sum + s.latency, 0) / activeServers.length)
      : 0;

  const summary = {
    totalServers: servers.length,
    averageLatency,
    onlineServers: onlineServers.length,
    degradedServers: servers.filter((s) => s.status === 'degraded').length,
    offlineServers: servers.filter((s) => s.status === 'offline').length,
    byProvider: {
      AWS: servers.filter((s) => s.cloudProvider === 'AWS').length,
      GCP: servers.filter((s) => s.cloudProvider === 'GCP').length,
      Azure: servers.filter((s) => s.cloudProvider === 'Azure').length,
    },
    byExchange: servers.reduce(
      (acc, server) => {
        acc[server.exchange] = (acc[server.exchange] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ),
  };

  console.log('📊 Exchange data ready:', summary);

  return {
    servers,
    summary,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Refresh latency for a specific exchange
 */
export async function refreshExchangeLatency(exchangeName: string): Promise<ExchangeServer[]> {
  const mapping = getExchangeRegions(exchangeName);
  if (!mapping) return [];

  const endpoints = mapping.regions
    .map((r) => getEndpointByRegion(r.region))
    .filter((ep) => ep !== undefined);

  const measurements = await measureMultipleEndpoints(endpoints);
  const latencyMap = new Map<string, LatencyMeasurement>();
  measurements.forEach((m) => latencyMap.set(m.region, m));

  const servers: ExchangeServer[] = [];

  mapping.regions.forEach((regionInfo, index) => {
    const endpoint = getEndpointByRegion(regionInfo.region);
    const measurement = latencyMap.get(regionInfo.region);

    if (!endpoint || !measurement) return;

    let status: 'online' | 'degraded' | 'offline' = 'online';
    if (measurement.status === 'timeout' || measurement.status === 'failed') {
      status = 'offline';
    } else if (measurement.latencyMs > 200) {
      status = 'degraded';
    }

    servers.push({
      id: `${exchangeName.toLowerCase()}-${regionInfo.region}-${index + 1}`,
      exchange: exchangeName,
      location: {
        city: endpoint.location.city,
        country: endpoint.location.country,
        latitude: endpoint.location.latitude,
        longitude: endpoint.location.longitude,
      },
      cloudProvider: regionInfo.provider,
      region: regionInfo.region,
      latency: measurement.latencyMs,
      status,
    });
  });

  return servers;
}

/**
 * Get servers by cloud provider
 */
export async function fetchServersByProvider(
  provider: 'AWS' | 'GCP' | 'Azure'
): Promise<ExchangeServer[]> {
  const data = await fetchRealTimeExchangeData();
  return data.servers.filter((s) => s.cloudProvider === provider);
}

/**
 * Get servers by exchange
 */
export async function fetchServersByExchange(exchangeName: string): Promise<ExchangeServer[]> {
  const data = await fetchRealTimeExchangeData();
  return data.servers.filter((s) => s.exchange === exchangeName);
}
