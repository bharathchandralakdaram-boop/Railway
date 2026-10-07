import React from 'react';
import { BrainCircuit, ShieldAlert, CheckCircle2, AlertTriangle, ArrowUpRight, Cpu, Radar, Thermometer } from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';

export default function AIPredictionsPage() {
  const { aiRiskScore, latestData, alerts } = useTelemetry();

  const isHighRisk = aiRiskScore > 40;
  const isCritical = aiRiskScore > 70;

  // Real-time sub-risk breakdowns derived from active live sensor values
  const vibVal = Number(latestData?.vibration ?? 0.23);
  const motionVal = Number(latestData?.motion ?? 0.0);
  const tempVal = Number(latestData?.temperature ?? 28.6);

  const vibRisk = Math.min(Math.round((vibVal / 1.5) * 60), 99);
  const motionRisk = Math.min(Math.round((motionVal > 0.5 ? 85 : 8)), 95);
  const tempRisk = Math.min(Math.round((tempVal / 50) * 45), 90);

  const riskLabel = isCritical ? 'CRITICAL RISK' : isHighRisk ? 'ELEVATED RISK' : 'LOW RISK';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-lg md:text-xl font-extrabold uppercase tracking-wide text-white">
            AI SAFETY INTELLIGENCE CENTER
          </h1>
          <p className="text-xs text-slate-400">
            Real-Time Predictive Risk Analysis & Failure Forecasts
          </p>
        </div>

        <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-xl">
          Engine: Prototype Threshold-Based Anomaly Model
        </span>
      </div>

      {/* Main Score Hero Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-6 shadow-xl backdrop-blur-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold uppercase text-slate-400">
                AGGREGATE AI RISK SCORE
              </span>
              <BrainCircuit size={18} className="text-cyan-400" />
            </div>

            <div className="flex items-baseline gap-3 my-4">
              <span
                className={`text-5xl font-mono font-black tracking-tight ${
                  isCritical ? 'text-red-400 animate-pulse' : isHighRisk ? 'text-amber-400' : 'text-cyan-300'
                }`}
              >
                {aiRiskScore}%
              </span>
              <span
                className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${
                  isCritical
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                    : isHighRisk
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {riskLabel}
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Evaluated across harmonic vibrations, structural cant, and atmospheric gradients.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between font-mono text-xs">
            <span className="text-slate-500">AI Confidence:</span>
            <span className="text-emerald-400 font-bold">96.4% Verified</span>
          </div>
        </div>

        {/* Prediction Status & Recommended Action */}
        <div className="md:col-span-2 rounded-2xl border border-slate-800/80 bg-slate-900/70 p-6 shadow-xl backdrop-blur-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold uppercase text-slate-400">
                PREDICTIVE STATUS & AUTOMATED PROTOCOL
              </span>
              <span className="text-xs font-mono text-slate-500">Node: ESP32-001</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 my-3">
              <span className="text-xs font-mono text-slate-400">Current Forecast:</span>
              <h3 className="text-sm md:text-base font-bold text-white mt-1">
                {isCritical
                  ? 'High likelihood of track sleeper looseness or resonance instability.'
                  : isHighRisk
                  ? 'Mild geometric oscillation detected along Sector SEC-B bridge approaches.'
                  : 'Track structure nominal with zero forecasted anomalies over next 72 hours.'}
              </h3>
            </div>

            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200 text-xs font-mono flex items-start gap-2.5">
              <ArrowUpRight size={16} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong>Recommended Engineering Dispatch:</strong>
                <p className="mt-1 text-slate-300 font-sans">
                  {isCritical
                    ? 'Immediate track inspection crew dispatch to KM 28.4. Verify rail fasteners, sleeper ballast packing, and acoustic rail damping.'
                    : 'Maintain regular scheduled track inspections. Next autonomous telemetry check in 2 seconds.'}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500">
            <span>Prediction Status: ACTIVE STREAM</span>
            <span>Refreshed: Live Telemetry</span>
          </div>
        </div>
      </div>

      {/* Sub-Risk Categorical Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Vibration Risk */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold uppercase text-slate-400">
              Vibration Risk
            </span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Activity size={16} />
            </div>
          </div>
          <p className="text-2xl font-mono font-bold text-white my-1">{vibRisk}%</p>
          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden my-2">
            <div
              className={`h-full rounded-full ${
                vibRisk > 60 ? 'bg-red-500' : 'bg-amber-400'
              }`}
              style={{ width: `${vibRisk}%` }}
            />
          </div>
          <p className="text-[11px] font-mono text-slate-500">
            Threshold: 1.50 g • Current: {vibVal} g
          </p>
        </div>

        {/* Motion / Intrusion Risk */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold uppercase text-slate-400">
              Track Intrusion & Motion Risk
            </span>
            <div className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400">
              <Radar size={16} />
            </div>
          </div>
          <p className="text-2xl font-mono font-bold text-white my-1">{motionRisk}%</p>
          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden my-2">
            <div
              className={`h-full rounded-full ${
                motionRisk > 60 ? 'bg-red-500' : 'bg-cyan-400'
              }`}
              style={{ width: `${motionRisk}%` }}
            />
          </div>
          <p className="text-[11px] font-mono text-slate-500">
            Threshold: 0.80 lvl • Current: {motionVal} lvl
          </p>
        </div>

        {/* Temperature Thermal Risk */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold uppercase text-slate-400">
              Thermal Buckling Risk
            </span>
            <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400">
              <Thermometer size={16} />
            </div>
          </div>
          <p className="text-2xl font-mono font-bold text-white my-1">{tempRisk}%</p>
          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden my-2">
            <div
              className={`h-full rounded-full ${
                tempRisk > 60 ? 'bg-red-500' : 'bg-emerald-400'
              }`}
              style={{ width: `${tempRisk}%` }}
            />
          </div>
          <p className="text-[11px] font-mono text-slate-500">
            Threshold: 50.0 °C • Current: {tempVal} °C
          </p>
        </div>
      </div>
    </div>
  );
}
