import React, { useState } from 'react';
import {
  Activity,
  Cpu,
  Wifi,
  Clock,
  Maximize2,
  Minimize2,
  RefreshCw,
  Zap,
} from 'lucide-react';
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

const METRICS = [
  { key: 'temperature', label: 'Temperature', unit: '°C', color: '#f97316' },
  { key: 'humidity', label: 'Humidity', unit: '%', color: '#38bdf8' },
  { key: 'vibration', label: 'Track Vibration', unit: 'g', color: '#fbbf24' },
  { key: 'pressure', label: 'Pressure', unit: 'hPa', color: '#34d399' },
  { key: 'frequency', label: 'Frequency', unit: 'Hz', color: '#a855f7' },
  { key: 'motion', label: 'Motion Sensor', unit: 'lvl', color: '#ec4899' },
];

export default function LiveMonitoringPage() {
  const {
    deviceId,
    isOnline,
    lastUpdate,
    latestData,
    history,
    triggering,
    triggerDemoAnomaly,
    triggerNormalTelemetry,
  } = useTelemetry();

  const [timeRange, setTimeRange] = useState('ALL');
  const [fullscreenMetric, setFullscreenMetric] = useState(null);

  // Filter history based on time window
  const filteredHistory = React.useMemo(() => {
    if (timeRange === '1M') return history.slice(-10);
    if (timeRange === '5M') return history.slice(-25);
    return history;
  }, [history, timeRange]);

  return (
    <div className="space-y-6">
      {/* Top Device & Stream Control Bar */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 shadow-xl backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
            <Cpu size={16} className="text-cyan-400" />
            <select
              value={deviceId}
              onChange={() => {}}
              className="bg-transparent text-xs font-mono font-bold text-white focus:outline-none cursor-pointer"
            >
              <option value="ESP32-001" className="bg-slate-900">
                ESP32-001 (Corridor Probe)
              </option>
            </select>
          </div>

          <span
            className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 ${
              isOnline
                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isOnline ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'
              }`}
            />
            {isOnline ? 'LIVE TELEMETRY STREAM' : 'PROBE OFFLINE'}
          </span>

          <div className="flex items-center gap-1 text-xs font-mono text-slate-400 bg-slate-950/50 px-2.5 py-1 rounded-lg border border-slate-800">
            <Wifi size={13} className="text-emerald-400" />
            <span>Wi-Fi RSSI: -54 dBm (Strong)</span>
          </div>

          <div className="flex items-center gap-1 text-xs font-mono text-slate-400 bg-slate-950/50 px-2.5 py-1 rounded-lg border border-slate-800">
            <Clock size={13} className="text-cyan-400" />
            <span>Rate: 2000 ms</span>
          </div>
        </div>

        {/* Time Window Filters & Demo Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-950 rounded-xl p-1 border border-slate-800 font-mono text-xs">
            {['1M', '5M', 'ALL'].map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  timeRange === r
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <button
            onClick={triggerNormalTelemetry}
            disabled={triggering}
            title="Inject normal telemetry packet"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
          >
            <RefreshCw size={14} className={triggering ? 'animate-spin' : ''} />
          </button>

          <button
            onClick={triggerDemoAnomaly}
            disabled={triggering}
            title="Inject abnormal vibration spike"
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold"
          >
            <Zap size={14} />
            <span>Spike Anomaly</span>
          </button>
        </div>
      </div>

      {/* Grid of Large Live Sensor Charts (All 6 Telemetry Channels) */}
      <div
        className={`grid ${
          fullscreenMetric
            ? 'grid-cols-1'
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        } gap-4`}
      >
        {METRICS.filter((m) => !fullscreenMetric || m.key === fullscreenMetric).map((m) => {
          const isFull = fullscreenMetric === m.key;
          const currentVal = latestData ? latestData[m.key] : '--';

          return (
            <div
              key={m.key}
              className={`rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4 shadow-xl backdrop-blur-sm transition-all ${
                isFull ? 'h-[500px]' : 'h-72'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                      {m.label}
                    </span>
                    <span className="text-base font-mono font-extrabold text-white">
                      {currentVal} {m.unit}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">Channel {m.key}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded">
                    REAL-TIME
                  </span>
                  <button
                    onClick={() => setFullscreenMetric(isFull ? null : m.key)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                    title={isFull ? 'Exit Fullscreen' : 'Fullscreen Chart'}
                  >
                    {isFull ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                  </button>
                </div>
              </div>

              {/* Chart Canvas */}
              <div className="w-full h-[calc(100%-55px)]">
                {filteredHistory.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs font-mono text-slate-600">
                    Awaiting live stream...
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={filteredHistory}
                      margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id={`grad-${m.key}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={m.color} stopOpacity={0.35} />
                          <stop offset="95%" stopColor={m.color} stopOpacity={0.0} />
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
                        dataKey={m.key}
                        stroke={m.color}
                        strokeWidth={2}
                        fill={`url(#grad-${m.key})`}
                        isAnimationActive={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
