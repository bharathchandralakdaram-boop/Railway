import { Train, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function TrackSchematic({ latestData, alerts }) {
  const isAnomaly = alerts && alerts.length > 0;
  const vibration = latestData?.vibration ?? 0.23;

  return (
    <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 shadow-lg shadow-black/40 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Train size={16} className="text-cyan-400" />
          <h3 className="text-xs font-semibold tracking-wider uppercase text-slate-300">
            Real-Time Track Health Schematic (Sector TRK-CORRIDOR-01)
          </h3>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="text-slate-400">Track Status:</span>
          {isAnomaly ? (
            <span className="flex items-center gap-1 text-red-400 font-bold bg-red-950/60 border border-red-500/40 px-2 py-0.5 rounded">
              <AlertTriangle size={12} /> SEGMENT B HAZARD
            </span>
          ) : (
            <span className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded">
              <ShieldCheck size={12} /> ALL CLEAR
            </span>
          )}
        </div>
      </div>

      {/* Railway Track Representation */}
      <div className="relative py-4 px-2">
        {/* Dual Rails */}
        <div className="relative h-12 flex flex-col justify-between">
          <div className="h-1 w-full bg-slate-600 rounded" />
          {/* Railroad ties / sleepers */}
          <div className="absolute inset-x-0 top-1 bottom-1 flex justify-between items-center pointer-events-none px-4">
            {Array.from({ length: 24 }).map((_, idx) => (
              <div key={idx} className="w-1 h-full bg-slate-700/80 rounded-sm" />
            ))}
          </div>
          <div className="h-1 w-full bg-slate-600 rounded" />
        </div>

        {/* Track Segments Grid */}
        <div className="grid grid-cols-4 gap-2 mt-3">
          {/* Segment 1 */}
          <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-2.5 text-center">
            <span className="text-[10px] font-mono text-slate-500">KM 10 - 20 (SEC-A)</span>
            <div className="mt-1 flex items-center justify-center gap-1 text-xs font-mono text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              STABLE
            </div>
          </div>

          {/* Segment 2 - Sensor Unit Location */}
          <div
            className={`rounded-lg border p-2.5 text-center transition-all ${
              isAnomaly
                ? 'border-red-500 bg-red-950/50 shadow-lg shadow-red-950/60 animate-pulse'
                : 'border-cyan-500/50 bg-slate-950/70 shadow-sm shadow-cyan-500/10'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono font-bold text-cyan-300">
              <Train size={12} />
              KM 21 - 35 (ESP32-001)
            </div>
            <div
              className={`mt-1 text-xs font-mono font-bold ${
                isAnomaly ? 'text-red-400' : 'text-emerald-400'
              }`}
            >
              {isAnomaly ? `ANOMALY: ${vibration}g` : 'ACTIVE PROBE'}
            </div>
          </div>

          {/* Segment 3 */}
          <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-2.5 text-center">
            <span className="text-[10px] font-mono text-slate-500">KM 36 - 50 (SEC-C)</span>
            <div className="mt-1 flex items-center justify-center gap-1 text-xs font-mono text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              STABLE
            </div>
          </div>

          {/* Segment 4 */}
          <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-2.5 text-center">
            <span className="text-[10px] font-mono text-slate-500">KM 51 - 65 (SEC-D)</span>
            <div className="mt-1 flex items-center justify-center gap-1 text-xs font-mono text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              STABLE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
