import {
  Thermometer,
  Droplets,
  Activity,
  Gauge,
  Radio,
  Radar,
} from 'lucide-react';

const SENSOR_METRICS = {
  temperature: {
    label: 'Temperature',
    unit: '°C',
    icon: Thermometer,
    min: 0,
    max: 60,
    threshold: 50,
    accentColor: 'from-orange-500/20 to-red-500/10',
    borderColor: 'border-orange-500/30',
    iconColor: 'text-orange-400',
    textColor: 'text-orange-300',
  },
  humidity: {
    label: 'Humidity',
    unit: '%',
    icon: Droplets,
    min: 0,
    max: 100,
    threshold: 85,
    accentColor: 'from-blue-500/20 to-cyan-500/10',
    borderColor: 'border-blue-500/30',
    iconColor: 'text-blue-400',
    textColor: 'text-blue-300',
  },
  vibration: {
    label: 'Track Vibration',
    unit: 'g',
    icon: Activity,
    min: 0,
    max: 3.0,
    threshold: 1.5,
    accentColor: 'from-amber-500/20 to-yellow-500/10',
    borderColor: 'border-amber-500/30',
    iconColor: 'text-amber-400',
    textColor: 'text-amber-300',
  },
  pressure: {
    label: 'Atm. Pressure',
    unit: 'hPa',
    icon: Gauge,
    min: 950,
    max: 1050,
    threshold: 1040,
    accentColor: 'from-emerald-500/20 to-teal-500/10',
    borderColor: 'border-emerald-500/30',
    iconColor: 'text-emerald-400',
    textColor: 'text-emerald-300',
  },
  frequency: {
    label: 'Frequency',
    unit: 'Hz',
    icon: Radio,
    min: 40,
    max: 60,
    threshold: 55,
    accentColor: 'from-purple-500/20 to-indigo-500/10',
    borderColor: 'border-purple-500/30',
    iconColor: 'text-purple-400',
    textColor: 'text-purple-300',
  },
  motion: {
    label: 'Motion Sensor',
    unit: 'lvl',
    icon: Radar,
    min: 0,
    max: 1.0,
    threshold: 0.8,
    accentColor: 'from-pink-500/20 to-rose-500/10',
    borderColor: 'border-pink-500/30',
    iconColor: 'text-pink-400',
    textColor: 'text-pink-300',
  },
};

export default function SensorCards({ data }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
      {Object.entries(SENSOR_METRICS).map(([key, config]) => {
        const val = data ? data[key] : null;
        const hasVal = val !== undefined && val !== null;
        const numVal = hasVal ? Number(val) : null;

        // Calculate progress percentage for meter
        let percent = 0;
        let isDanger = false;
        if (numVal !== null) {
          const span = config.max - config.min;
          percent = Math.min(Math.max(((numVal - config.min) / span) * 100, 0), 100);
          isDanger = numVal > config.threshold;
        }

        const Icon = config.icon;

        return (
          <div
            key={key}
            className={`relative overflow-hidden rounded-xl border bg-gradient-to-b ${
              isDanger
                ? 'from-red-950/40 to-slate-900/90 border-red-500/60 shadow-lg shadow-red-950/40'
                : `from-slate-900/80 to-slate-950/90 ${config.borderColor} shadow-md shadow-black/40`
            } p-4 transition-all duration-300 hover:scale-[1.02] hover:border-slate-600`}
          >
            {/* Top glowing accent bar */}
            <div
              className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
                isDanger
                  ? 'from-red-500 via-rose-500 to-amber-500 animate-pulse'
                  : config.accentColor
              }`}
            />

            {/* Header: Icon & Label */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {config.label}
              </span>
              <div
                className={`p-1.5 rounded-lg ${
                  isDanger ? 'bg-red-500/20 text-red-400' : 'bg-slate-800/80 ' + config.iconColor
                }`}
              >
                <Icon size={16} />
              </div>
            </div>

            {/* Metric Value */}
            <div className="my-2">
              <div className="flex items-baseline gap-1.5">
                <span
                  className={`text-2xl md:text-3xl font-mono font-bold tracking-tight ${
                    isDanger ? 'text-red-400 animate-pulse' : hasVal ? config.textColor : 'text-slate-600'
                  }`}
                >
                  {hasVal ? val : '--'}
                </span>
                <span className="text-xs font-mono text-slate-500">{config.unit}</span>
              </div>
            </div>

            {/* Visual Gauge Bar */}
            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>{config.min}{config.unit}</span>
                <span className={isDanger ? 'text-red-400 font-bold' : ''}>
                  {isDanger ? 'CRITICAL' : 'NORMAL'}
                </span>
                <span>{config.max}{config.unit}</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    isDanger
                      ? 'bg-gradient-to-r from-amber-500 to-red-500'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                  }`}
                  style={{ width: `${hasVal ? percent : 0}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
