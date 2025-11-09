import { NetworkLatencyData, ExchangeServer } from '@/lib/types/exchange-server';

// Dummy exchange server data
const DUMMY_EXCHANGE_SERVERS: ExchangeServer[] = [
  // Binance Servers
  {
    id: 'binance-tokyo-1',
    exchange: 'Binance',
    location: {
      city: 'Tokyo',
      country: 'Japan',
      latitude: 35.6762,
      longitude: 139.6503,
    },
    cloudProvider: 'AWS',
    region: 'ap-northeast-1',
    latency: 45,
    status: 'online',
  },
  {
    id: 'binance-singapore-1',
    exchange: 'Binance',
    location: {
      city: 'Singapore',
      country: 'Singapore',
      latitude: 1.3521,
      longitude: 103.8198,
    },
    cloudProvider: 'AWS',
    region: 'ap-southeast-1',
    latency: 52,
    status: 'online',
  },
  {
    id: 'binance-frankfurt-1',
    exchange: 'Binance',
    location: {
      city: 'Frankfurt',
      country: 'Germany',
      latitude: 50.1109,
      longitude: 8.6821,
    },
    cloudProvider: 'AWS',
    region: 'eu-central-1',
    latency: 38,
    status: 'online',
  },

  // OKX Servers
  {
    id: 'okx-hongkong-1',
    exchange: 'OKX',
    location: {
      city: 'Hong Kong',
      country: 'Hong Kong',
      latitude: 22.3193,
      longitude: 114.1694,
    },
    cloudProvider: 'GCP',
    region: 'asia-east2',
    latency: 48,
    status: 'online',
  },
  {
    id: 'okx-london-1',
    exchange: 'OKX',
    location: {
      city: 'London',
      country: 'United Kingdom',
      latitude: 51.5074,
      longitude: -0.1278,
    },
    cloudProvider: 'GCP',
    region: 'europe-west2',
    latency: 35,
    status: 'online',
  },
  {
    id: 'okx-virginia-1',
    exchange: 'OKX',
    location: {
      city: 'Virginia',
      country: 'United States',
      latitude: 37.4316,
      longitude: -78.6569,
    },
    cloudProvider: 'GCP',
    region: 'us-east4',
    latency: 42,
    status: 'online',
  },

  // Bybit Servers
  {
    id: 'bybit-seoul-1',
    exchange: 'Bybit',
    location: {
      city: 'Seoul',
      country: 'South Korea',
      latitude: 37.5665,
      longitude: 126.978,
    },
    cloudProvider: 'Azure',
    region: 'koreacentral',
    latency: 55,
    status: 'online',
  },
  {
    id: 'bybit-sydney-1',
    exchange: 'Bybit',
    location: {
      city: 'Sydney',
      country: 'Australia',
      latitude: -33.8688,
      longitude: 151.2093,
    },
    cloudProvider: 'Azure',
    region: 'australiaeast',
    latency: 78,
    status: 'online',
  },
  {
    id: 'bybit-dublin-1',
    exchange: 'Bybit',
    location: {
      city: 'Dublin',
      country: 'Ireland',
      latitude: 53.3498,
      longitude: -6.2603,
    },
    cloudProvider: 'Azure',
    region: 'northeurope',
    latency: 40,
    status: 'online',
  },

  // Deribit Servers
  {
    id: 'deribit-amsterdam-1',
    exchange: 'Deribit',
    location: {
      city: 'Amsterdam',
      country: 'Netherlands',
      latitude: 52.3676,
      longitude: 4.9041,
    },
    cloudProvider: 'AWS',
    region: 'eu-west-1',
    latency: 32,
    status: 'online',
  },
  {
    id: 'deribit-mumbai-1',
    exchange: 'Deribit',
    location: {
      city: 'Mumbai',
      country: 'India',
      latitude: 19.076,
      longitude: 72.8777,
    },
    cloudProvider: 'AWS',
    region: 'ap-south-1',
    latency: 65,
    status: 'degraded',
  },

  // Coinbase Servers
  {
    id: 'coinbase-oregon-1',
    exchange: 'Coinbase',
    location: {
      city: 'Oregon',
      country: 'United States',
      latitude: 45.5152,
      longitude: -122.6784,
    },
    cloudProvider: 'GCP',
    region: 'us-west1',
    latency: 38,
    status: 'online',
  },
  {
    id: 'coinbase-saopaulo-1',
    exchange: 'Coinbase',
    location: {
      city: 'São Paulo',
      country: 'Brazil',
      latitude: -23.5505,
      longitude: -46.6333,
    },
    cloudProvider: 'GCP',
    region: 'southamerica-east1',
    latency: 95,
    status: 'online',
  },

  // Kraken Servers
  {
    id: 'kraken-toronto-1',
    exchange: 'Kraken',
    location: {
      city: 'Toronto',
      country: 'Canada',
      latitude: 43.6532,
      longitude: -79.3832,
    },
    cloudProvider: 'Azure',
    region: 'canadacentral',
    latency: 44,
    status: 'online',
  },
  {
    id: 'kraken-paris-1',
    exchange: 'Kraken',
    location: {
      city: 'Paris',
      country: 'France',
      latitude: 48.8566,
      longitude: 2.3522,
    },
    cloudProvider: 'Azure',
    region: 'francecentral',
    latency: 36,
    status: 'online',
  },

  // Additional servers for better visualization
  {
    id: 'binance-mumbai-1',
    exchange: 'Binance',
    location: {
      city: 'Mumbai',
      country: 'India',
      latitude: 19.076,
      longitude: 72.8777,
    },
    cloudProvider: 'AWS',
    region: 'ap-south-1',
    latency: 58,
    status: 'online',
  },
  {
    id: 'okx-taiwan-1',
    exchange: 'OKX',
    location: {
      city: 'Taipei',
      country: 'Taiwan',
      latitude: 25.033,
      longitude: 121.5654,
    },
    cloudProvider: 'GCP',
    region: 'asia-east1',
    latency: 46,
    status: 'online',
  },
  {
    id: 'binance-california-1',
    exchange: 'Binance',
    location: {
      city: 'San Francisco',
      country: 'United States',
      latitude: 37.7749,
      longitude: -122.4194,
    },
    cloudProvider: 'AWS',
    region: 'us-west-1',
    latency: 41,
    status: 'online',
  },
  {
    id: 'bybit-bahrain-1',
    exchange: 'Bybit',
    location: {
      city: 'Bahrain',
      country: 'Bahrain',
      latitude: 26.0667,
      longitude: 50.5577,
    },
    cloudProvider: 'Azure',
    region: 'uaenorth',
    latency: 72,
    status: 'degraded',
  },
  {
    id: 'coinbase-belgium-1',
    exchange: 'Coinbase',
    location: {
      city: 'Brussels',
      country: 'Belgium',
      latitude: 50.8503,
      longitude: 4.3517,
    },
    cloudProvider: 'GCP',
    region: 'europe-west1',
    latency: 34,
    status: 'online',
  },
  {
    id: 'kraken-stockholm-1',
    exchange: 'Kraken',
    location: {
      city: 'Stockholm',
      country: 'Sweden',
      latitude: 59.3293,
      longitude: 18.0686,
    },
    cloudProvider: 'Azure',
    region: 'swedencentral',
    latency: 38,
    status: 'online',
  },
  {
    id: 'deribit-zurich-1',
    exchange: 'Deribit',
    location: {
      city: 'Zurich',
      country: 'Switzerland',
      latitude: 47.3769,
      longitude: 8.5417,
    },
    cloudProvider: 'AWS',
    region: 'eu-central-2',
    latency: 29,
    status: 'online',
  },
  {
    id: 'okx-osaka-1',
    exchange: 'OKX',
    location: {
      city: 'Osaka',
      country: 'Japan',
      latitude: 34.6937,
      longitude: 135.5023,
    },
    cloudProvider: 'GCP',
    region: 'asia-northeast2',
    latency: 51,
    status: 'online',
  },
  {
    id: 'bybit-jakarta-1',
    exchange: 'Bybit',
    location: {
      city: 'Jakarta',
      country: 'Indonesia',
      latitude: -6.2088,
      longitude: 106.8456,
    },
    cloudProvider: 'Azure',
    region: 'southeastasia',
    latency: 88,
    status: 'degraded',
  },
  {
    id: 'binance-capetown-1',
    exchange: 'Binance',
    location: {
      city: 'Cape Town',
      country: 'South Africa',
      latitude: -33.9249,
      longitude: 18.4241,
    },
    cloudProvider: 'AWS',
    region: 'af-south-1',
    latency: 125,
    status: 'offline',
  },
  {
    id: 'coinbase-montreal-1',
    exchange: 'Coinbase',
    location: {
      city: 'Montreal',
      country: 'Canada',
      latitude: 45.5017,
      longitude: -73.5673,
    },
    cloudProvider: 'GCP',
    region: 'northamerica-northeast1',
    latency: 43,
    status: 'online',
  },
  {
    id: 'kraken-warsaw-1',
    exchange: 'Kraken',
    location: {
      city: 'Warsaw',
      country: 'Poland',
      latitude: 52.2297,
      longitude: 21.0122,
    },
    cloudProvider: 'Azure',
    region: 'polandcentral',
    latency: 45,
    status: 'online',
  },
  {
    id: 'deribit-bangalore-1',
    exchange: 'Deribit',
    location: {
      city: 'Bangalore',
      country: 'India',
      latitude: 12.9716,
      longitude: 77.5946,
    },
    cloudProvider: 'AWS',
    region: 'ap-south-1',
    latency: 68,
    status: 'online',
  },
  {
    id: 'okx-melbourne-1',
    exchange: 'OKX',
    location: {
      city: 'Melbourne',
      country: 'Australia',
      latitude: -37.8136,
      longitude: 144.9631,
    },
    cloudProvider: 'GCP',
    region: 'australia-southeast1',
    latency: 82,
    status: 'online',
  },
  {
    id: 'bybit-milan-1',
    exchange: 'Bybit',
    location: {
      city: 'Milan',
      country: 'Italy',
      latitude: 45.4642,
      longitude: 9.19,
    },
    cloudProvider: 'Azure',
    region: 'italynorth',
    latency: 37,
    status: 'online',
  },
  {
    id: 'binance-chicago-1',
    exchange: 'Binance',
    location: {
      city: 'Chicago',
      country: 'United States',
      latitude: 41.8781,
      longitude: -87.6298,
    },
    cloudProvider: 'AWS',
    region: 'us-east-2',
    latency: 39,
    status: 'online',
  },
  {
    id: 'coinbase-santiago-1',
    exchange: 'Coinbase',
    location: {
      city: 'Santiago',
      country: 'Chile',
      latitude: -33.4489,
      longitude: -70.6693,
    },
    cloudProvider: 'GCP',
    region: 'southamerica-west1',
    latency: 98,
    status: 'degraded',
  },
  {
    id: 'kraken-bangkok-1',
    exchange: 'Kraken',
    location: {
      city: 'Bangkok',
      country: 'Thailand',
      latitude: 13.7563,
      longitude: 100.5018,
    },
    cloudProvider: 'Azure',
    region: 'southeastasia',
    latency: 75,
    status: 'online',
  },
  {
    id: 'deribit-dubai-1',
    exchange: 'Deribit',
    location: {
      city: 'Dubai',
      country: 'UAE',
      latitude: 25.2048,
      longitude: 55.2708,
    },
    cloudProvider: 'AWS',
    region: 'me-south-1',
    latency: 92,
    status: 'degraded',
  },
  {
    id: 'okx-beijing-1',
    exchange: 'OKX',
    location: {
      city: 'Beijing',
      country: 'China',
      latitude: 39.9042,
      longitude: 116.4074,
    },
    cloudProvider: 'GCP',
    region: 'asia-east2',
    latency: 145,
    status: 'offline',
  },
  {
    id: 'bybit-newdelhi-1',
    exchange: 'Bybit',
    location: {
      city: 'New Delhi',
      country: 'India',
      latitude: 28.6139,
      longitude: 77.209,
    },
    cloudProvider: 'Azure',
    region: 'centralindia',
    latency: 71,
    status: 'online',
  },
];

