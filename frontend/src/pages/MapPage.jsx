import React, { useState } from 'react';
import { MapPin, Train, ShieldCheck, AlertTriangle, Radio, Compass, Navigation } from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';

export default function MapPage() {
  const { latestData, alerts, trackHealthScore, isOnline } = useTelemetry();
  const [selectedStation, setSelectedStation] = useState('SEC-B');

  const isAnomaly = alerts && alerts.length > 0;

  const waypoints = [
    {
      id: 'SEC-A',
      name: 'North Approach Terminal',
      km: 'KM 10.0',
      coords: '28°36\'42"N 77°12\'18"E',
      status: 'STABLE',
      health: '99.8%',
      isHazard: false,
    },
    {
      id: 'SEC-B',
      name: 'Central River Viaduct & Bridge',
      km: 'KM 28.4',
      coords: '28°38\'14"N 77°14\'52"E',
      status: isAnomaly ? 'VIBRATION DEFECT' : 'OPTIMAL',
      health: `${trackHealthScore}%`,
      isHazard: isAnomaly,
      hasSensor: true,
    },
    {
      id: 'SEC-C',
      name: 'Valley Curve & S-Bend',
      km: 'KM 44.2',
      coords: '28°40\'05"N 77°17\'11"E',
      status: 'STABLE WARNING',
      health: '94.2%',
      isHazard: false,
    },
    {
      id: 'SEC-D',
      name: 'Southern Junction & Depot',
      km: 'KM 62.0',
      coords: '28°42\'30"N 77°19\'40"E',
      status: 'STABLE',
      health: '99.1%',
      isHazard: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-lg md:text-xl font-extrabold uppercase tracking-wide text-white">
            DIGITAL RAILWAY CORRIDOR SCHEMATIC MAP
          </h1>
          <p className="text-xs text-slate-400">
            Topological Geo-Corridor View • Track Waypoints & Edge Telemetry Node
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-xl flex items-center gap-1.5">
            <Navigation size={13} />
            <span>Orientation: Northbound Track 01</span>
          </span>
        </div>
      </div>

      {/* Main Digital Map Canvas */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-6 shadow-2xl backdrop-blur-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <span className="text-xs font-mono font-bold text-slate-300">
            TOPOLOGICAL TRACK ROUTE: SECTOR ALPHA-01
          </span>
          <span className="text-xs font-mono text-slate-500">
            Datum: WGS84 • Spatial Projection: Linear Rail
          </span>
        </div>

        {/* Schematic Railway Line with Interactive Station Nodes */}
        <div className="relative py-16 px-4 md:px-12 my-6">
          {/* Main Track Backbone Line */}
          <div className="h-2 w-full bg-slate-700 rounded-full relative">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isAnomaly
                  ? 'bg-gradient-to-r from-emerald-500 via-rose-500 to-emerald-500'
                  : 'bg-gradient-to-r from-cyan-500 via-emerald-500 to-cyan-500'
              }`}
            />
          </div>

          {/* Station Waypoint Nodes along the track */}
          <div className="absolute inset-x-4 md:inset-x-12 top-1/2 -translate-y-1/2 flex justify-between">
            {waypoints.map((wp) => {
              const isSelected = selectedStation === wp.id;
              return (
                <div
                  key={wp.id}
                  onClick={() => setSelectedStation(wp.id)}
                  className="flex flex-col items-center cursor-pointer group"
                >
                  {/* Waypoint Icon / Pin */}
                  <div
                    className={`h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all ${
                      wp.isHazard
                        ? 'border-red-500 bg-red-950 text-red-400 animate-bounce shadow-lg shadow-red-500/50'
                        : isSelected
                        ? 'border-cyan-400 bg-slate-900 text-cyan-300 ring-4 ring-cyan-500/20'
                        : 'border-slate-500 bg-slate-950 text-slate-400 group-hover:border-slate-300'
                    }`}
                  >
                    {wp.hasSensor ? <Train size={14} /> : <MapPin size={14} />}
                  </div>

                  {/* Waypoint Label */}
                  <div className="mt-3 text-center font-mono">
                    <span className="text-xs font-bold text-white block group-hover:text-cyan-300">
                      {wp.id}
                    </span>
                    <span className="text-[10px] text-slate-500 block">{wp.km}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Station Telemetry Card */}
        {(() => {
          const currentWp = waypoints.find((w) => w.id === selectedStation) || waypoints[1];
          return (
            <div className="mt-6 p-4 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-slate-500 text-[10px]">SELECTED WAYPOINT INSPECTION</span>
                <h3 className="text-sm font-bold text-white mt-0.5">{currentWp.name} ({currentWp.id})</h3>
                <p className="text-slate-400 text-[11px] mt-0.5">Coordinates: {currentWp.coords}</p>
              </div>

              <div className="flex items-center gap-6">
                <div>
                  <span className="text-slate-500 text-[10px]">HEALTH</span>
                  <p className="font-bold text-emerald-400">{currentWp.health}</p>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px]">CORRIDOR STATUS</span>
                  <p className={currentWp.isHazard ? 'font-bold text-red-400' : 'font-bold text-slate-200'}>
                    {currentWp.status}
                  </p>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px]">PROBE UNIT</span>
                  <p className="font-bold text-cyan-400">{currentWp.hasSensor ? 'ESP32-001 (LIVE)' : 'Passive'}</p>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
