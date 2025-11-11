'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { useMapContext } from '@/context/map-context';
import { ExchangeServer, CLOUD_PROVIDER_COLORS } from '@/lib/types/exchange-server';

interface ExchangeServerMarkersProps {
  servers: ExchangeServer[];
}

export const ExchangeServerMarkers = ({ servers }: ExchangeServerMarkersProps) => {
  const { map } = useMapContext();
  const markersRef = useRef<Map<string, { marker: mapboxgl.Marker; popup: mapboxgl.Popup }>>(new Map());
  const openPopupServerIdRef = useRef<string | null>(null);

  // Helper function to create popup content
  const createPopupContent = (server: ExchangeServer) => {
    const statusColor =
      server.status === 'online'
        ? '#10b981'
        : server.status === 'degraded'
        ? '#f59e0b'
        : '#ef4444';

    return `
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
  };

  // Initial creation of markers (run once when map is ready and we have servers)
  useEffect(() => {
    if (!map || servers.length === 0) {
      console.log('⚠️ Markers not created:', { hasMap: !!map, serversCount: servers.length });
      return;
    }

    // Only create markers if they don't exist yet
    const markersMap = markersRef.current;
    if (markersMap.size > 0) {
      console.log('↩️ Markers already exist, skipping creation');
      return;
    }

    console.log(`🎯 Creating markers for ${servers.length} servers...`);

    // Close popup when clicking on map
    const handleMapClick = () => {
      openPopupServerIdRef.current = null;
    };

    map.on('click', handleMapClick);

    // Create markers for each server (only once)
    servers.forEach((server) => {
      console.log(`➕ Creating marker for ${server.exchange} at [${server.location.longitude}, ${server.location.latitude}]`);

      // Create marker element
      const el = document.createElement('div');
      el.className = 'exchange-marker';
      el.setAttribute('data-server-id', server.id);
      
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
      statusDot.className = 'status-dot';
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

      // Create popup
      const popup = new mapboxgl.Popup({
        offset: 15,
        closeButton: true,
        closeOnClick: false,
        maxWidth: '300px',
      })
        .setLngLat([server.location.longitude, server.location.latitude])
        .setHTML(createPopupContent(server));

      // Add click handler to marker element
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Close all other popups
        markersMap.forEach(({ popup: p }, id) => {
          if (id !== server.id && p.isOpen()) {
            p.remove();
          }
        });
        
        // Toggle current popup
        if (popup.isOpen()) {
          popup.remove();
          openPopupServerIdRef.current = null;
        } else {
          popup.addTo(map);
          openPopupServerIdRef.current = server.id;
        }
      });

      // Handle popup close button
      popup.on('close', () => {
        if (openPopupServerIdRef.current === server.id) {
          openPopupServerIdRef.current = null;
        }
      });

      // Create marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([server.location.longitude, server.location.latitude])
        .addTo(map);

      markersMap.set(server.id, { marker, popup });
      console.log(`✅ Marker created and added for ${server.exchange} (${server.id})`);
    });

    console.log(`🎯 Total markers in map: ${markersMap.size}`);

    // Cleanup on unmount
    return () => {
      map.off('click', handleMapClick);
      markersMap.forEach(({ marker, popup }) => {
        marker.remove();
        popup.remove();
      });
      markersMap.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, servers.length]); // Only run when map is ready or number of servers changes (not when data updates)

  // Update markers when server data changes
  useEffect(() => {
    if (!map || servers.length === 0) return;

    servers.forEach((server) => {
      const markerData = markersRef.current.get(server.id);
      if (!markerData) return;

      const { marker, popup } = markerData;

      // Update status dot color
      const el = marker.getElement();
      const statusDot = el.querySelector('.status-dot') as HTMLElement;
      if (statusDot) {
        const statusColor =
          server.status === 'online'
            ? '#10b981'
            : server.status === 'degraded'
            ? '#f59e0b'
            : '#ef4444';
        statusDot.style.backgroundColor = statusColor;
      }

      // Update popup content
      popup.setHTML(createPopupContent(server));

      // If this popup is currently open, log the update
      if (openPopupServerIdRef.current === server.id && popup.isOpen()) {
        console.log(`🔄 Updated popup for ${server.exchange}: ${server.latency}ms`);
      }
    });
  }, [servers, map]);

  return null;
};