// Calculate summary statistics
const calculateSummary = (servers: ExchangeServer[]) => {
  const totalServers = servers.length;
  const averageLatency =
    servers.reduce((sum, server) => sum + server.latency, 0) / totalServers;

  const byProvider = {
    AWS: servers.filter((s) => s.cloudProvider === 'AWS').length,
    GCP: servers.filter((s) => s.cloudProvider === 'GCP').length,
    Azure: servers.filter((s) => s.cloudProvider === 'Azure').length,
  };

  return {
    totalServers,
    averageLatency: Math.round(averageLatency * 100) / 100,
    byProvider,
  };
};

/**
 * Fetch network latency data for exchange servers
 * This simulates an API call with dummy data
 */
export const fetchExchangeServerData = async (): Promise<NetworkLatencyData> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    timestamp: new Date().toISOString(),
    servers: DUMMY_EXCHANGE_SERVERS,
    summary: calculateSummary(DUMMY_EXCHANGE_SERVERS),
  };
};

/**
 * Fetch data for a specific exchange
 */
export const fetchExchangeServersByExchange = async (
  exchangeName: string
): Promise<ExchangeServer[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return DUMMY_EXCHANGE_SERVERS.filter(
    (server) => server.exchange.toLowerCase() === exchangeName.toLowerCase()
  );
};

/**
 * Fetch data for a specific cloud provider
 */
export const fetchExchangeServersByProvider = async (
  provider: 'AWS' | 'GCP' | 'Azure'
): Promise<ExchangeServer[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return DUMMY_EXCHANGE_SERVERS.filter((server) => server.cloudProvider === provider);
};
