// Types
export interface MapConfig {
  center: [number, number];
  zoom: number;
  pitch?: number;
  bearing?: number;
  style?: string;
}

export interface LocationCoordinates {
  longitude: number;
  latitude: number;
}

// Constants
export const DEFAULT_LOCATION: [number, number] = [-74.5, 40]; // New York
export const DEFAULT_ZOOM = 9;
export const DEFAULT_PITCH = 60;
export const DEFAULT_BEARING = -17.6;
export const MAP_STYLE_STANDARD = 'mapbox://styles/mapbox/standard';
export const MAP_STYLE_LIGHT = 'mapbox://styles/mapbox/light-v11';
export const MAP_STYLE_DARK = 'mapbox://styles/mapbox/dark-v11';
export const DEFAULT_MAP_STYLE = MAP_STYLE_STANDARD;

// Get map style based on theme
export const getMapStyle = (style: 'standard' | 'light' | 'dark'): string => {
  switch (style) {
    case 'light':
      return MAP_STYLE_LIGHT;
    case 'dark':
      return MAP_STYLE_DARK;
    case 'standard':
    default:
      return MAP_STYLE_STANDARD;
  }
};

// Geolocation utility
export const getUserLocation = (): Promise<LocationCoordinates> => {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  });
};

// Map configuration helper
export const createMapConfig = (
  center: [number, number],
  options?: Partial<MapConfig>
): MapConfig => {
  return {
    center,
    zoom: options?.zoom ?? DEFAULT_ZOOM,
    pitch: options?.pitch ?? DEFAULT_PITCH,
    bearing: options?.bearing ?? DEFAULT_BEARING,
    style: options?.style ?? DEFAULT_MAP_STYLE,
  };
};

// Marker color helper
export const getMarkerColor = (isUserLocation: boolean): string => {
  return isUserLocation ? '#FF0000' : '#3B82F6';
};
