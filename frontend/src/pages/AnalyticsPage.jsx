import React, { useState, useEffect } from 'react';
import { BarChart3, Filter, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function AnalyticsPage() {
  const { history, alerts, sensorStats } = useTelemetry();
  const [timeFilter, setTimeFilter] = useState('24H');
  const [selectedMetric, setSelectedMetric] = useState('vibration');

  const metricConfigs = {
    temperature: { name: 'Temperature', unit: '°C', color: '#f97316' },
    humidity: { name: 'Humidity', unit: '%', color: '#38bdf8' },
    vibration: { name: 'Vibration', unit: 'g', color: '#fbbf24' },
    pressure: { name: 'Pressure', unit: 'hPa', color: '#34d399' },
    frequency: { name: 'Frequency', unit: 'Hz', color: '#a855f7' },
    motion: { name: 'Motion Sensor', unit: 'lvl', color: '#ec4899' },
  };

  const currentCfg = metricConfigs[selectedMetric];
  const stats = sensorStats[selectedMetric] || { min: 0, avg: 0, max: 0 };
  const anomalyCount = alerts.filter((a) => a.sensorType === selectedMetric).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-lg md:text-xl font-extrabold uppercase tracking-wide text-white">
            HISTORICAL TELEMETRY ANALYTICS
          </h1>
          <p className="text-xs text-slate-400">
            Multi-temporal trend analysis, statistical dispersion & defect correlation
          </p>
        </div>

        {/* Time Filters */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 font-mono text-xs">
          {['1H', '6H', '24H', '7D', '30D'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeFilter(tf)}
              className={`px-3 py-1 rounded-lg transition-all ${
                timeFilter === tf
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Selector Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {Object.entries(metricConfigs).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => setSelectedMetric(key)}
            className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
              selectedMetric === key
                ? 'bg-slate-800 text-white border border-slate-600 shadow-md'
                : 'bg-slate-900/60 text-slate-400 border border-slate-800/80 hover:text-slate-200'
            }`}
          >
            {cfg.name}
          </button>
        ))}
      </div>

      {/* Statistical Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-slate-500 text-[10px]">MINIMUM RECORDED</span>
          <p className="text-2xl font-bold text-slate-200 mt-1">
            {stats.min} {currentCfg.unit}
          </p>
          <span className="text-[10px] text-slate-500">Selected Window ({timeFilter})</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-slate-500 text-[10px]">TIME-WEIGHTED AVERAGE</span>
          <p className="text-2xl font-bold text-cyan-400 mt-1">
            {stats.avg} {currentCfg.unit}
          </p>
          <span className="text-[10px] text-slate-500">Nominal Baseline</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-slate-500 text-[10px]">PEAK EXCURSION</span>
          <p className="text-2xl font-bold text-amber-400 mt-1">
            {stats.max} {currentCfg.unit}
          </p>
          <span className="text-[10px] text-slate-500">Upper Envelope</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-slate-500 text-[10px]">ANOMALIES FLAGGED</span>
          <p className={`text-2xl font-bold mt-1 ${anomalyCount > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
            {anomalyCount} Events
          </p>
          <span className="text-[10px] text-slate-500">Stored in MongoDB</span>
        </div>
      </div>

      {/* Full-Width Detailed Analytics Waveform */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 shadow-xl backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-white font-mono">
            {currentCfg.name} Envelope & Dispersion ({timeFilter})
          </h2>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
            DATABASE TELEMETRY
          </span>
        </div>

        <div className="h-80 w-full">
          {history.length === 0 ? (
            <div className="h-full flex items-center justify-center font-mono text-xs text-slate-600">
              No historical telemetry available in buffer
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="analyticsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={currentCfg.color} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={currentCfg.color} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090d16',
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    color: '#fff',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke={currentCfg.color}
                  strokeWidth={2}
                  fill="url(#analyticsGrad)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
