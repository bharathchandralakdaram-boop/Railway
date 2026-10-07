import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GitCommit, Train, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';
import TrackHealthHero from '../components/dashboard/TrackHealthHero';

export default function TrackHealthPage() {
  const { latestData, alerts, trackHealthScore, isOnline } = useTelemetry();
  const navigate = useNavigate();

  const isAnomaly = alerts && alerts.length > 0;
  const vibration = latestData?.vibration ?? 0.23;

  const sections = [
    {
      id: 'SEC-A',
      name: 'Corridor Section A (North Approach)',
      kmRange: 'KM 10 – 20',
      status: 'STABLE',
      health: '99.8%',
      activeDevice: 'ESP32-REF-A',
      vibration: '0.18 g',
      motion: 'Clear (0.0)',
      temp: '26.4 °C',
      lastUpdate: 'Just now',
      ballastStatus: 'Compacted / Clean',
      sleepersStatus: 'Concrete / Zero Microcracks',
      isDanger: false,
    },
    {
      id: 'SEC-B',
      name: 'Corridor Section B (Bridge & Viaduct)',
      kmRange: 'KM 21 – 35',
      status: isAnomaly ? 'DEFECT DETECTED' : 'OPTIMAL',
      health: `${trackHealthScore}%`,
      activeDevice: 'ESP32-001 (ACTIVE LIVE PROBE)',
      vibration: `${vibration} g`,
      motion: `${Number(latestData?.motion ?? 0) > 0.5 ? 'Active (1.0)' : 'Clear (0.0)'}`,
      temp: `${latestData?.temperature ?? 28.6} °C`,
      lastUpdate: isOnline ? 'Streaming (2s)' : '10s ago',
      ballastStatus: isAnomaly ? 'Excursion Detected' : 'Normal Packing',
      sleepersStatus: isAnomaly ? 'Vibration Anomaly Excursion' : 'Nominal',
      isDanger: isAnomaly,
    },
    {
      id: 'SEC-C',
      name: 'Corridor Section C (Valley Curve & S-Bend)',
      kmRange: 'KM 36 – 50',
      status: 'MONITORED',
      health: '94.2%',
      activeDevice: 'ESP32-003',
      vibration: '0.45 g',
      motion: 'Clear (0.0)',
      temp: '29.1 °C',
      lastUpdate: '3 min ago',
      ballastStatus: 'Scheduled Tamping',
      sleepersStatus: 'Standard Wear',
      isDanger: false,
    },
    {
      id: 'SEC-D',
      name: 'Corridor Section D (Terminal Junction)',
      kmRange: 'KM 51 – 65',
      status: 'STABLE',
      health: '99.1%',
      activeDevice: 'ESP32-004',
      vibration: '0.22 g',
      motion: 'Clear (0.0)',
      temp: '27.8 °C',
      lastUpdate: '5 min ago',
      ballastStatus: 'Compacted',
      sleepersStatus: 'Nominal',
      isDanger: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-lg md:text-xl font-extrabold uppercase tracking-wide text-white">
            CORRIDOR TRACK HEALTH INSPECTION
          </h1>
          <p className="text-xs text-slate-400">
            Structural Integrity, Sleeper Alignment & Ballast Geometry
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-xl">
            Corridor Length: 55 Kilometers
          </span>
        </div>
      </div>

      {/* Visual Centerpiece Schematic */}
      <TrackHealthHero />

      {/* Grid of Track Section Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((sec) => (
          <div
            key={sec.id}
            onClick={() => navigate(`/track/${sec.id}`)}
            className={`rounded-2xl border p-5 bg-slate-900/70 shadow-xl backdrop-blur-sm cursor-pointer transition-all duration-200 hover:scale-[1.01] ${
              sec.isDanger
                ? 'border-rose-500/70 bg-rose-950/20 ring-1 ring-rose-500/30'
                : 'border-slate-800/80 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-xl ${
                    sec.isDanger ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-cyan-400'
                  }`}
                >
                  <GitCommit size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-mono">{sec.id}</h3>
                  <p className="text-[11px] text-slate-400">{sec.name}</p>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    sec.isDanger
                      ? 'bg-red-950 text-red-400 border border-red-500/40 animate-pulse'
                      : 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {sec.status}
                </span>
                <p className="text-[10px] font-mono text-slate-500 mt-1">{sec.kmRange}</p>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 py-4 font-mono text-xs border-b border-slate-800">
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
                <span className="text-[10px] text-slate-500">VIBRATION</span>
                <p className={`font-bold mt-0.5 ${sec.isDanger ? 'text-red-400' : 'text-slate-200'}`}>
                  {sec.vibration}
                </p>
              </div>

              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
                <span className="text-[10px] text-slate-500">MOTION</span>
                <p className="font-bold text-slate-200 mt-0.5">{sec.motion}</p>
              </div>

              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
                <span className="text-[10px] text-slate-500">TEMP</span>
                <p className="font-bold text-slate-200 mt-0.5">{sec.temp}</p>
              </div>
            </div>

            {/* Footer with Device & Inspector Action */}
            <div className="pt-3 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">
                Device: <strong className="text-cyan-400">{sec.activeDevice}</strong>
              </span>

              <button className="flex items-center gap-1 text-cyan-400 font-bold hover:text-cyan-300">
                <span>Inspect Sector</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
