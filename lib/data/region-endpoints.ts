export interface RegionEndpoint {
  region: string;
  endpoint: string;
  provider: 'AWS' | 'GCP' | 'Azure';
  location: {
    city: string;
    country: string;
    latitude: number;
    longitude: number;
  };
}

// Public endpoints for latency measurement
// Using publicly accessible endpoints that respond to HEAD/GET requests
export const REGION_ENDPOINTS: RegionEndpoint[] = [
  // ==================== AWS REGIONS ====================
  {
    region: 'us-east-1',
    endpoint: 'https://s3.us-east-1.amazonaws.com',
    provider: 'AWS',
    location: {
      city: 'N. Virginia',
      country: 'USA',
      latitude: 37.4316,
      longitude: -78.6569,
    },
  },
  {
    region: 'us-west-1',
    endpoint: 'https://s3.us-west-1.amazonaws.com',
    provider: 'AWS',
    location: {
      city: 'N. California',
      country: 'USA',
      latitude: 37.3541,
      longitude: -121.9552,
    },
  },
  {
    region: 'us-west-2',
    endpoint: 'https://s3.us-west-2.amazonaws.com',
    provider: 'AWS',
    location: {
      city: 'Oregon',
      country: 'USA',
      latitude: 45.5152,
      longitude: -122.6784,
    },
  },
  {
    region: 'eu-west-1',
    endpoint: 'https://s3.eu-west-1.amazonaws.com',
    provider: 'AWS',
    location: {
      city: 'Ireland',
      country: 'Ireland',
      latitude: 53.3498,
      longitude: -6.2603,
    },
  },
  {
    region: 'eu-central-1',
    endpoint: 'https://s3.eu-central-1.amazonaws.com',
    provider: 'AWS',
    location: {
      city: 'Frankfurt',
      country: 'Germany',
      latitude: 50.1109,
      longitude: 8.6821,
    },
  },
  {
    region: 'ap-northeast-1',
    endpoint: 'https://s3.ap-northeast-1.amazonaws.com',
    provider: 'AWS',
    location: {
      city: 'Tokyo',
      country: 'Japan',
      latitude: 35.6762,
      longitude: 139.6503,
    },
  },
  {
    region: 'ap-southeast-1',
    endpoint: 'https://s3.ap-southeast-1.amazonaws.com',
    provider: 'AWS',
    location: {
      city: 'Singapore',
      country: 'Singapore',
      latitude: 1.3521,
      longitude: 103.8198,
    },
  },
  {
    region: 'ap-southeast-2',
    endpoint: 'https://s3.ap-southeast-2.amazonaws.com',
    provider: 'AWS',
    location: {
      city: 'Sydney',
      country: 'Australia',
      latitude: -33.8688,
      longitude: 151.2093,
    },
  },
  {
    region: 'ap-south-1',
    endpoint: 'https://s3.ap-south-1.amazonaws.com',
    provider: 'AWS',
    location: {
      city: 'Mumbai',
      country: 'India',
      latitude: 19.076,
      longitude: 72.8777,
    },
  },
  {
    region: 'ap-south-2',
    endpoint: 'https://s3.ap-south-2.amazonaws.com',
    provider: 'AWS',
    location: {
      city: 'Hyderabad',
      country: 'India',
      latitude: 17.385,
      longitude: 78.4867,
    },
  },
  {
    region: 'ap-south-1-del',
    endpoint: 'https://s3.amazonaws.com',
    provider: 'AWS',
    location: {
      city: 'Delhi',
      country: 'India',
      latitude: 28.7041,
      longitude: 77.1025,
    },
  },
  {
    region: 'sa-east-1',
    endpoint: 'https://s3.sa-east-1.amazonaws.com',
    provider: 'AWS',
    location: {
      city: 'São Paulo',
      country: 'Brazil',
      latitude: -23.5505,
      longitude: -46.6333,
    },
  },
  {
    region: 'ca-central-1',
    endpoint: 'https://s3.ca-central-1.amazonaws.com',
    provider: 'AWS',
    location: {
      city: 'Montreal',
      country: 'Canada',
      latitude: 45.5017,
      longitude: -73.5673,
    },
  },
  {
    region: 'eu-west-2',
    endpoint: 'https://s3.eu-west-2.amazonaws.com',
    provider: 'AWS',
    location: {
      city: 'London',
      country: 'UK',
      latitude: 51.5074,
      longitude: -0.1278,
    },
  },
  {
    region: 'eu-west-3',
    endpoint: 'https://s3.eu-west-3.amazonaws.com',
    provider: 'AWS',
    location: {
      city: 'Paris',
      country: 'France',
      latitude: 48.8566,
      longitude: 2.3522,
    },
  },
  {
    region: 'eu-north-1',
    endpoint: 'https://s3.eu-north-1.amazonaws.com',
    provider: 'AWS',
    location: {
      city: 'Stockholm',
      country: 'Sweden',
      latitude: 59.3293,
      longitude: 18.0686,
    },
  },
  {
    region: 'ap-east-1',
    endpoint: 'https://s3.ap-east-1.amazonaws.com',
    provider: 'AWS',
    location: {
      city: 'Hong Kong',
      country: 'Hong Kong',
      latitude: 22.3964,
      longitude: 114.1095,
    },
  },
  {
    region: 'me-south-1',
    endpoint: 'https://s3.me-south-1.amazonaws.com',
    provider: 'AWS',
    location: {
      city: 'Bahrain',
      country: 'Bahrain',
      latitude: 26.0667,
      longitude: 50.5577,
    },
  },
  {
    region: 'af-south-1',
    endpoint: 'https://s3.af-south-1.amazonaws.com',
    provider: 'AWS',
    location: {
      city: 'Cape Town',
      country: 'South Africa',
      latitude: -33.9249,
      longitude: 18.4241,
    },
  },
  {
    region: 'ap-southeast-3',
    endpoint: 'https://s3.ap-southeast-3.amazonaws.com',
    provider: 'AWS',
    location: {
      city: 'Jakarta',
      country: 'Indonesia',
      latitude: -6.2088,
      longitude: 106.8456,
    },
  },

  // ==================== GCP REGIONS ====================
  {
    region: 'us-central1',
    endpoint: 'https://www.gstatic.com',
    provider: 'GCP',
    location: {
      city: 'Iowa',
      country: 'USA',
      latitude: 41.878,
      longitude: -93.0977,
    },
  },
  {
    region: 'us-west1',
    endpoint: 'https://storage.googleapis.com',
    provider: 'GCP',
    location: {
      city: 'Oregon',
      country: 'USA',
      latitude: 45.5152,
      longitude: -122.6784,
    },
  },
  {
    region: 'asia-east1',
    endpoint: 'https://fonts.gstatic.com',
    provider: 'GCP',
    location: {
      city: 'Taiwan',
      country: 'Taiwan',
      latitude: 25.033,
      longitude: 121.5654,
    },
  },
  {
    region: 'asia-northeast1',
    endpoint: 'https://www.google.com',
    provider: 'GCP',
    location: {
      city: 'Tokyo',
      country: 'Japan',
      latitude: 35.6762,
      longitude: 139.6503,
    },
  },
  {
    region: 'asia-south1',
    endpoint: 'https://fonts.googleapis.com',
    provider: 'GCP',
    location: {
      city: 'Mumbai',
      country: 'India',
      latitude: 19.076,
      longitude: 72.8777,
    },
  },
  {
    region: 'asia-south2',
    endpoint: 'https://www.google.com',
    provider: 'GCP',
    location: {
      city: 'Delhi',
      country: 'India',
      latitude: 28.7041,
      longitude: 77.1025,
    },
  },
  {
    region: 'asia-south1-blr',
    endpoint: 'https://cloud.google.com',
    provider: 'GCP',
    location: {
      city: 'Bangalore',
      country: 'India',
      latitude: 12.9716,
      longitude: 77.5946,
    },
  },
  {
    region: 'europe-west1',
    endpoint: 'https://ajax.googleapis.com',
    provider: 'GCP',
    location: {
      city: 'Belgium',
      country: 'Belgium',
      latitude: 50.8503,
      longitude: 4.3517,
    },
  },
  {
    region: 'europe-west3',
    endpoint: 'https://developers.google.com',
    provider: 'GCP',
    location: {
      city: 'Frankfurt',
      country: 'Germany',
      latitude: 50.1109,
      longitude: 8.6821,
    },
  },
  {
    region: 'asia-southeast1',
    endpoint: 'https://maps.googleapis.com',
    provider: 'GCP',
    location: {
      city: 'Singapore',
      country: 'Singapore',
      latitude: 1.3521,
      longitude: 103.8198,
    },
  },
  {
    region: 'australia-southeast1',
    endpoint: 'https://translate.googleapis.com',
    provider: 'GCP',
    location: {
      city: 'Sydney',
      country: 'Australia',
      latitude: -33.8688,
      longitude: 151.2093,
    },
  },
  {
    region: 'europe-west2',
    endpoint: 'https://apis.google.com',
    provider: 'GCP',
    location: {
      city: 'London',
      country: 'UK',
      latitude: 51.5074,
      longitude: -0.1278,
    },
  },
  {
    region: 'europe-west4',
    endpoint: 'https://accounts.google.com',
    provider: 'GCP',
    location: {
      city: 'Netherlands',
      country: 'Netherlands',
      latitude: 52.3676,
      longitude: 4.9041,
    },
  },
  {
    region: 'southamerica-east1',
    endpoint: 'https://play.google.com',
    provider: 'GCP',
    location: {
      city: 'São Paulo',
      country: 'Brazil',
      latitude: -23.5505,
      longitude: -46.6333,
    },
  },
  {
    region: 'northamerica-northeast1',
    endpoint: 'https://drive.google.com',
    provider: 'GCP',
    location: {
      city: 'Montreal',
      country: 'Canada',
      latitude: 45.5017,
      longitude: -73.5673,
    },
  },
  {
    region: 'asia-southeast2',
    endpoint: 'https://youtube.com',
    provider: 'GCP',
    location: {
      city: 'Jakarta',
      country: 'Indonesia',
      latitude: -6.2088,
      longitude: 106.8456,
    },
  },

  // ==================== AZURE REGIONS ====================
  {
    region: 'eastus',
    endpoint: 'https://azure.microsoft.com',
    provider: 'Azure',
    location: {
      city: 'Virginia',
      country: 'USA',
      latitude: 37.3719,
      longitude: -79.8164,
    },
  },
  {
    region: 'westus',
    endpoint: 'https://aka.ms',
    provider: 'Azure',
    location: {
      city: 'California',
      country: 'USA',
      latitude: 37.783,
      longitude: -122.417,
    },
  },
  {
    region: 'westeurope',
    endpoint: 'https://portal.azure.com',
    provider: 'Azure',
    location: {
      city: 'Netherlands',
      country: 'Netherlands',
      latitude: 52.3676,
      longitude: 4.9041,
    },
  },
  {
    region: 'northeurope',
    endpoint: 'https://docs.microsoft.com',
    provider: 'Azure',
    location: {
      city: 'Ireland',
      country: 'Ireland',
      latitude: 53.3498,
      longitude: -6.2603,
    },
  },
  {
    region: 'eastasia',
    endpoint: 'https://learn.microsoft.com',
    provider: 'Azure',
    location: {
      city: 'Hong Kong',
      country: 'Hong Kong',
      latitude: 22.3964,
      longitude: 114.1095,
    },
  },
  {
    region: 'southeastasia',
    endpoint: 'https://techcommunity.microsoft.com',
    provider: 'Azure',
    location: {
      city: 'Singapore',
      country: 'Singapore',
      latitude: 1.3521,
      longitude: 103.8198,
    },
  },
  {
    region: 'centralindia',
    endpoint: 'https://azure.microsoft.com/en-in',
    provider: 'Azure',
    location: {
      city: 'Pune',
      country: 'India',
      latitude: 18.5204,
      longitude: 73.8567,
    },
  },
  {
    region: 'southindia',
    endpoint: 'https://microsoft.com',
    provider: 'Azure',
    location: {
      city: 'Chennai',
      country: 'India',
      latitude: 13.0827,
      longitude: 80.2707,
    },
  },
  {
    region: 'westindia',
    endpoint: 'https://www.microsoft.com/en-in',
    provider: 'Azure',
    location: {
      city: 'Mumbai',
      country: 'India',
      latitude: 19.076,
      longitude: 72.8777,
    },
  },
  {
    region: 'australiaeast',
    endpoint: 'https://devblogs.microsoft.com',
    provider: 'Azure',
    location: {
      city: 'Sydney',
      country: 'Australia',
      latitude: -33.8688,
      longitude: 151.2093,
    },
  },
  {
    region: 'canadacentral',
    endpoint: 'https://visualstudio.microsoft.com',
    provider: 'Azure',
    location: {
      city: 'Toronto',
      country: 'Canada',
      latitude: 43.6532,
      longitude: -79.3832,
    },
  },
  {
    region: 'uksouth',
    endpoint: 'https://office.com',
    provider: 'Azure',
    location: {
      city: 'London',
      country: 'UK',
      latitude: 51.5074,
      longitude: -0.1278,
    },
  },
  {
    region: 'francecentral',
    endpoint: 'https://outlook.com',
    provider: 'Azure',
    location: {
      city: 'Paris',
      country: 'France',
      latitude: 48.8566,
      longitude: 2.3522,
    },
  },
  {
    region: 'germanywestcentral',
    endpoint: 'https://powerplatform.microsoft.com',
    provider: 'Azure',
    location: {
      city: 'Frankfurt',
      country: 'Germany',
      latitude: 50.1109,
      longitude: 8.6821,
    },
  },
  {
    region: 'brazilsouth',
    endpoint: 'https://www.microsoft.com/pt-br',
    provider: 'Azure',
    location: {
      city: 'São Paulo',
      country: 'Brazil',
      latitude: -23.5505,
      longitude: -46.6333,
    },
  },
  {
    region: 'japaneast',
    endpoint: 'https://www.microsoft.com/ja-jp',
    provider: 'Azure',
    location: {
      city: 'Tokyo',
      country: 'Japan',
      latitude: 35.6762,
      longitude: 139.6503,
    },
  },
  {
    region: 'koreacentral',
    endpoint: 'https://www.microsoft.com/ko-kr',
    provider: 'Azure',
    location: {
      city: 'Seoul',
      country: 'South Korea',
      latitude: 37.5665,
      longitude: 126.978,
    },
  },
  {
    region: 'uaenorth',
    endpoint: 'https://www.microsoft.com/ar-ae',
    provider: 'Azure',
    location: {
      city: 'Dubai',
      country: 'UAE',
      latitude: 25.2048,
      longitude: 55.2708,
    },
  },
  {
    region: 'southafricanorth',
    endpoint: 'https://www.microsoft.com/en-za',
    provider: 'Azure',
    location: {
      city: 'Johannesburg',
      country: 'South Africa',
      latitude: -26.2041,
      longitude: 28.0473,
    },
  },
];

// Helper to get endpoint by region
export function getEndpointByRegion(region: string): RegionEndpoint | undefined {
  return REGION_ENDPOINTS.find((ep) => ep.region === region);
}

// Helper to get all endpoints by provider
export function getEndpointsByProvider(provider: 'AWS' | 'GCP' | 'Azure'): RegionEndpoint[] {
  return REGION_ENDPOINTS.filter((ep) => ep.provider === provider);
}
