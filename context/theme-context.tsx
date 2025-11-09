'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type MapStyle = 'standard' | 'light' | 'dark';

interface ThemeContextType {
  mapStyle: MapStyle;
  setMapStyle: (style: MapStyle) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mapStyle, setMapStyle] = useState<MapStyle>(() => {
    // Initialize map style from localStorage
    if (typeof window !== 'undefined') {
      const savedStyle = localStorage.getItem('mapStyle') as MapStyle;
      if (savedStyle) {
        return savedStyle;
      }
    }
    return 'standard';
  });

  const handleSetMapStyle = (style: MapStyle) => {
    setMapStyle(style);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mapStyle', style);
    }
  };

  return (
    <ThemeContext.Provider value={{ mapStyle, setMapStyle: handleSetMapStyle }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
