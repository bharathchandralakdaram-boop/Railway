import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Cpu, ArrowLeft, Wifi, Activity, ShieldCheck, Clock, RefreshCw, Zap } from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';
import SensorCards from '../components/dashboard/SensorCards';

export default function DeviceDetailPage() {
  const { deviceId: paramId } = useParams();
  const navigate = useNavigate();
  const {
    deviceId,
    isOnline,
    lastUpdate,
    latestData,
    triggering,
    triggerDemoAnomaly,
    triggerNormalTelemetry,
  } = useTelemetry();

  const id = paramId || deviceId || 'ESP32-001';

  return (
    <div className="space-y-6">
      {/* Back Button & Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/devices')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Devices</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={triggerNormalTelemetry}
            disabled={triggering}
            className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-mono text-slate-200 border border-slate-700 hover:bg-slate-700"
          >
            Send Ping
          </button>
          <button
            onClick={triggerDemoAnomaly}
            disabled={triggering}
            className="px-3 py-1.5 rounded-xl bg-amber-600/20 text-xs font-mono text-amber-300 border border-amber-500/40 hover:bg-amber-600/30"
          >
            Simulate Vibration Spike
          </button>
        </div>
      </div>

      {/* Device Overview Banner */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Cpu size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-mono font-extrabold text-white">{id}</h1>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                    isOnline
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isOnline ? '🟢 STREAMING' : '⚫ OFFLINE'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Role: Autonomous Track Infrastructure Probe • Assigned: Corridor Sector SEC-B
              </p>
            </div>
          </div>

          <div className="text-right font-mono text-xs text-slate-400">
            <p>Last Telemetry: <strong className="text-slate-200">{lastUpdate ? new Date(lastUpdate).toLocaleTimeString() : '--'}</strong></p>
            <p className="text-[11px] text-slate-500 mt-0.5">MAC: 24:6F:28:B4:79:D8 • IP: 192.168.1.100</p>
          </div>
        </div>

        {/* Hardware Specifications Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 font-mono text-xs">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-500">MCU ARCHITECTURE</span>
            <p className="font-bold text-slate-200 mt-1">ESP32 Dual-Core Tensilica</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-500">TRANSMISSION PROTOCOL</span>
            <p className="font-bold text-cyan-400 mt-1">HTTP POST / JSON REST</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-500">SAMPLING CADENCE</span>
            <p className="font-bold text-slate-200 mt-1">2000 ms (0.5 Hz)</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-500">ATTACHED TRANSDUCERS</span>
            <p className="font-bold text-emerald-400 mt-1">6 Active Channels</p>
          </div>
        </div>
      </div>

      {/* Live Sensor Metrics of this Device */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
          Current Transducer Channels ({id})
        </h2>
        <SensorCards />
      </section>
    </div>
  );
}
