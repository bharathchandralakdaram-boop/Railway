import React, { useState } from 'react';
import { Train, ShieldCheck, AlertTriangle, ArrowRight, Gauge, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTelemetry } from '../../context/TelemetryContext';

export default function TrackHealthHero() {
  const { trackHealthScore, latestData, alerts, isOnline } = useTelemetry();
  const [selectedSection, setSelectedSection] = useState('SEC-B');
  const navigate = useNavigate();

  const isAnomaly = alerts && alerts.length > 0;
  const vibration = latestData?.vibration ?? 0.23;

  const sections = [
    {
      id: 'SEC-A',
      name: 'SECTION A',
      range: 'KM 10 – 20',
      status: 'HEALTHY',
      color: 'emerald',
      statusIcon: '🟢',
      device: 'STATIONARY-REF',
      vibration: '0.18 g',
      temp: '26.4 °C',
      motion: 'Clear (0.0)',
    },
    {
      id: 'SEC-B',
      name: 'SECTION B',
      range: 'KM 21 – 35',
      status: isAnomaly ? 'CRITICAL HAZARD' : 'HEALTHY',
      color: isAnomaly ? 'rose' : 'emerald',
      statusIcon: isAnomaly ? '🔴' : '🟢',
      device: 'ESP32-001 (ACTIVE)',
      isProbe: true,
      vibration: `${vibration} g`,
      temp: `${latestData?.temperature ?? 28.6} °C`,
      motion: `${Number(latestData?.motion ?? 0) > 0.5 ? 'Active (1.0)' : 'Clear (0.0)'}`,
    },
    {
      id: 'SEC-C',
      name: 'SECTION C',
      range: 'KM 36 – 50',
      status: 'STABLE WARNING',
      color: 'amber',
      statusIcon: '🟡',
      device: 'PASSIVE ACCELEROMETER',
      vibration: '0.45 g',
      temp: '29.1 °C',
      motion: 'Clear (0.0)',
    },
    {
      id: 'SEC-D',
      name: 'SECTION D',
      range: 'KM 51 – 65',
      status: 'HEALTHY',
      color: 'emerald',
      statusIcon: '🟢',
      device: 'CORRIDOR END-NODE',
      vibration: '0.22 g',
      temp: '27.8 °C',
      motion: 'Clear (0.0)',
    },
  ];

  const activeSec = sections.find((s) => s.id === selectedSection) || sections[1];
  const healthLabel =
    trackHealthScore >= 95 ? 'EXCELLENT' : trackHealthScore >= 80 ? 'ATTENTION REQUIRED' : 'CRITICAL DEFECT';

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 shadow-xl shadow-black/40 backdrop-blur-sm">
      {/* Top Banner: Title & Overall Score */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Train size={22} />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-wider text-slate-100 uppercase">
              REAL-TIME RAILWAY TRACK HEALTH SCHEMATIC
            </h2>
            <p className="text-xs text-slate-400">
              Corridor Sector TRK-01 • Autonomous ESP32 Sensor Grid
            </p>
          </div>
        </div>

        {/* Large Track Health Score Block */}
        <div className="flex items-center gap-4 bg-slate-950/70 px-4 py-2 rounded-xl border border-slate-800/80">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              TRACK HEALTH
            </p>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-2xl font-mono font-black ${
                  trackHealthScore >= 90 ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {trackHealthScore}%
              </span>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  trackHealthScore >= 90
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-amber-500/10 text-amber-400'
                }`}
              >
                {healthLabel}
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate('/track')}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 border-l border-slate-800 pl-3"
          >
            <span>Details</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Centerpiece Track Visualization */}
      <div className="py-5">
        {/* Railway Rails Graphic */}
        <div className="relative h-14 flex flex-col justify-between my-2">
          {/* Top Rail */}
          <div className="h-1.5 w-full bg-gradient-to-r from-slate-600 via-cyan-500/50 to-slate-600 rounded" />
          
          {/* Railroad Sleepers / Cross-ties */}
          <div className="absolute inset-x-0 top-1 bottom-1 flex justify-between items-center px-4 pointer-events-none">
            {Array.from({ length: 32 }).map((_, i) => (
              <div key={i} className="w-1 h-full bg-slate-700/80 rounded-sm" />
            ))}
          </div>

          {/* Bottom Rail */}
          <div className="h-1.5 w-full bg-gradient-to-r from-slate-600 via-cyan-500/50 to-slate-600 rounded" />

          {/* Active ESP32 Train Probe Marker on Section B */}
          <div className="absolute left-[37.5%] top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-500 text-slate-950 font-mono text-[10px] font-extrabold shadow-lg shadow-cyan-500/50 animate-pulse cursor-pointer">
              <Train size={12} />
              <span>ESP32-001 PROBE</span>
            </div>
          </div>
        </div>

        {/* Section Cards Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {sections.map((sec) => {
            const isSelected = selectedSection === sec.id;
            const isSecDanger = sec.color === 'rose';

            return (
              <div
                key={sec.id}
                onClick={() => setSelectedSection(sec.id)}
                className={`cursor-pointer rounded-xl border p-3 transition-all duration-200 ${
                  isSelected
                    ? 'border-cyan-500 bg-slate-800/90 shadow-md shadow-cyan-500/20'
                    : isSecDanger
                    ? 'border-rose-500/50 bg-rose-950/20 hover:border-rose-500'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-200">
                    {sec.name}
                  </span>
                  <span>{sec.statusIcon}</span>
                </div>

                <p className="text-[11px] font-mono text-slate-400 mt-0.5">{sec.range}</p>

                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-400">Vibration:</span>
                  <span
                    className={`font-bold ${
                      isSecDanger ? 'text-red-400' : 'text-slate-200'
                    }`}
                  >
                    {sec.vibration}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Section Live Telemetry Micro-Bar */}
      <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-200">SELECTED: {activeSec.name}</span>
          <span>•</span>
          <span>KM: {activeSec.range}</span>
          <span>•</span>
          <span className="text-cyan-400">{activeSec.device}</span>
        </div>

        <div className="flex items-center gap-4">
          <span>Vib: <strong className="text-slate-200">{activeSec.vibration}</strong></span>
          <span>Temp: <strong className="text-slate-200">{activeSec.temp}</strong></span>
          <span>Motion: <strong className="text-slate-200">{activeSec.motion}</strong></span>
        </div>
      </div>
    </div>
  );
}
