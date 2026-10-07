import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Cpu, GitCommit, AlertTriangle, Activity, ArrowRight } from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';

export default function GlobalSearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { deviceId, latestData, alerts } = useTelemetry();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Search items list
  const searchableItems = [
    {
      type: 'device',
      title: deviceId || 'ESP32-001',
      subtitle: 'Active IoT Telemetry Probe • Sector SEC-B',
      icon: Cpu,
      path: `/devices/${deviceId || 'ESP32-001'}`,
    },
    {
      type: 'section',
      title: 'SEC-A (KM 10–20)',
      subtitle: 'North Approach • Normal Stability',
      icon: GitCommit,
      path: '/track/SEC-A',
    },
    {
      type: 'section',
      title: 'SEC-B (KM 21–35)',
      subtitle: 'Central Bridge Span • Active ESP32-001 Sensor',
      icon: GitCommit,
      path: '/track/SEC-B',
    },
    {
      type: 'section',
      title: 'SEC-C (KM 36–50)',
      subtitle: 'Valley Curve • Continuous Inspection',
      icon: GitCommit,
      path: '/track/SEC-C',
    },
    {
      type: 'section',
      title: 'SEC-D (KM 51–65)',
      subtitle: 'Terminal Junction • Stable Corridor',
      icon: GitCommit,
      path: '/track/SEC-D',
    },
    {
      type: 'sensor',
      title: 'Track Vibration Sensor',
      subtitle: `Current: ${latestData?.vibration ?? '--'} g (Threshold: 1.5g)`,
      icon: Activity,
      path: '/monitoring',
    },
    {
      type: 'sensor',
      title: 'Track Motion Sensor',
      subtitle: `Current: ${latestData?.motion ?? '--'} lvl (PIR Obstacle / Intrusion)`,
      icon: Activity,
      path: '/monitoring',
    },
    {
      type: 'sensor',
      title: 'Rail Temperature',
      subtitle: `Current: ${latestData?.temperature ?? '--'} °C`,
      icon: Activity,
      path: '/monitoring',
    },
    {
      type: 'alert',
      title: 'Active Anomaly Alerts',
      subtitle: `${alerts.length} system anomalies detected in log`,
      icon: AlertTriangle,
      path: '/alerts',
    },
  ];

  const filtered = searchableItems.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 gap-3">
          <Search size={18} className="text-slate-400" />
          <input
            autoFocus
            type="text"
            placeholder="Search device, track section, sensor, or alert..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-8">
              No matching devices, sections, or sensors found.
            </p>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(item.path)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 rounded-lg bg-slate-800 text-cyan-400 group-hover:bg-cyan-500/20 group-hover:text-cyan-300 transition-colors">
                      <Icon size={16} />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">{item.subtitle}</p>
                    </div>
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-slate-600 group-hover:text-cyan-400 transition-colors mr-1"
                  />
                </button>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>Navigate with click or arrow keys</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
}
