import React, { useState } from 'react';
import { FileText, Download, Eye, PlusCircle, CheckCircle, Clock } from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';

export default function ReportsPage() {
  const { history, alerts, trackHealthScore } = useTelemetry();
  const [downloading, setDownloading] = useState(null);

  const reportCards = [
    {
      id: 'REP-01',
      title: 'Track Structural Health & Integrity Audit',
      type: 'Track Health Report',
      period: 'Past 24 Hours',
      status: 'READY',
      size: '2.4 MB',
      date: new Date().toLocaleDateString(),
      description: 'Geometric rail cant, cross-level deviation, sleeper ballast condition score.',
    },
    {
      id: 'REP-02',
      title: 'Vibration & Thermal Dynamic Sensor Logs',
      type: 'Sensor Report',
      period: 'Continuous Buffer',
      status: 'READY',
      size: '850 KB',
      date: new Date().toLocaleDateString(),
      description: 'Complete high-frequency time-series for 6 connected transducer channels.',
    },
    {
      id: 'REP-03',
      title: 'Incident & Anomaly Dispatches',
      type: 'Anomaly Report',
      period: 'Current Operation',
      status: alerts.length > 0 ? 'INCIDENTS LOGGED' : 'CLEAR',
      size: '140 KB',
      date: new Date().toLocaleDateString(),
      description: 'Threshold excursions, severity ratings, and recommended track inspections.',
    },
    {
      id: 'REP-04',
      title: 'AI Failure Risk & Maintenance Forecast',
      type: 'AI Prediction Report',
      period: '72-Hour Horizon',
      status: 'CALCULATED',
      size: '1.1 MB',
      date: new Date().toLocaleDateString(),
      description: 'Harmonic vibration spectral analysis and predicted track degradation rate.',
    },
  ];

  // Real client-side export of current buffered readings as JSON
  const handleDownload = (type) => {
    setDownloading(type);
    setTimeout(() => {
      const dataToExport = {
        exportDate: new Date().toISOString(),
        trackHealthScore: `${trackHealthScore}%`,
        totalBufferReadings: history.length,
        telemetry: history,
        alerts: alerts,
      };

      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Railway-Report-${type.toLowerCase().replace(/\s+/g, '-')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setDownloading(null);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-lg md:text-xl font-extrabold uppercase tracking-wide text-white">
            OPERATIONAL COMPLIANCE & TELEMETRY REPORTS
          </h1>
          <p className="text-xs text-slate-400">
            Exportable safety dossiers, inspection certificates & raw sensor records
          </p>
        </div>

        <button
          onClick={() => handleDownload('Full-Audit')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
        >
          <Download size={14} />
          <span>Export Master Audit (JSON)</span>
        </button>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportCards.map((rep) => (
          <div
            key={rep.id}
            className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 shadow-xl backdrop-blur-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                  {rep.id} • {rep.type}
                </span>
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                  <Clock size={12} /> {rep.date}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white mt-3 font-mono">{rep.title}</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{rep.description}</p>

              <div className="flex items-center gap-4 text-xs font-mono text-slate-500 mt-4">
                <span>Window: <strong className="text-slate-300">{rep.period}</strong></span>
                <span>•</span>
                <span>Payload: <strong className="text-slate-300">{rep.size}</strong></span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle size={14} /> {rep.status}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(rep.type)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 transition-colors"
                >
                  <Download size={13} />
                  <span>{downloading === rep.type ? 'Exporting...' : 'Download'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
