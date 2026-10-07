import { AlertOctagon, AlertTriangle, ShieldCheck, Trash2, ArrowUpRight } from 'lucide-react';

const SEVERITY_CONFIG = {
  CRITICAL: {
    border: 'border-red-500/70',
    bg: 'bg-red-950/40',
    badge: 'bg-red-500 text-white font-extrabold shadow-sm shadow-red-500/50',
    pulse: true,
  },
  HIGH: {
    border: 'border-orange-500/60',
    bg: 'bg-orange-950/30',
    badge: 'bg-orange-600 text-white font-bold',
    pulse: false,
  },
  MEDIUM: {
    border: 'border-amber-500/50',
    bg: 'bg-amber-950/20',
    badge: 'bg-amber-600 text-amber-100 font-medium',
    pulse: false,
  },
  LOW: {
    border: 'border-yellow-500/40',
    bg: 'bg-yellow-950/20',
    badge: 'bg-yellow-600 text-yellow-100 font-medium',
    pulse: false,
  },
};

export default function AlertPanel({ alerts, onClear }) {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg shadow-black/40 backdrop-blur-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-400" />
            <h3 className="text-xs font-semibold tracking-wider uppercase text-slate-300">
              AI Safety Engine
            </h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            NORMAL OPERATION
          </span>
        </div>

        <div className="py-10 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck size={22} />
          </div>
          <p className="text-sm font-semibold text-slate-200">Track Infrastructure Clear</p>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Autonomous threshold algorithms continuously monitoring vibration, motion, and track dynamics.
          </p>
        </div>

        <div className="pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-500 text-center">
          Engine: Prototype Anomaly Detection (Threshold-Based)
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-red-900/40 bg-slate-900/80 p-5 shadow-xl shadow-red-950/20 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <AlertOctagon size={16} className="text-red-400 animate-pulse" />
          <h3 className="text-xs font-bold tracking-wider uppercase text-red-400">
            AI Anomaly Engine ({alerts.length})
          </h3>
        </div>
        <button
          onClick={onClear}
          className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-medium rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          <Trash2 size={12} />
          Clear
        </button>
      </div>

      {/* Alert Feed */}
      <div className="space-y-3 mt-3.5 max-h-[380px] overflow-y-auto pr-1">
        {alerts.map((alert, i) => {
          const cfg = SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.MEDIUM;
          return (
            <div
              key={alert._id || i}
              className={`rounded-lg border ${cfg.border} ${cfg.bg} p-3.5 shadow-md transition-all hover:scale-[1.01]`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-red-300">
                  <AlertTriangle size={14} className={cfg.pulse ? 'animate-bounce' : ''} />
                  ⚠️ ANOMALY DETECTED
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider ${cfg.badge}`}>
                  {alert.severity}
                </span>
              </div>

              {/* Data Table */}
              <div className="space-y-1.5 font-mono text-[11px] bg-black/40 rounded-md p-2.5 border border-white/5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Device:</span>
                  <span className="text-slate-100 font-bold">{alert.deviceId || 'ESP32-001'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Sensor:</span>
                  <span className="text-amber-300 font-bold uppercase">{alert.sensorType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Trigger Value:</span>
                  <span className="text-red-400 font-bold">{alert.value} (Threshold: {alert.threshold})</span>
                </div>
                <div className="pt-1.5 border-t border-white/5">
                  <span className="text-slate-400">Reason:</span>
                  <p className="text-slate-200 mt-0.5 leading-snug">
                    Abnormal {alert.sensorType} detected exceeding safety tolerance.
                  </p>
                </div>
                <div className="pt-1.5 border-t border-white/5 text-amber-200 flex items-start gap-1">
                  <ArrowUpRight size={13} className="shrink-0 mt-0.5 text-amber-400" />
                  <span><strong>Recommended Action:</strong> Inspect affected track segment</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-2 px-1">
                <span>SECTOR: TRK-04</span>
                <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-3 mt-3 border-t border-slate-800 text-[10px] font-mono text-slate-500 text-center">
        Prototype Anomaly Detection (Threshold-Based)
      </div>
    </div>
  );
}
