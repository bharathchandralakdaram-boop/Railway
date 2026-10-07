import React, { useState } from 'react';
import {
  AlertTriangle,
  AlertOctagon,
  ShieldCheck,
  CheckCircle,
  Filter,
  Check,
  Trash2,
  ArrowUpRight,
  Zap,
} from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';

export default function AlertsPage() {
  const { alerts, clearAlerts, acknowledgedAlertIds, acknowledgeAlert, triggerDemoAnomaly, triggering } =
    useTelemetry();
  const [filter, setFilter] = useState('ALL');
  const [selectedAlertModal, setSelectedAlertModal] = useState(null);

  // Filter alerts by category
  const filteredAlerts = alerts.filter((alert) => {
    const isAck = acknowledgedAlertIds.has(alert._id);
    if (filter === 'RESOLVED') return isAck;
    if (filter === 'CRITICAL') return alert.severity === 'CRITICAL' && !isAck;
    if (filter === 'WARNING') return alert.severity === 'HIGH' || alert.severity === 'MEDIUM';
    return true; // ALL
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-lg md:text-xl font-extrabold uppercase tracking-wide text-white">
            AI ANOMALY & SAFETY ALERT CENTER
          </h1>
          <p className="text-xs text-slate-400">
            Real-time track threshold infractions & structural alarms
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={triggerDemoAnomaly}
            disabled={triggering}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold hover:bg-amber-600/30 transition-all disabled:opacity-50"
          >
            <Zap size={14} className={triggering ? 'animate-bounce' : ''} />
            <span>Simulate Anomaly</span>
          </button>

          {alerts.length > 0 && (
            <button
              onClick={clearAlerts}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-mono hover:bg-slate-700 transition-colors"
            >
              <Trash2 size={13} />
              <span>Clear Log</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-1.5 font-mono text-xs">
          {['ALL', 'CRITICAL', 'WARNING', 'RESOLVED'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                filter === cat
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-slate-500">
          Showing {filteredAlerts.length} of {alerts.length} system incidents
        </span>
      </div>

      {/* Alerts Grid / Cards */}
      {filteredAlerts.length === 0 ? (
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-12 text-center shadow-xl backdrop-blur-sm">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck size={28} />
          </div>
          <h3 className="text-base font-bold text-white font-mono">No Active Infractions</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            All track sectors are within calibrated mechanical and thermal tolerances.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAlerts.map((alert, idx) => {
            const isAcknowledged = acknowledgedAlertIds.has(alert._id);
            const isCritical = alert.severity === 'CRITICAL';

            return (
              <div
                key={alert._id || idx}
                className={`rounded-2xl border p-4 shadow-lg backdrop-blur-sm transition-all ${
                  isAcknowledged
                    ? 'border-slate-800/80 bg-slate-900/40 opacity-70'
                    : isCritical
                    ? 'border-red-500/60 bg-red-950/20 shadow-red-950/20 ring-1 ring-red-500/30'
                    : 'border-amber-500/50 bg-amber-950/20'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  {/* Left: Severity & Summary */}
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                        isCritical ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      <AlertOctagon size={20} className={isCritical && !isAcknowledged ? 'animate-pulse' : ''} />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-extrabold uppercase ${
                            isCritical ? 'bg-red-600 text-white' : 'bg-amber-600 text-white'
                          }`}
                        >
                          {alert.severity}
                        </span>
                        <h3 className="text-sm font-bold text-white font-mono">
                          Excessive {alert.sensorType?.toUpperCase()} Excursion
                        </h3>
                        {isAcknowledged && (
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                            ACKNOWLEDGED
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">{alert.message}</p>

                      <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 mt-2">
                        <span>Device: <strong className="text-slate-200">{alert.deviceId || 'ESP32-001'}</strong></span>
                        <span>•</span>
                        <span>Track Section: <strong className="text-cyan-400">SEC-B</strong></span>
                        <span>•</span>
                        <span>Location: <strong className="text-slate-200">KM 28.4</strong></span>
                        <span>•</span>
                        <span>Current Sensor Value: <strong className="text-red-400">{alert.value}</strong></span>
                        <span>•</span>
                        <span>Timestamp: <strong className="text-slate-300">{new Date(alert.timestamp).toLocaleTimeString()}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setSelectedAlertModal(alert)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 transition-colors"
                    >
                      View Details
                    </button>

                    {!isAcknowledged && (
                      <button
                        onClick={() => acknowledgeAlert(alert._id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold transition-all"
                      >
                        <Check size={14} />
                        <span>Acknowledge</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Alert Details Modal */}
      {selectedAlertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-mono text-xs font-bold text-red-400 uppercase flex items-center gap-1.5">
                <AlertOctagon size={16} /> Incident Dispatch Details
              </span>
              <button
                onClick={() => setSelectedAlertModal(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Incident Severity:</span>
                  <span className="text-red-400 font-bold">{selectedAlertModal.severity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Trigger Sensor:</span>
                  <span className="text-slate-200 uppercase font-bold">{selectedAlertModal.sensorType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Measured Value:</span>
                  <span className="text-red-400 font-bold">{selectedAlertModal.value}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Permissible Limit:</span>
                  <span className="text-slate-300">{selectedAlertModal.threshold}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Originating Node:</span>
                  <span className="text-cyan-400">{selectedAlertModal.deviceId || 'ESP32-001'}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-500">Recommended Maintenance Protocol:</span>
                <p className="mt-1 p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200">
                  Inspect track corridor SEC-B (Bridge structure KM 21–35). Check fastener torque, sleeper ballasting, and dampening pads immediately.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedAlertModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-white"
              >
                Close Dispatch Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
