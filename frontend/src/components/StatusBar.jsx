import { useState, useEffect } from 'react';
import { Server, Database, Radio, Wifi, Clock } from 'lucide-react';

export default function StatusBar({ socketConnected, health, latestData, lastUpdate }) {
  const [timeStr, setTimeStr] = useState('');
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const update = () => {
      const d = new Date();
      setTimeStr(d.toLocaleTimeString());
      setNow(Date.now());
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  const backendOnline = health?.status === 'online';
  const mongoConnected = health?.services?.mongodb === 'connected';
  const esp32Online =
    latestData &&
    lastUpdate &&
    now - new Date(lastUpdate).getTime() < 30000;

  const items = [
    { label: 'BACKEND', icon: Server, online: backendOnline },
    { label: 'MONGODB', icon: Database, online: mongoConnected },
    { label: 'ESP32', icon: Radio, online: esp32Online },
    { label: 'SOCKET.IO', icon: Wifi, online: socketConnected },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 md:gap-3">
      {/* Live Digital Clock */}
      <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300">
        <Clock size={13} className="text-cyan-400 animate-pulse" />
        <span>{timeStr || '--:--:--'}</span>
      </div>

      {/* Hardware Status Indicators */}
      {items.map((item) => (
        <div
          key={item.label}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono font-medium transition-all ${
            item.online
              ? 'bg-slate-900/90 border-emerald-500/30 text-emerald-300 shadow-sm shadow-emerald-500/10'
              : 'bg-slate-900/90 border-rose-500/30 text-rose-300 shadow-sm shadow-rose-500/10'
          }`}
        >
          <span className="relative flex h-2 w-2">
            {item.online && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                item.online ? 'bg-emerald-400' : 'bg-rose-500'
              }`}
            ></span>
          </span>
          <item.icon size={13} className="opacity-80" />
          <span className="text-slate-400 tracking-wider text-[11px]">{item.label}</span>
          <span className={item.online ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
            {item.online ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>
      ))}
    </div>
  );
}
