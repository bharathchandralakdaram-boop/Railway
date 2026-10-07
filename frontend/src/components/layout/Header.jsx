import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  User,
  Zap,
  RefreshCw,
  Server,
  Database,
  Radio,
  Wifi,
  BrainCircuit,
  ChevronDown,
  X,
  AlertTriangle,
  CheckCircle2,
  Train,
} from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';

export default function Header({ onOpenSearch }) {
  const {
    connected,
    health,
    isOnline,
    alerts,
    triggering,
    triggerDemoAnomaly,
    triggerNormalTelemetry,
    acknowledgedAlertIds,
  } = useTelemetry();

  const [statusOpen, setStatusOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const statusRef = useRef(null);
  const notifRef = useRef(null);
  const userRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (statusRef.current && !statusRef.current.contains(event.target)) {
        setStatusOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const backendOnline = health?.status === 'online';
  const mongoConnected = health?.services?.mongodb === 'connected';
  const socketOnline = connected;
  const espOnline = isOnline;
  const aiOnline = true; // Prototype threshold engine active

  const allHealthy = backendOnline && mongoConnected && socketOnline && espOnline;
  const unreadAlerts = alerts.filter((a) => !acknowledgedAlertIds.has(a._id));

  return (
    <header className="h-[72px] sticky top-0 z-20 bg-[#090d16]/90 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-6 flex items-center justify-between gap-4">
      {/* Left Title & Subtitle */}
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm md:text-base font-extrabold tracking-wide text-slate-100 uppercase">
              Railway AI Intelligence Center
            </h1>
            <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              PROD
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden sm:block">
            ESP32 Autonomous Track Telemetry & Predictive Safety
          </p>
        </div>
      </div>

      {/* Center Search Input Trigger */}
      <div className="flex-1 max-w-md hidden md:block">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 hover:border-slate-700 hover:text-slate-200 transition-all text-left"
        >
          <Search size={15} className="text-slate-500" />
          <span className="truncate">Search device, track section, alert...</span>
          <kbd className="ml-auto text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center gap-2.5">
        {/* Baseline & Anomaly Testing Demo Action Buttons */}
        <div className="hidden lg:flex items-center gap-2 mr-1">
          <button
            onClick={triggerNormalTelemetry}
            disabled={triggering}
            title="Injects normal baseline telemetry (28.6°C, 0.23g)"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition-all disabled:opacity-50"
          >
            <RefreshCw size={12} className={triggering ? 'animate-spin' : ''} />
            <span>Baseline</span>
          </button>

          <button
            onClick={triggerDemoAnomaly}
            disabled={triggering}
            title="Injects 2.85g abnormal vibration spike to trigger real-time alert"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-gradient-to-r from-amber-600/20 to-red-600/20 hover:from-amber-600/30 hover:to-red-600/30 text-amber-300 border border-amber-500/40 shadow-sm transition-all disabled:opacity-50"
          >
            <Zap size={13} className={triggering ? 'animate-bounce' : 'text-amber-400'} />
            <span>Test Anomaly</span>
            <span className="text-[9px] bg-amber-500/30 text-amber-200 px-1 py-0.2 rounded uppercase">
              Demo
            </span>
          </button>
        </div>

        {/* System Status Dropdown Pill */}
        <div className="relative" ref={statusRef}>
          <button
            onClick={() => setStatusOpen(!statusOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono font-semibold transition-all ${
              allHealthy
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300 hover:bg-emerald-950/60'
                : 'bg-slate-900 border-amber-500/30 text-amber-300 hover:bg-slate-800'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                  allHealthy ? 'bg-emerald-400' : 'bg-amber-400'
                } opacity-75`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  allHealthy ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
            </span>
            <span className="hidden sm:inline">
              {allHealthy ? 'SYSTEM ONLINE' : 'SYSTEM DEGRADED'}
            </span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {/* System Status Dropdown Panel */}
          {statusOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-3 space-y-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Component Status
                </span>
                <span className="text-[10px] font-mono text-cyan-400">Live Health Check</span>
              </div>

              <div className="space-y-1.5 font-mono text-xs">
                <div className="flex items-center justify-between p-1.5 rounded bg-slate-950/50">
                  <span className="flex items-center gap-2 text-slate-300">
                    <Server size={13} className="text-slate-400" /> Backend
                  </span>
                  <span className={backendOnline ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {backendOnline ? 'ONLINE' : 'OFFLINE'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-1.5 rounded bg-slate-950/50">
                  <span className="flex items-center gap-2 text-slate-300">
                    <Database size={13} className="text-slate-400" /> MongoDB
                  </span>
                  <span className={mongoConnected ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {mongoConnected ? 'CONNECTED' : 'OFFLINE'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-1.5 rounded bg-slate-950/50">
                  <span className="flex items-center gap-2 text-slate-300">
                    <Radio size={13} className="text-slate-400" /> ESP32 Device
                  </span>
                  <span className={espOnline ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {espOnline ? 'ONLINE' : 'OFFLINE'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-1.5 rounded bg-slate-950/50">
                  <span className="flex items-center gap-2 text-slate-300">
                    <Wifi size={13} className="text-slate-400" /> Socket.IO
                  </span>
                  <span className={socketOnline ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {socketOnline ? 'ONLINE' : 'OFFLINE'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-1.5 rounded bg-slate-950/50">
                  <span className="flex items-center gap-2 text-slate-300">
                    <BrainCircuit size={13} className="text-slate-400" /> AI Engine
                  </span>
                  <span className="text-emerald-400 font-bold">ONLINE</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="System Notifications"
          >
            <Bell size={18} />
            {unreadAlerts > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Recent Events ({alerts.length})
                </span>
                <span className="text-[10px] font-mono text-cyan-400">Live Feed</span>
              </div>

              <div className="mt-2 space-y-2 max-h-64 overflow-y-auto pr-1">
                {alerts.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">No recent notifications</p>
                ) : (
                  alerts.slice(0, 5).map((a, i) => (
                    <div
                      key={a._id || i}
                      className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-red-400 flex items-center gap-1">
                          <AlertTriangle size={12} /> {a.sensorType?.toUpperCase()} ANOMALY
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {new Date(a.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-slate-300 text-[11px] line-clamp-2">{a.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User / Operator Menu */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800/80 text-slate-300 transition-colors"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-600/30 text-cyan-300 text-xs font-bold">
              OP
            </div>
            <span className="text-xs font-mono font-medium hidden md:inline">DISPATCH-01</span>
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 text-xs text-slate-300 space-y-1">
              <div className="p-2 border-b border-slate-800">
                <p className="font-bold text-white">Chief Rail Controller</p>
                <p className="text-[11px] font-mono text-slate-500">Sector South Corridor</p>
              </div>
              <button
                onClick={() => setUserMenuOpen(false)}
                className="w-full text-left p-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Control Console Settings
              </button>
              <button
                onClick={() => setUserMenuOpen(false)}
                className="w-full text-left p-2 rounded-lg hover:bg-slate-800 text-cyan-400 transition-colors"
              >
                Switch to Simulation Mode
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
