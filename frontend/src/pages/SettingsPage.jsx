import React, { useState } from 'react';
import { Settings, Server, Cpu, Activity, BrainCircuit, Palette, CheckCircle } from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';

export default function SettingsPage() {
  const { deviceId, health } = useTelemetry();
  const [activeTab, setActiveTab] = useState('sensors');
  const [saved, setSaved] = useState(false);

  // Settings state matching backend threshold logic
  const [thresholds, setThresholds] = useState({
    vibrationMax: 1.5,
    motionThreshold: 0.8,
    tempMax: 50.0,
    tempMin: -10.0,
    pressureMin: 950,
    pressureMax: 1050,
    frequencyMin: 45,
    frequencyMax: 55,
  });

  const [esp32Config, setEsp32Config] = useState({
    samplingRateMs: 2000,
    primaryNodeId: deviceId || 'ESP32-001',
    autoAcknowledge: false,
    soundAlerts: true,
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: 'system', name: 'System Core', icon: Server },
    { id: 'esp32', name: 'ESP32 Hardware', icon: Cpu },
    { id: 'sensors', name: 'Sensor Thresholds', icon: Activity },
    { id: 'ai', name: 'AI Engine', icon: BrainCircuit },
    { id: 'appearance', name: 'Appearance', icon: Palette },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-lg md:text-xl font-extrabold uppercase tracking-wide text-white">
            CONTROL CONSOLE CONFIGURATION & THRESHOLDS
          </h1>
          <p className="text-xs text-slate-400">
            Calibrate safety tolerances, sampling frequency & telemetry routing
          </p>
        </div>

        {saved && (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-bold">
            <CheckCircle size={14} />
            <span>Preferences Saved</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-mono text-xs font-semibold text-left transition-all ${
                  activeTab === tab.id
                    ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon size={16} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panes */}
        <div className="md:col-span-3 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm">
          <form onSubmit={handleSave} className="space-y-6">
            {/* SENSORS TAB */}
            {activeTab === 'sensors' && (
              <div className="space-y-4">
                <h2 className="text-sm font-bold text-white font-mono uppercase pb-2 border-b border-slate-800">
                  Track Safety Threshold Limits
                </h2>
                <p className="text-xs text-slate-400">
                  When physical ESP32 sensor values cross these tolerances, an autonomous AI alert is emitted.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Max Vibration Limit (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={thresholds.vibrationMax}
                      onChange={(e) =>
                        setThresholds({ ...thresholds, vibrationMax: parseFloat(e.target.value) })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500">Standard Rail Limit: 1.50 g</span>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Motion Sensor Alert Trigger (lvl)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={thresholds.motionThreshold}
                      onChange={(e) =>
                        setThresholds({ ...thresholds, motionThreshold: parseFloat(e.target.value) })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500">PIR Intrusion Detection Trigger: 0.80 lvl</span>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Max Rail Temperature (°C)</label>
                    <input
                      type="number"
                      step="1"
                      value={thresholds.tempMax}
                      onChange={(e) =>
                        setThresholds({ ...thresholds, tempMax: parseFloat(e.target.value) })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500">Thermal Buckling Threshold: 50.0 °C</span>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Sampling Frequency Min/Max (Hz)</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={thresholds.frequencyMin}
                        className="w-1/2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                        readOnly
                      />
                      <input
                        type="number"
                        value={thresholds.frequencyMax}
                        className="w-1/2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ESP32 HARDWARE TAB */}
            {activeTab === 'esp32' && (
              <div className="space-y-4 font-mono text-xs">
                <h2 className="text-sm font-bold text-white uppercase pb-2 border-b border-slate-800">
                  ESP32 Microcontroller Interface
                </h2>

                <div>
                  <label className="text-slate-400 block mb-1">Target Ingestion Endpoint</label>
                  <input
                    type="text"
                    value="POST http://<SERVER_IP>:5000/api/sensor-data"
                    readOnly
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-cyan-400 font-bold"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Transmission Heartbeat (ms)</label>
                  <input
                    type="number"
                    value={esp32Config.samplingRateMs}
                    onChange={(e) =>
                      setEsp32Config({ ...esp32Config, samplingRateMs: parseInt(e.target.value) })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                  <span className="text-[10px] text-slate-500">Default cadence: 2000 ms</span>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={esp32Config.soundAlerts}
                      onChange={(e) =>
                        setEsp32Config({ ...esp32Config, soundAlerts: e.target.checked })
                      }
                      className="rounded bg-slate-950 border-slate-800 text-cyan-500"
                    />
                    <span>Audio Beacon on Critical Anomaly</span>
                  </label>
                </div>
              </div>
            )}

            {/* SYSTEM TAB */}
            {activeTab === 'system' && (
              <div className="space-y-3 font-mono text-xs">
                <h2 className="text-sm font-bold text-white uppercase pb-2 border-b border-slate-800">
                  Platform Core Stack Status
                </h2>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Backend API Engine:</span>
                    <span className="text-emerald-400 font-bold">Node.js Express (Port 5000)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Database Engine:</span>
                    <span className="text-emerald-400 font-bold">MongoDB Mongoose (Port 27017)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">WebSocket Transport:</span>
                    <span className="text-emerald-400 font-bold">Socket.IO (Full-Duplex)</span>
                  </div>
                </div>
              </div>
            )}

            {/* AI TAB */}
            {activeTab === 'ai' && (
              <div className="space-y-3 font-mono text-xs">
                <h2 className="text-sm font-bold text-white uppercase pb-2 border-b border-slate-800">
                  AI & Anomaly Detection Model Profile
                </h2>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Algorithm Class:</span>
                    <span className="text-cyan-400 font-bold">Multi-Variable Threshold Engine</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Execution Mode:</span>
                    <span className="text-white font-bold">In-Memory Edge Streaming</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status Label:</span>
                    <span className="text-amber-400 font-bold">Prototype Anomaly Detection</span>
                  </div>
                </div>
              </div>
            )}

            {/* APPEARANCE TAB */}
            {activeTab === 'appearance' && (
              <div className="space-y-3 font-mono text-xs">
                <h2 className="text-sm font-bold text-white uppercase pb-2 border-b border-slate-800">
                  Visual Theme & Interface
                </h2>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Theme:</span>
                    <span className="text-cyan-400 font-bold">Industrial Cyber Dark</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Typography:</span>
                    <span className="text-slate-300">Plus Jakarta Sans + JetBrains Mono</span>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs shadow-lg shadow-cyan-500/20 cursor-pointer transition-all"
              >
                Apply Parameters
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
