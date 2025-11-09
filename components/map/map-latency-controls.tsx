'use client';

import { useState } from 'react';
import { LatencyRange } from '@/lib/types/latency';

interface LatencyControlsProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  updateInterval: number;
  onIntervalChange: (interval: number) => void;
  activeRanges: Set<LatencyRange>;
  onRangeToggle: (range: LatencyRange) => void;
  stats?: {
    min: number;
    max: number;
    avg: number;
    median: number;
  };
}

export default function LatencyControls({
  isEnabled,
  onToggle,
  updateInterval,
  onIntervalChange,
  activeRanges,
  onRangeToggle,
  stats,
}: LatencyControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const intervals = [
    { label: '5s', value: 5000 },
    { label: '10s', value: 10000 },
    { label: '15s', value: 15000 },
    { label: '30s', value: 30000 },
  ];

  const ranges: { range: LatencyRange; label: string; color: string }[] = [
    { range: 'low', label: 'Low (<50ms)', color: '#22c55e' },
    { range: 'medium', label: 'Medium (50-150ms)', color: '#eab308' },
    { range: 'high', label: 'High (>150ms)', color: '#ef4444' },
  ];

  return (
    <div className="absolute top-24 left-4 z-20 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}
            />
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              Latency Monitor
            </span>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            <svg
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-3 space-y-3 min-w-60">
          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Show Connections
            </span>
            <button
              onClick={() => onToggle(!isEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isEnabled
                  ? 'bg-blue-600'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Update Interval */}
          <div className="space-y-1">
            <label className="text-xs text-gray-600 dark:text-gray-400">
              Update Interval
            </label>
            <div className="flex gap-1">
              {intervals.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => onIntervalChange(value)}
                  className={`flex-1 px-2 py-1 text-xs rounded transition-colors ${
                    updateInterval === value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Range Filters */}
          <div className="space-y-1">
            <label className="text-xs text-gray-600 dark:text-gray-400">
              Latency Ranges
            </label>
            <div className="space-y-1">
              {ranges.map(({ range, label, color }) => (
                <label
                  key={range}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded px-2 py-1"
                >
                  <input
                    type="checkbox"
                    checked={activeRanges.has(range)}
                    onChange={() => onRangeToggle(range)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex items-center gap-2 flex-1">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {label}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Stats */}
          {stats && isEnabled && (
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700 space-y-1">
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Statistics
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-gray-500 dark:text-gray-400">Min</div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {stats.min}ms
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 dark:text-gray-400">Max</div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {stats.max}ms
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 dark:text-gray-400">Avg</div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {stats.avg}ms
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 dark:text-gray-400">Median</div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {stats.median}ms
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
