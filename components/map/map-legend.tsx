'use client';

import { CLOUD_PROVIDER_INFO } from '@/lib/types/exchange-server';

interface MapLegendProps {
  serverCounts?: {
    AWS: number;
    GCP: number;
    Azure: number;
  };
}

export const MapLegend = ({ serverCounts }: MapLegendProps) => {
  const providers = Object.entries(CLOUD_PROVIDER_INFO);

  return (
    <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-xl p-4 z-10 min-w-[200px]">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">Cloud Providers</h3>
      <div className="space-y-2">
        {providers.map(([key, info]) => (
          <div key={key} className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: info.color }}
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700">{info.shortName}</div>
              {serverCounts && (
                <div className="text-xs text-gray-500">
                  {serverCounts[key as keyof typeof serverCounts]} servers
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-200">
        <h4 className="text-xs font-semibold text-gray-600 mb-2">Status</h4>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs text-gray-600">Online</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="text-xs text-gray-600">Degraded</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-xs text-gray-600">Offline</span>
          </div>
        </div>
      </div>
    </div>
  );
};
