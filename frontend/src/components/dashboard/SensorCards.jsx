import React from 'react';
import {
  Thermometer,
  Droplets,
  Activity,
  Gauge,
  Radio,
  Radar,
} from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';

const SENSOR_SPECS = {
  temperature: {
    label: 'TEMPERATURE',
    unit: '°C',
    icon: Thermometer,
    threshold: 50,
    accent: '#f97316',
    borderNormal: 'border-orange-500/20 hover:border-orange-500/40',
  },
  humidity: {
    label: 'HUMIDITY',
    unit: '%',
    icon: Droplets,
    threshold: 85,
    accent: '#38bdf8',
    borderNormal: 'border-blue-500/20 hover:border-blue-500/40',
  },
  vibration: {
    label: 'TRACK VIBRATION',
    unit: 'g',
    icon: Activity,
    threshold: 1.5,
    accent: '#fbbf24',
    borderNormal: 'border-amber-500/20 hover:border-amber-500/40',
  },
  pressure: {
    label: 'ATM. PRESSURE',
    unit: 'hPa',
    icon: Gauge,
    threshold: 1040,
    accent: '#34d399',
    borderNormal: 'border-emerald-500/20 hover:border-emerald-500/40',
  },
  frequency: {
    label: 'FREQUENCY',
    unit: 'Hz',
    icon: Radio,
    threshold: 55,
    accent: '#a855f7',
    borderNormal: 'border-purple-500/20 hover:border-purple-500/40',
  },
  motion: {
    label: 'MOTION SENSOR',
    unit: 'lvl',
    icon: Radar,
    threshold: 0.8,
    accent: '#ec4899',
    borderNormal: 'border-pink-500/20 hover:border-pink-500/40',
  },
};

// Mini SVG Sparkline generator
function MiniSparkline({ points, strokeColor, isDanger }) {
  if (!points || points.length < 2) {
    return (
      <div className="h-7 w-full flex items-center justify-center text-[10px] font-mono text-slate-600">
        Streaming...
      </div>
    );
  }

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const width = 120;
  const height = 28;

  const coords = points.map((val, idx) => {
    const x = (idx / (points.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 6) - 3;
    return `${x},${y}`;
  });

  const polylineStr = coords.join(' ');

  return (
    <div className="h-7 w-full overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
        <polyline
          fill="none"
          stroke={isDanger ? '#ef4444' : strokeColor}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={polylineStr}
        />
      </svg>
    </div>
  );
}

export default function SensorCards() {
  const { latestData, sensorStats } = useTelemetry();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {Object.entries(SENSOR_SPECS).map(([key, spec]) => {
        const val = latestData ? latestData[key] : null;
        const hasVal = val !== undefined && val !== null;
        const numVal = hasVal ? Number(val) : 0;
        const isDanger = hasVal && Math.abs(numVal) > spec.threshold;

        const stats = sensorStats[key] || { min: numVal, avg: numVal, max: numVal, history: [] };
        const Icon = spec.icon;

        return (
          <div
            key={key}
            className={`rounded-2xl border bg-slate-900/70 p-4 shadow-lg shadow-black/30 backdrop-blur-sm transition-all duration-200 ${
              isDanger
                ? 'border-red-500/70 bg-red-950/20 shadow-red-950/40 ring-1 ring-red-500/30'
                : spec.borderNormal
            }`}
          >
            {/* Header: Label & Icon */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold tracking-wider text-slate-400">
                {spec.label}
              </span>
              <div
                className={`p-1.5 rounded-lg ${
                  isDanger ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-300'
                }`}
              >
                <Icon size={15} />
              </div>
            </div>

            {/* Large Value */}
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span
                className={`text-2xl font-mono font-bold tracking-tight ${
                  isDanger ? 'text-red-400 animate-pulse' : 'text-slate-100'
                }`}
              >
                {hasVal ? val : '--'}
              </span>
              <span className="text-xs font-mono text-slate-500">{spec.unit}</span>
            </div>

            {/* Status Badge */}
            <div className="mt-1 flex items-center gap-1.5">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isDanger ? 'bg-red-500 animate-ping' : 'bg-emerald-400'
                }`}
              />
              <span
                className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                  isDanger ? 'text-red-400' : 'text-emerald-400'
                }`}
              >
                {isDanger ? '● CRITICAL' : '● NORMAL'}
              </span>
            </div>

            {/* Live Mini Sparkline */}
            <div className="my-2.5 pt-2 border-t border-slate-800/60">
              <MiniSparkline
                points={stats.history}
                strokeColor={spec.accent}
                isDanger={isDanger}
              />
            </div>

            {/* Min / Avg / Max Row */}
            <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-800/60 text-center font-mono text-[10px] text-slate-400">
              <div>
                <p className="text-slate-500 text-[9px]">MIN</p>
                <p className="font-semibold text-slate-300">{stats.min}</p>
              </div>
              <div>
                <p className="text-slate-500 text-[9px]">AVG</p>
                <p className="font-semibold text-slate-300">{stats.avg}</p>
              </div>
              <div>
                <p className="text-slate-500 text-[9px]">MAX</p>
                <p className="font-semibold text-slate-300">{stats.max}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
