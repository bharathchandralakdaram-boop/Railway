import React from 'react';
import { Cpu, ShieldCheck, AlertTriangle, BrainCircuit, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';

export default function KPIStats() {
  const { isOnline, trackHealthScore, aiRiskScore, alerts, acknowledgedAlertIds } = useTelemetry();

  const activeAlertCount = alerts.filter((a) => !acknowledgedAlertIds.has(a._id)).length;
  const isHealthy = trackHealthScore >= 90;
  const isLowRisk = aiRiskScore < 25;

  const kpis = [
    {
      title: 'ACTIVE DEVICES',
      value: isOnline ? '01 / 01' : '00 / 01',
      subtitle: isOnline ? 'ESP32-001 Streaming' : 'All probes disconnected',
      icon: Cpu,
      status: isOnline ? 'ONLINE' : 'OFFLINE',
      statusColor: isOnline ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400 bg-slate-800',
    },
    {
      title: 'TRACK HEALTH',
      value: `${trackHealthScore}%`,
      subtitle: isHealthy ? 'Corridor fully stable' : 'Minor track defect detected',
      icon: ShieldCheck,
      status: isHealthy ? 'OPTIMAL' : 'ATTENTION',
      statusColor: isHealthy ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10',
    },
    {
      title: 'ACTIVE ALERTS',
      value: activeAlertCount < 10 ? `0${activeAlertCount}` : `${activeAlertCount}`,
      subtitle: activeAlertCount === 0 ? 'Zero unhandled faults' : 'Requires inspection',
      icon: AlertTriangle,
      status: activeAlertCount === 0 ? 'RESOLVED' : 'UNRESOLVED',
      statusColor: activeAlertCount === 0 ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10',
    },
    {
      title: 'AI RISK INDEX',
      value: `${aiRiskScore}%`,
      subtitle: isLowRisk ? 'Low probability of failure' : 'Vibration excursion hazard',
      icon: BrainCircuit,
      status: isLowRisk ? 'LOW RISK' : 'ELEVATED RISK',
      statusColor: isLowRisk ? 'text-cyan-400 bg-cyan-500/10' : 'text-rose-400 bg-rose-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <div
            key={index}
            className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 shadow-lg shadow-black/40 backdrop-blur-sm transition-all duration-200 hover:border-slate-700/90"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-bold tracking-wider text-slate-400">
                {kpi.title}
              </span>
              <div className="p-2 rounded-xl bg-slate-800/80 text-cyan-400">
                <Icon size={16} />
              </div>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-2xl md:text-3xl font-mono font-extrabold tracking-tight text-white">
                {kpi.value}
              </span>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${kpi.statusColor}`}
              >
                {kpi.status}
              </span>
            </div>

            <p className="mt-2 text-xs text-slate-400 truncate font-medium">{kpi.subtitle}</p>
          </div>
        );
      })}
    </div>
  );
}
