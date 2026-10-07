import React from 'react';
import KPIStats from '../components/dashboard/KPIStats';
import SensorCards from '../components/dashboard/SensorCards';
import TrackHealthHero from '../components/dashboard/TrackHealthHero';
import SensorCharts from '../components/SensorCharts';
import AlertPanel from '../components/AlertPanel';
import { useTelemetry } from '../context/TelemetryContext';
import { Activity, ShieldAlert, Cpu } from 'lucide-react';

export default function DashboardPage() {
  const { history, alerts, clearAlerts, deviceId, isOnline, lastUpdate } = useTelemetry();

  return (
    <div className="space-y-6">
      {/* Top Greeting & Operational State */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/80 backdrop-blur-sm">
        <div>
          <h1 className="text-lg md:text-xl font-extrabold tracking-wide text-white uppercase">
            RAILWAY OPERATIONS CENTER
          </h1>
          <p className="text-xs text-slate-400">
            Live infrastructure overview • Real-time telemetry feed
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
            <Cpu size={14} className="text-cyan-400" />
            <span className="text-slate-200">{deviceId}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                isOnline
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {isOnline ? '🟢 STREAMING' : '⚫ OFFLINE'}
            </span>
          </div>

          {lastUpdate && (
            <span className="text-[11px] font-mono text-slate-400 hidden md:inline">
              Updated: {new Date(lastUpdate).toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* 4 Compact KPI Cards */}
      <KPIStats />

      {/* Centerpiece: Real-Time Track Health Schematic */}
      <TrackHealthHero />

      {/* 6 Modern Sensor Cards */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Activity size={14} className="text-cyan-400" />
            Live Sensor Telemetry Transducers
          </h2>
          <span className="text-[11px] font-mono text-slate-500">
            Sampling: Continuous (0.5 Hz)
          </span>
        </div>
        <SensorCards />
      </section>

      {/* 2-Column: Sensor Waveforms + AI Safety Alert Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Sensor Trend Analytics
            </h2>
            <span className="text-[11px] font-mono text-slate-500">
              Multi-Channel Live Waveforms
            </span>
          </div>
          <SensorCharts history={history} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <ShieldAlert size={14} className="text-rose-400" />
              AI Safety Engine Feed
            </h2>
            <span className="text-[11px] font-mono text-slate-500">
              Autonomous Dispatch
            </span>
          </div>
          <AlertPanel alerts={alerts} onClear={clearAlerts} />
        </div>
      </div>
    </div>
  );
}
