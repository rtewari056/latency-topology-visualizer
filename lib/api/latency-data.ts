import { ExchangeServer } from '@/lib/types/exchange-server';
import {
  LatencyConnection,
  LatencyUpdate,
  LatencyStats,
  getLatencyRange,
} from '@/lib/types/latency';

/**
 * Generate random latency value with some variance
 */
function generateLatency(baseLatency: number, variance = 0.3): number {
  const min = baseLatency * (1 - variance);
  const max = baseLatency * (1 + variance);
  return Math.round(min + Math.random() * (max - min));
}

/**
 * Calculate distance-based latency between two coordinates
 * Rough approximation: ~0.02ms per km for nearby servers
 */
function calculateDistanceLatency(
  coord1: [number, number],
  coord2: [number, number]
): number {
  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;

  // Haversine formula
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  // Reduced base latency and distance multiplier for more realistic values
  // Very close servers (<1000km): 5-25ms (green)
  // Medium distance (1000-3000km): 25-65ms (green/yellow)
  // Far distance (>3000km): 65ms+ (yellow/red)
  return Math.round(distance * 0.02 + 5);
}

/**
 * Generate latency connections between servers
 * Creates connections based on proximity and cloud provider relationships
 */
export function generateLatencyConnections(
  servers: ExchangeServer[],
  maxConnections = 50
): LatencyConnection[] {
  const connections: LatencyConnection[] = [];
  const onlineServers = servers.filter((s) => s.status === 'online');

  // Create connections between nearby servers
  for (let i = 0; i < onlineServers.length && connections.length < maxConnections; i++) {
    const source = onlineServers[i];
    const sourceCoords: [number, number] = [
      source.location.longitude,
      source.location.latitude,
    ];

    // Find 2-3 closest servers
    const distances = onlineServers
      .map((target, idx) => {
        if (idx === i) return null;
        const targetCoords: [number, number] = [
          target.location.longitude,
          target.location.latitude,
        ];
        return {
          target,
          distance: calculateDistanceLatency(sourceCoords, targetCoords),
          index: idx,
        };
      })
      .filter((d) => d !== null)
      .sort((a, b) => a!.distance - b!.distance);

    // Connect to 2-3 nearest servers
    const numConnections = Math.min(3, distances.length);
    for (let j = 0; j < numConnections && connections.length < maxConnections; j++) {
      const { target, distance } = distances[j]!;
      const targetCoords: [number, number] = [
        target.location.longitude,
        target.location.latitude,
      ];

      const latencyMs = generateLatency(distance);
      const range = getLatencyRange(latencyMs);

      connections.push({
        id: `${source.id}-${target.id}`,
        sourceServerId: source.id,
        targetServerId: target.id,
        sourceCoordinates: sourceCoords,
        targetCoordinates: targetCoords,
        latencyMs,
        range,
        timestamp: Date.now(),
      });
    }
  }

  return connections;
}

/**
 * Update latency values for existing connections with realistic variance
 */
export function updateLatencyConnections(
  connections: LatencyConnection[]
): LatencyConnection[] {
  return connections.map((conn) => {
    // Simulate network variance (±20%)
    const newLatency = generateLatency(conn.latencyMs, 0.2);
    const range = getLatencyRange(newLatency);

    return {
      ...conn,
      latencyMs: newLatency,
      range,
      timestamp: Date.now(),
    };
  });
}

/**
 * Calculate statistics from latency connections
 */
function calculateStats(connections: LatencyConnection[]): LatencyStats {
  if (connections.length === 0) {
    return { min: 0, max: 0, avg: 0, median: 0 };
  }

  const latencies = connections.map((c) => c.latencyMs).sort((a, b) => a - b);
  const sum = latencies.reduce((acc, val) => acc + val, 0);

  return {
    min: latencies[0],
    max: latencies[latencies.length - 1],
    avg: Math.round(sum / latencies.length),
    median: latencies[Math.floor(latencies.length / 2)],
  };
}

/**
 * Fetch initial latency data
 */
export async function fetchLatencyData(
  servers: ExchangeServer[]
): Promise<LatencyUpdate> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const connections = generateLatencyConnections(servers);
  const stats = calculateStats(connections);

  return {
    connections,
    stats,
    timestamp: Date.now(),
  };
}

/**
 * Fetch updated latency data (simulates real-time updates)
 */
export async function fetchLatencyUpdates(
  currentConnections: LatencyConnection[]
): Promise<LatencyUpdate> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  const connections = updateLatencyConnections(currentConnections);
  const stats = calculateStats(connections);

  return {
    connections,
    stats,
    timestamp: Date.now(),
  };
}

/**
 * Filter connections by latency range
 */
export function filterConnectionsByRange(
  connections: LatencyConnection[],
  ranges: ('low' | 'medium' | 'high')[]
): LatencyConnection[] {
  return connections.filter((conn) => ranges.includes(conn.range));
}
