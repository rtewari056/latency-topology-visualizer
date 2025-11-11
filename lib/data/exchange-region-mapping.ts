// Mapping of cryptocurrency exchanges to their actual server locations and cloud providers
// Based on publicly available information about exchange infrastructure

export interface ExchangeRegionMapping {
  exchange: string;
  regions: {
    region: string;
    provider: 'AWS' | 'GCP' | 'Azure';
    isPrimary: boolean; // Main trading engine location
  }[];
}

export const EXCHANGE_REGION_MAPPINGS: ExchangeRegionMapping[] = [
  {
    exchange: 'Binance',
    regions: [
      { region: 'ap-northeast-1', provider: 'AWS', isPrimary: true }, // Tokyo - Primary
      { region: 'ap-southeast-1', provider: 'AWS', isPrimary: false }, // Singapore
      { region: 'ap-south-1', provider: 'AWS', isPrimary: false }, // Mumbai
      { region: 'ap-south-2', provider: 'AWS', isPrimary: false }, // Hyderabad
      { region: 'us-east-1', provider: 'AWS', isPrimary: false }, // N. Virginia
      { region: 'eu-central-1', provider: 'AWS', isPrimary: false }, // Frankfurt
      { region: 'asia-south1', provider: 'GCP', isPrimary: false }, // Mumbai GCP
      { region: 'asia-south2', provider: 'GCP', isPrimary: false }, // Delhi GCP
      { region: 'centralindia', provider: 'Azure', isPrimary: false }, // Pune Azure
      { region: 'europe-west1', provider: 'GCP', isPrimary: false }, // Belgium GCP
    ],
  },
  {
    exchange: 'OKX',
    regions: [
      { region: 'ap-southeast-1', provider: 'AWS', isPrimary: true }, // Singapore - Primary
      { region: 'ap-south-1', provider: 'AWS', isPrimary: false }, // Mumbai
      { region: 'ap-south-1-del', provider: 'AWS', isPrimary: false }, // Delhi
      { region: 'ap-northeast-1', provider: 'AWS', isPrimary: false }, // Tokyo
      { region: 'us-west-2', provider: 'AWS', isPrimary: false }, // Oregon
      { region: 'eu-west-1', provider: 'AWS', isPrimary: false }, // Ireland
      { region: 'asia-northeast1', provider: 'GCP', isPrimary: false }, // Tokyo GCP
      { region: 'asia-south1-blr', provider: 'GCP', isPrimary: false }, // Bangalore GCP
      { region: 'southindia', provider: 'Azure', isPrimary: false }, // Chennai Azure
      { region: 'westeurope', provider: 'Azure', isPrimary: false }, // Netherlands Azure
    ],
  },
  {
    exchange: 'Bybit',
    regions: [
      { region: 'ap-southeast-1', provider: 'AWS', isPrimary: true }, // Singapore - Primary
      { region: 'ap-south-1', provider: 'AWS', isPrimary: false }, // Mumbai
      { region: 'ap-south-2', provider: 'AWS', isPrimary: false }, // Hyderabad
      { region: 'ap-northeast-1', provider: 'AWS', isPrimary: false }, // Tokyo
      { region: 'us-east-1', provider: 'AWS', isPrimary: false }, // N. Virginia
      { region: 'asia-south1', provider: 'GCP', isPrimary: false }, // Mumbai GCP
      { region: 'westindia', provider: 'Azure', isPrimary: false }, // Mumbai Azure
      { region: 'us-central1', provider: 'GCP', isPrimary: false }, // Iowa GCP
      { region: 'eastus', provider: 'Azure', isPrimary: false }, // Virginia Azure
    ],
  },
  {
    exchange: 'Deribit',
    regions: [
      { region: 'eu-central-1', provider: 'AWS', isPrimary: true }, // Frankfurt - Primary
      { region: 'us-east-1', provider: 'AWS', isPrimary: false }, // N. Virginia
      { region: 'ap-southeast-1', provider: 'AWS', isPrimary: false }, // Singapore
      { region: 'europe-west3', provider: 'GCP', isPrimary: false }, // Frankfurt GCP
      { region: 'northeurope', provider: 'Azure', isPrimary: false }, // Ireland Azure
    ],
  },
  {
    exchange: 'Coinbase',
    regions: [
      { region: 'us-east-1', provider: 'AWS', isPrimary: true }, // N. Virginia - Primary
      { region: 'us-west-1', provider: 'AWS', isPrimary: false }, // N. California
      { region: 'eu-west-1', provider: 'AWS', isPrimary: false }, // Ireland
      { region: 'us-west1', provider: 'GCP', isPrimary: false }, // Oregon GCP
      { region: 'westus', provider: 'Azure', isPrimary: false }, // California Azure
    ],
  },
  {
    exchange: 'Kraken',
    regions: [
      { region: 'us-east-1', provider: 'AWS', isPrimary: true }, // N. Virginia - Primary
      { region: 'eu-west-1', provider: 'AWS', isPrimary: false }, // Ireland
      { region: 'ap-northeast-1', provider: 'AWS', isPrimary: false }, // Tokyo
      { region: 'asia-east1', provider: 'GCP', isPrimary: false }, // Taiwan GCP
      { region: 'westeurope', provider: 'Azure', isPrimary: false }, // Netherlands Azure
    ],
  },
  {
    exchange: 'Bitfinex',
    regions: [
      { region: 'eu-west-1', provider: 'AWS', isPrimary: true }, // Ireland - Primary
      { region: 'us-east-1', provider: 'AWS', isPrimary: false }, // N. Virginia
      { region: 'ap-southeast-1', provider: 'AWS', isPrimary: false }, // Singapore
      { region: 'europe-west1', provider: 'GCP', isPrimary: false }, // Belgium GCP
    ],
  },
  {
    exchange: 'Huobi',
    regions: [
      { region: 'ap-southeast-1', provider: 'AWS', isPrimary: true }, // Singapore - Primary
      { region: 'ap-northeast-1', provider: 'AWS', isPrimary: false }, // Tokyo
      { region: 'ap-south-1-del', provider: 'AWS', isPrimary: false }, // Delhi
      { region: 'us-west-2', provider: 'AWS', isPrimary: false }, // Oregon
      { region: 'asia-south1', provider: 'GCP', isPrimary: false }, // Mumbai GCP
      { region: 'asia-south2', provider: 'GCP', isPrimary: false }, // Delhi GCP
      { region: 'centralindia', provider: 'Azure', isPrimary: false }, // Pune Azure
      { region: 'southindia', provider: 'Azure', isPrimary: false }, // Chennai Azure
      { region: 'eastus', provider: 'Azure', isPrimary: false }, // Virginia Azure
    ],
  },
  {
    exchange: 'KuCoin',
    regions: [
      { region: 'ap-southeast-1', provider: 'AWS', isPrimary: true }, // Singapore - Primary
      { region: 'us-east-1', provider: 'AWS', isPrimary: false }, // N. Virginia
      { region: 'eu-central-1', provider: 'AWS', isPrimary: false }, // Frankfurt
      { region: 'ap-east-1', provider: 'AWS', isPrimary: false }, // Hong Kong
      { region: 'ca-central-1', provider: 'AWS', isPrimary: false }, // Montreal
      { region: 'us-central1', provider: 'GCP', isPrimary: false }, // Iowa GCP
      { region: 'uksouth', provider: 'Azure', isPrimary: false }, // London Azure
      { region: 'northeurope', provider: 'Azure', isPrimary: false }, // Ireland Azure
    ],
  },
  {
    exchange: 'Gate.io',
    regions: [
      { region: 'ap-southeast-1', provider: 'AWS', isPrimary: true }, // Singapore - Primary
      { region: 'ap-northeast-1', provider: 'AWS', isPrimary: false }, // Tokyo
      { region: 'us-west-2', provider: 'AWS', isPrimary: false }, // Oregon
      { region: 'eu-west-2', provider: 'AWS', isPrimary: false }, // London
      { region: 'ap-southeast-3', provider: 'AWS', isPrimary: false }, // Jakarta
      { region: 'asia-northeast1', provider: 'GCP', isPrimary: false }, // Tokyo GCP
      { region: 'koreacentral', provider: 'Azure', isPrimary: false }, // Seoul Azure
    ],
  },
  {
    exchange: 'Bitget',
    regions: [
      { region: 'ap-southeast-1', provider: 'AWS', isPrimary: true }, // Singapore - Primary
      { region: 'us-east-1', provider: 'AWS', isPrimary: false }, // N. Virginia
      { region: 'eu-west-1', provider: 'AWS', isPrimary: false }, // Ireland
      { region: 'sa-east-1', provider: 'AWS', isPrimary: false }, // São Paulo
      { region: 'us-west1', provider: 'GCP', isPrimary: false }, // Oregon GCP
      { region: 'southamerica-east1', provider: 'GCP', isPrimary: false }, // São Paulo GCP
      { region: 'brazilsouth', provider: 'Azure', isPrimary: false }, // Brazil Azure
      { region: 'westus', provider: 'Azure', isPrimary: false }, // California Azure
    ],
  },
  {
    exchange: 'MEXC',
    regions: [
      { region: 'ap-southeast-1', provider: 'AWS', isPrimary: true }, // Singapore - Primary
      { region: 'ap-northeast-1', provider: 'AWS', isPrimary: false }, // Tokyo
      { region: 'us-west-2', provider: 'AWS', isPrimary: false }, // Oregon
      { region: 'eu-west-3', provider: 'AWS', isPrimary: false }, // Paris
      { region: 'me-south-1', provider: 'AWS', isPrimary: false }, // Bahrain
      { region: 'af-south-1', provider: 'AWS', isPrimary: false }, // Cape Town
      { region: 'asia-east1', provider: 'GCP', isPrimary: false }, // Taiwan GCP
      { region: 'uaenorth', provider: 'Azure', isPrimary: false }, // Dubai Azure
      { region: 'southafricanorth', provider: 'Azure', isPrimary: false }, // Johannesburg Azure
      { region: 'northeurope', provider: 'Azure', isPrimary: false }, // Ireland Azure
    ],
  },
  {
    exchange: 'Crypto.com',
    regions: [
      { region: 'ap-southeast-1', provider: 'AWS', isPrimary: true }, // Singapore - Primary
      { region: 'us-east-1', provider: 'AWS', isPrimary: false }, // N. Virginia
      { region: 'eu-north-1', provider: 'AWS', isPrimary: false }, // Stockholm
      { region: 'ap-east-1', provider: 'AWS', isPrimary: false }, // Hong Kong
      { region: 'asia-southeast1', provider: 'GCP', isPrimary: false }, // Singapore GCP
      { region: 'europe-west2', provider: 'GCP', isPrimary: false }, // London GCP
      { region: 'japaneast', provider: 'Azure', isPrimary: false }, // Tokyo Azure
      { region: 'canadacentral', provider: 'Azure', isPrimary: false }, // Toronto Azure
    ],
  },
];

// Helper functions
export function getExchangeRegions(exchangeName: string): ExchangeRegionMapping | undefined {
  return EXCHANGE_REGION_MAPPINGS.find(
    (mapping) => mapping.exchange.toLowerCase() === exchangeName.toLowerCase()
  );
}

export function getPrimaryRegion(
  exchangeName: string
): { region: string; provider: 'AWS' | 'GCP' | 'Azure' } | undefined {
  const mapping = getExchangeRegions(exchangeName);
  const primary = mapping?.regions.find((r) => r.isPrimary);
  return primary;
}

export function getAllExchangeNames(): string[] {
  return EXCHANGE_REGION_MAPPINGS.map((m) => m.exchange);
}
