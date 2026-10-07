import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const CHARTS = [
  {
    key: 'temperature',
    label: 'Temperature Trend (°C)',
    stroke: '#f97316',
    fillId: 'tempGrad',
    color1: '#f97316',
    color2: 'rgba(249, 115, 22, 0.02)',
  },
  {
    key: 'humidity',
    label: 'Humidity Trend (%)',
    stroke: '#38bdf8',
    fillId: 'humGrad',
    color1: '#38bdf8',
    color2: 'rgba(56, 189, 248, 0.02)',
  },
  {
    key: 'vibration',
    label: 'Track Vibration Dynamics (g)',
    stroke: '#fbbf24',
    fillId: 'vibGrad',
    color1: '#fbbf24',
    color2: 'rgba(251, 191, 36, 0.02)',
  },
  {
    key: 'pressure',
    label: 'Atmospheric Pressure (hPa)',
    stroke: '#34d399',
    fillId: 'pressGrad',
    color1: '#34d399',
    color2: 'rgba(52, 211, 153, 0.02)',
  },
];

// Custom sleek dark tooltip
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const item = payload[0];
    return (
      <div className="rounded-lg border border-slate-700 bg-slate-900/95 p-2.5 shadow-2xl backdrop-blur-md">
        <p className="text-[11px] font-mono text-slate-400 mb-1">{label}</p>
        <p className="text-xs font-mono font-bold" style={{ color: item.color }}>
          {item.name}: {item.value}
        </p>
      </div>
    );
  }
  return null;
}

export default function SensorCharts({ history }) {
  if (!history || history.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {CHARTS.map((chart) => (
          <div
            key={chart.key}
            className="flex flex-col justify-center items-center h-48 rounded-xl border border-slate-800 bg-slate-900/50 p-4"
          >
            <span className="text-xs font-semibold text-slate-400 mb-2">{chart.label}</span>
            <span className="text-xs font-mono text-slate-600 animate-pulse">
              Waiting for live telemetry stream...
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
      {CHARTS.map((chart) => (
        <div
          key={chart.key}
          className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 shadow-lg shadow-black/40 backdrop-blur-sm transition-all hover:border-slate-700"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold tracking-wide text-slate-300">
              {chart.label}
            </h3>
            <span className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              LIVE TELEMETRY
            </span>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id={chart.fillId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chart.color1} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={chart.color2} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                <XAxis
                  dataKey="time"
                  stroke="#475569"
                  fontSize={10}
                  tickLine={false}
                  dy={4}
                />
                <YAxis
                  stroke="#475569"
                  fontSize={10}
                  tickLine={false}
                  domain={['auto', 'auto']}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey={chart.key}
                  name={chart.key}
                  stroke={chart.stroke}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill={`url(#${chart.fillId})`}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  );
}
