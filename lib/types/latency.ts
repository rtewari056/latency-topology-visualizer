export type LatencyRange = 'low' | 'medium' | 'high';

export interface LatencyConnection {
  id: string;
  sourceServerId: string;
  targetServerId: string;
  sourceCoordinates: [number, number]; // [longitude, latitude]
  targetCoordinates: [number, number]; // [longitude, latitude]
  latencyMs: number;
  range: LatencyRange;
  timestamp: number;
}

export interface LatencyStats {
  min: number;
  max: number;
  avg: number;
  median: number;
}

export interface LatencyUpdate {
  connections: LatencyConnection[];
  timestamp: number;
  stats: LatencyStats;
}

export const LATENCY_THRESHOLDS = {
  low: { max: 50, color: '#22c55e' }, // green
  medium: { min: 50, max: 150, color: '#eab308' }, // yellow
  high: { min: 150, color: '#ef4444' }, // red
} as const;

export function getLatencyRange(latencyMs: number): LatencyRange {
  if (latencyMs <= LATENCY_THRESHOLDS.low.max) return 'low';
  if (latencyMs <= LATENCY_THRESHOLDS.medium.max) return 'medium';
  return 'high';
}

export function getLatencyColor(range: LatencyRange): string {
  return LATENCY_THRESHOLDS[range].color;
}
