// Types for Exchange Server Data
export interface ExchangeServer {
  id: string;
  exchange: string;
  location: {
    city: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  cloudProvider: 'AWS' | 'GCP' | 'Azure';
  region: string;
  latency: number; // in milliseconds
  status: 'online' | 'degraded' | 'offline';
}

export interface NetworkLatencyData {
  timestamp: string;
  servers: ExchangeServer[];
  summary: {
    totalServers: number;
    averageLatency: number;
    byProvider: {
      AWS: number;
      GCP: number;
      Azure: number;
    };
  };
}

// Cloud Provider Colors
export const CLOUD_PROVIDER_COLORS = {
  AWS: '#FF9900',      // AWS Orange
  GCP: '#4285F4',      // Google Blue
  Azure: '#0078D4',    // Azure Blue
} as const;

// Cloud Provider Icons/Markers
export const CLOUD_PROVIDER_INFO = {
  AWS: {
    name: 'Amazon Web Services',
    color: CLOUD_PROVIDER_COLORS.AWS,
    shortName: 'AWS',
  },
  GCP: {
    name: 'Google Cloud Platform',
    color: CLOUD_PROVIDER_COLORS.GCP,
    shortName: 'GCP',
  },
  Azure: {
    name: 'Microsoft Azure',
    color: CLOUD_PROVIDER_COLORS.Azure,
    shortName: 'Azure',
  },
} as const;
