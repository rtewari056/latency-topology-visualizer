import { RegionEndpoint } from '@/lib/data/region-endpoints';

export interface LatencyMeasurement {
  region: string;
  endpoint: string;
  latencyMs: number;
  timestamp: number;
  status: 'success' | 'failed' | 'timeout';
  error?: string;
}

const TIMEOUT_MS = 10000; // 10 seconds timeout
const CACHE_DURATION_MS = 30000; // Cache results for 30 seconds

// Cache to avoid excessive pinging
const latencyCache = new Map<string, LatencyMeasurement>();

/**
 * Measure latency to a single endpoint using fetch with timing
 */
export async function measureEndpointLatency(
  endpoint: RegionEndpoint
): Promise<LatencyMeasurement> {
  // Check cache first
  const cached = latencyCache.get(endpoint.region);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION_MS) {
    return cached;
  }

  const startTime = performance.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    // Use GET request with no-cors mode (HEAD requests often blocked by cloud providers)
    const response = await fetch(endpoint.endpoint, {
      method: 'GET',
      mode: 'no-cors', // Important: allows cross-origin requests without CORS
      cache: 'no-store',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const endTime = performance.now();
    const latencyMs = Math.round(endTime - startTime);

    const measurement: LatencyMeasurement = {
      region: endpoint.region,
      endpoint: endpoint.endpoint,
      latencyMs,
      timestamp: Date.now(),
      status: 'success',
    };

    // Cache the result
    latencyCache.set(endpoint.region, measurement);

    return measurement;
  } catch (error) {
    const endTime = performance.now();
    const latencyMs = Math.round(endTime - startTime);

    const measurement: LatencyMeasurement = {
      region: endpoint.region,
      endpoint: endpoint.endpoint,
      latencyMs,
      timestamp: Date.now(),
      status: error instanceof Error && error.name === 'AbortError' ? 'timeout' : 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    };

    // Cache failed attempts too (with shorter duration)
    latencyCache.set(endpoint.region, measurement);

    return measurement;
  }
}

/**
 * Measure latency to multiple endpoints in parallel
 */
export async function measureMultipleEndpoints(
  endpoints: RegionEndpoint[]
): Promise<LatencyMeasurement[]> {
  const measurements = await Promise.all(
    endpoints.map((endpoint) => measureEndpointLatency(endpoint))
  );

  return measurements;
}

/**
 * Measure latency with retry logic
 */
export async function measureWithRetry(
  endpoint: RegionEndpoint,
  retries = 2
): Promise<LatencyMeasurement> {
  let lastMeasurement: LatencyMeasurement | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    lastMeasurement = await measureEndpointLatency(endpoint);

    if (lastMeasurement.status === 'success') {
      return lastMeasurement;
    }

    // Wait before retry (exponential backoff)
    if (attempt < retries) {
      await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
    }
  }

  return lastMeasurement!;
}

/**
 * Get average latency from multiple measurements
 */
export function calculateAverageLatency(measurements: LatencyMeasurement[]): number {
  const successfulMeasurements = measurements.filter((m) => m.status === 'success');

  if (successfulMeasurements.length === 0) {
    return 0;
  }

  const sum = successfulMeasurements.reduce((acc, m) => acc + m.latencyMs, 0);
  return Math.round(sum / successfulMeasurements.length);
}

/**
 * Clear latency cache (useful for forcing fresh measurements)
 */
export function clearLatencyCache(): void {
  latencyCache.clear();
}

/**
 * Get cached measurements
 */
export function getCachedMeasurements(): Map<string, LatencyMeasurement> {
  return new Map(latencyCache);
}

/**
 * Measure latency using Image loading (alternative method for CORS-restricted endpoints)
 */
export async function measureLatencyViaImage(url: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const startTime = performance.now();
    const img = new Image();

    img.onload = () => {
      const endTime = performance.now();
      resolve(Math.round(endTime - startTime));
    };

    img.onerror = () => {
      const endTime = performance.now();
      // Even on error, we got a response, so latency is valid
      resolve(Math.round(endTime - startTime));
    };

    // Add cache buster to avoid browser caching
    img.src = `${url}?t=${Date.now()}`;

    // Timeout
    setTimeout(() => {
      img.src = '';
      reject(new Error('Timeout'));
    }, TIMEOUT_MS);
  });
}
