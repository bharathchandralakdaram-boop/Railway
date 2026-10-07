import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Cpu, Wifi, CheckCircle2, XCircle, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';

export default function DevicesPage() {
  const { deviceId, isOnline, lastUpdate, latestData } = useTelemetry();
  const navigate = useNavigate();

  // Dynamic device list anchored around active live device
  const devices = [
    {
      id: deviceId || 'ESP32-001',
      name: 'Corridor Primary Probe',
      status: isOnline ? 'ONLINE' : 'OFFLINE',
      trackSection: 'SEC-B (KM 21–35)',
      firmware: 'ESP32-WIFI-HTTP-JSON v1.4',
      lastSeen: isOnline ? 'Just now' : lastUpdate ? new Date(lastUpdate).toLocaleTimeString() : 'Unknown',
      signal: isOnline ? '-54 dBm (Excellent)' : '--',
      ip: '192.168.1.100',
      activeSensors: 'Vibration, Motion, Temp, Humidity, Press, Freq',
      isPrimary: true,
    },
    {
      id: 'ESP32-002',
      name: 'North Approach Relay',
      status: 'STANDBY',
      trackSection: 'SEC-A (KM 10–20)',
      firmware: 'ESP32-WIFI-HTTP-JSON v1.4',
      lastSeen: '12 min ago',
      signal: '-68 dBm (Good)',
      ip: '192.168.1.102',
      activeSensors: 'Vibration, Temperature',
      isPrimary: false,
    },
    {
      id: 'ESP32-003',
      name: 'South Valley Sentinel',
      status: 'STANDBY',
      trackSection: 'SEC-C (KM 36–50)',
      firmware: 'ESP32-WIFI-HTTP-JSON v1.4',
      lastSeen: '1 hr ago',
      signal: '-72 dBm (Fair)',
      ip: '192.168.1.103',
      activeSensors: 'Motion, Vibration',
      isPrimary: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-lg md:text-xl font-extrabold uppercase tracking-wide text-white">
            ESP32 HARDWARE DEVICE DIRECTORY
          </h1>
          <p className="text-xs text-slate-400">
            IoT Edge Microcontrollers • Wireless Mesh & Sensor Node Health
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-xl">
            {isOnline ? '1 Active Edge Transmitter' : '0 Active Transmitters'}
          </span>
        </div>
      </div>

      {/* Devices Table Card */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 shadow-xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Device Unit</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Track Section</th>
                <th className="py-3.5 px-4">Firmware</th>
                <th className="py-3.5 px-4">Signal / RSSI</th>
                <th className="py-3.5 px-4">Last Telemetry</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {devices.map((dev) => (
                <tr
                  key={dev.id}
                  onClick={() => navigate(`/devices/${dev.id}`)}
                  className="hover:bg-slate-800/50 cursor-pointer transition-colors group"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-slate-800 text-cyan-400 group-hover:bg-cyan-500/20">
                        <Cpu size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-200 group-hover:text-cyan-300">{dev.id}</p>
                        <p className="text-[10px] text-slate-500 font-sans">{dev.name}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        dev.status === 'ONLINE'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          dev.status === 'ONLINE' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                        }`}
                      />
                      {dev.status}
                    </span>
                  </td>

                  <td className="py-4 px-4 font-bold text-slate-300">{dev.trackSection}</td>

                  <td className="py-4 px-4 text-slate-400">{dev.firmware}</td>

                  <td className="py-4 px-4 text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Wifi size={13} className={dev.status === 'ONLINE' ? 'text-emerald-400' : 'text-slate-500'} />
                      <span>{dev.signal}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-slate-400">{dev.lastSeen}</td>

                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/devices/${dev.id}`);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 font-bold transition-all text-xs"
                    >
                      <span>Telemetry</span>
                      <ArrowRight size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
