import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GitCommit, ArrowLeft, Train, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';
import SensorCharts from '../components/SensorCharts';

export default function TrackSectionDetailPage() {
  const { sectionId } = useParams();
  const navigate = useNavigate();
  const { latestData, history, alerts, trackHealthScore } = useTelemetry();

  const id = sectionId || 'SEC-B';
  const isAnomaly = id === 'SEC-B' && alerts && alerts.length > 0;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/track')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to All Sections</span>
        </button>

        <span
          className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
            isAnomaly
              ? 'bg-red-950 text-red-400 border border-red-500/40 animate-pulse'
              : 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
          }`}
        >
          {isAnomaly ? 'DEFECT DETECTED IN SECTOR' : 'SECTOR STRUCTURALLY SOUND'}
        </span>
      </div>

      {/* Section Header Card */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <GitCommit size={28} />
            </div>
            <div>
              <h1 className="text-xl font-mono font-extrabold text-white">
                TRACK CORRIDOR {id}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Kilometer Span: {id === 'SEC-B' ? 'KM 21 – 35' : 'KM Corridor Segment'} • Primary Track Span
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center font-mono">
              <span className="text-[10px] text-slate-500">HEALTH INDEX</span>
              <p className="text-lg font-bold text-emerald-400">
                {id === 'SEC-B' ? `${trackHealthScore}%` : '99.2%'}
              </p>
            </div>
          </div>
        </div>

        {/* Engineering Parameters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 font-mono text-xs">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-500">RAIL STEEL GRADE</span>
            <p className="font-bold text-slate-200 mt-1">UIC 60 / R260 Carbon Rail</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-500">BALLAST PROFILE</span>
            <p className="font-bold text-cyan-400 mt-1">Grade 1 Crushed Granite</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-500">ACTIVE TELEMETRY PROBE</span>
            <p className="font-bold text-slate-200 mt-1">{id === 'SEC-B' ? 'ESP32-001 (Mounted)' : 'Passive Geophone'}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-500">NEXT INSPECTION</span>
            <p className="font-bold text-emerald-400 mt-1">Autonomous 24/7 Live</p>
          </div>
        </div>
      </div>

      {/* Real-time Telemetry Charts */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
          Waveform Dynamics for {id}
        </h2>
        <SensorCharts history={history} />
      </section>
    </div>
  );
}
