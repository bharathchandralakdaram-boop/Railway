import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Activity,
  GitCommit,
  Cpu,
  AlertTriangle,
  BrainCircuit,
  BarChart3,
  FileText,
  MapPin,
  Settings,
  ChevronLeft,
  ChevronRight,
  Train,
  CircleDot,
} from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Live Monitoring', path: '/monitoring', icon: Activity },
  { name: 'Track Health', path: '/track', icon: GitCommit },
  { name: 'Devices', path: '/devices', icon: Cpu },
  { name: 'Alerts', path: '/alerts', icon: AlertTriangle, hasBadge: true },
  { name: 'AI Predictions', path: '/predictions', icon: BrainCircuit },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Reports', path: '/reports', icon: FileText },
  { name: 'Map', path: '/map', icon: MapPin },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar({ collapsed, onToggle }) {
  const { isOnline, alerts, acknowledgedAlertIds } = useTelemetry();
  const unreadAlerts = alerts.filter(a => !acknowledgedAlertIds.has(a._id)).length;

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-30 flex flex-col bg-[#0b101d] border-r border-slate-800/80 transition-all duration-300 ease-in-out ${
        collapsed ? 'w-[70px]' : 'w-[250px]'
      }`}
    >
      {/* Sidebar Header / Brand */}
      <div className="h-[72px] flex items-center justify-between px-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-md shadow-cyan-500/20">
            <Train size={20} className="text-white" />
            {isOnline && (
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400" />
              </span>
            )}
          </div>

          {!collapsed && (
            <div className="flex flex-col truncate">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-100 truncate">
                RAILWAY AI
              </span>
              <span className="text-[10px] font-mono text-cyan-400 truncate">
                OPERATIONS v1.0
              </span>
            </div>
          )}
        </div>

        {/* Collapse Toggle Button */}
        <button
          onClick={onToggle}
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={collapsed ? item.name : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-300 font-semibold border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                } ${collapsed ? 'justify-center px-0' : ''}`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={18}
                    className={`shrink-0 transition-colors ${
                      isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  {!collapsed && <span className="truncate">{item.name}</span>}

                  {/* Alert Badge */}
                  {item.hasBadge && unreadAlerts > 0 && (
                    <span
                      className={`inline-flex items-center justify-center rounded-full text-[10px] font-mono font-bold ${
                        collapsed
                          ? 'absolute top-1 right-2 h-4 w-4 bg-red-600 text-white'
                          : 'ml-auto px-1.5 py-0.5 bg-red-600/90 text-white'
                      }`}
                    >
                      {unreadAlerts}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Sidebar Footer: System Status */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
        <div
          className={`flex items-center rounded-xl p-2.5 bg-slate-900/80 border border-slate-800/80 transition-all ${
            collapsed ? 'justify-center' : 'justify-between'
          }`}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
            </span>
            {!collapsed && (
              <div className="truncate">
                <p className="text-[11px] font-bold text-slate-200 truncate">System Status</p>
                <p className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  ● System Online
                </p>
              </div>
            )}
          </div>
          {!collapsed && (
            <span className="text-[10px] font-mono text-slate-500 uppercase px-1.5 py-0.5 rounded bg-slate-800">
              LAN
            </span>
          )}
        </div>
      </div>
    </aside>
  );
}
