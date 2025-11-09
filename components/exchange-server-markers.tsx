'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useMapContext } from '@/context/map-context';
import { fetchExchangeServerData } from '@/lib/api/exchange-data';
import { ExchangeServer, CLOUD_PROVIDER_COLORS } from '@/lib/types/exchange-server';

export const ExchangeServerMarkers = () => {
  const { map } = useMapContext();
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const currentPopupRef = useRef<mapboxgl.Popup | null>(null);
  const [servers, setServers] = useState<ExchangeServer[]>([]);

  // Fetch server data
  useEffect(() => {
    fetchExchangeServerData()
      .then((data) => {
        setServers(data.servers);
      })
      .catch((error) => {
        console.error('Failed to fetch exchange server data:', error);
      });
  }, []);

  // Create markers when map and servers are ready
  useEffect(() => {
    if (!map || servers.length === 0) return;

    // Clear existing markers and current popup
    markersRef.current.forEach((marker) => marker.remove());
    if (currentPopupRef.current) {
      currentPopupRef.current.remove();
      currentPopupRef.current = null;
    }
    markersRef.current = [];

    // Close popup when clicking on map
    const handleMapClick = () => {
      if (currentPopupRef.current) {
        currentPopupRef.current.remove();
        currentPopupRef.current = null;
      }
    };

    map.on('click', handleMapClick);

    // Create markers for each server
    servers.forEach((server) => {
      // Create marker element
      const el = document.createElement('div');
      el.className = 'exchange-marker';
      
      // Create inner circle
      const innerCircle = document.createElement('div');
      innerCircle.style.width = '20px';
      innerCircle.style.height = '20px';
      innerCircle.style.borderRadius = '50%';
      innerCircle.style.backgroundColor = CLOUD_PROVIDER_COLORS[server.cloudProvider];
      innerCircle.style.border = '3px solid white';
      innerCircle.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      innerCircle.style.cursor = 'pointer';
      innerCircle.style.transition = 'transform 0.2s ease';
      innerCircle.style.position = 'relative';

      // Add status indicator
      const statusColor =
        server.status === 'online'
          ? '#10b981'
          : server.status === 'degraded'
          ? '#f59e0b'
          : '#ef4444';
      
      const statusDot = document.createElement('div');
      statusDot.style.position = 'absolute';
      statusDot.style.top = '-2px';
      statusDot.style.right = '-2px';
      statusDot.style.width = '8px';
      statusDot.style.height = '8px';
      statusDot.style.borderRadius = '50%';
      statusDot.style.backgroundColor = statusColor;
      statusDot.style.border = '2px solid white';
      statusDot.style.pointerEvents = 'none';
      innerCircle.appendChild(statusDot);

      el.appendChild(innerCircle);

      // Hover effect
      el.addEventListener('mouseenter', () => {
        innerCircle.style.transform = 'scale(1.3)';
      });
      el.addEventListener('mouseleave', () => {
        innerCircle.style.transform = 'scale(1)';
      });

      // Create popup content
      const popupContent = `
        <div style="padding: 8px; min-width: 200px;">
          <div style="font-weight: 600; font-size: 16px; color: #1f2937; margin-bottom: 8px;">
            ${server.exchange}
          </div>
          <div style="display: grid; gap: 6px; font-size: 13px; color: #4b5563;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-weight: 500;">📍 Location:</span>
              <span>${server.location.city}, ${server.location.country}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-weight: 500;">☁️ Provider:</span>
              <span style="color: ${CLOUD_PROVIDER_COLORS[server.cloudProvider]}; font-weight: 600;">
                ${server.cloudProvider}
              </span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-weight: 500;">🌐 Region:</span>
              <span>${server.region}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-weight: 500;">⚡ Latency:</span>
              <span style="color: ${server.latency < 50 ? '#10b981' : server.latency < 80 ? '#f59e0b' : '#ef4444'}; font-weight: 600;">
                ${server.latency}ms
              </span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-weight: 500;">🔔 Status:</span>
              <span style="color: ${statusColor}; font-weight: 600; text-transform: capitalize;">
                ${server.status}
              </span>
            </div>
          </div>
        </div>
      `;

      // Create popup
      const popup = new mapboxgl.Popup({
        offset: 15,
        closeButton: true,
        closeOnClick: false,
        maxWidth: '300px',
      })
        .setLngLat([server.location.longitude, server.location.latitude])
        .setHTML(popupContent);

      // Add click handler to marker element to manage popup state
      el.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent map click event
        
        // Close current popup if exists
        if (currentPopupRef.current) {
          currentPopupRef.current.remove();
        }
        
        // Open new popup at marker location
        popup.addTo(map);
        currentPopupRef.current = popup;
      });

      // Handle popup close button
      popup.on('close', () => {
        if (currentPopupRef.current === popup) {
          currentPopupRef.current = null;
        }
      });

      // Create marker - let Mapbox handle positioning
      const marker = new mapboxgl.Marker(el)
        .setLngLat([server.location.longitude, server.location.latitude])
        .addTo(map);

      markersRef.current.push(marker);
    });

    // Cleanup on unmount
    return () => {
      map.off('click', handleMapClick);
      markersRef.current.forEach((marker) => marker.remove());
      if (currentPopupRef.current) {
        currentPopupRef.current.remove();
      }
    };
  }, [map, servers]);

  return null;
};
