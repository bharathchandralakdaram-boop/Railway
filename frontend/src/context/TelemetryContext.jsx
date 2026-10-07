import React, { createContext, useContext, useState, useMemo } from 'react';
import { useSocket } from '../hooks/useSocket';
import { useHealth } from '../hooks/useHealth';
import { BACKEND_URL } from '../config/api';

const TelemetryContext = createContext(null);

export function TelemetryProvider({ children }) {
  const socketData = useSocket();
  const health = useHealth();
  const [triggering, setTriggering] = useState(false);
  const [acknowledgedAlertIds, setAcknowledgedAlertIds] = useState(new Set());

  const { latestData: rawLatest, history: rawHistory, alerts, lastUpdate, connected, clearAlerts } = socketData;

  // Normalize data so 'motion' is always available (falls back to tilt if legacy data)
  const latestData = useMemo(() => {
    if (!rawLatest) return null;
    return {
      ...rawLatest,
      motion: rawLatest.motion !== undefined ? rawLatest.motion : (rawLatest.tilt !== undefined ? rawLatest.tilt : 0),
    };
  }, [rawLatest]);

  const history = useMemo(() => {
    if (!rawHistory) return [];
    return rawHistory.map((item) => ({
      ...item,
      motion: item.motion !== undefined ? item.motion : (item.tilt !== undefined ? item.tilt : 0),
    }));
  }, [rawHistory]);

  const deviceId = latestData?.deviceId || 'ESP32-001';
  const isOnline = latestData && lastUpdate && (Date.now() - new Date(lastUpdate).getTime() < 30000);

  // Calculate dynamic sensor statistics (Min, Avg, Max) from history
  const sensorStats = useMemo(() => {
    const keys = ['temperature', 'humidity', 'vibration', 'pressure', 'frequency', 'motion'];
    const stats = {};

    keys.forEach((key) => {
      const vals = history
        .map((h) => h[key])
        .filter((v) => v !== undefined && v !== null && !isNaN(v));

      if (vals.length > 0) {
        const min = Math.min(...vals);
        const max = Math.max(...vals);
        const sum = vals.reduce((a, b) => a + b, 0);
        const avg = sum / vals.length;
        stats[key] = {
          min: Number(min.toFixed(1)),
          avg: Number(avg.toFixed(1)),
          max: Number(max.toFixed(1)),
          history: vals.slice(-15), // Last 15 points for mini sparkline
        };
      } else {
        const cur = latestData?.[key] ?? 0;
        stats[key] = {
          min: cur,
          avg: cur,
          max: cur,
          history: [cur],
        };
      }
    });

    return stats;
  }, [history, latestData]);

  // Dynamic Track Health Score: 99.4% down to lower when vibration or alerts spike
  const trackHealthScore = useMemo(() => {
    if (!latestData) return 98.7;
    const vib = Number(latestData.vibration || 0.23);
    const motion = Number(latestData.motion || 0);
    const activeAlertCount = alerts.filter(a => !acknowledgedAlertIds.has(a._id)).length;

    let score = 99.4;
    if (vib > 1.5) {
      score -= (vib - 1.5) * 15;
    }
    if (motion > 1.0) {
      score -= 8;
    }
    score -= activeAlertCount * 4.5;
    return Math.max(Math.min(Number(score.toFixed(1)), 100), 55.0);
  }, [latestData, alerts, acknowledgedAlertIds]);

  // AI Risk Score (0 - 100%)
  const aiRiskScore = useMemo(() => {
    if (!latestData) return 7;
    const vib = Number(latestData.vibration || 0.23);
    const motion = Number(latestData.motion || 0);
    let risk = 5;

    if (vib > 1.5) {
      risk += Math.min((vib - 1.5) * 45 + 35, 75);
    } else {
      risk += (vib / 1.5) * 12;
    }

    if (motion > 1.0) {
      risk += 25; // Track intrusion / motion hazard
    }

    return Math.min(Math.round(risk), 98);
  }, [latestData]);

  // Acknowledge alert helper
  const acknowledgeAlert = (id) => {
    setAcknowledgedAlertIds((prev) => new Set([...prev, id]));
  };

  // Demo action: inject high vibration (2.85g) and motion detection to trigger real-time AI alert
  const triggerDemoAnomaly = async () => {
    setTriggering(true);
    try {
      await fetch(`${BACKEND_URL}/api/sensor-data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId: 'ESP32-001',
          temperature: 34.2,
          humidity: 65.0,
          vibration: 2.85,
          pressure: 1012.0,
          frequency: 48.0,
          motion: 1.0, // Motion detected on track
        }),
      });
    } catch (err) {
      console.error('Demo trigger failed', err);
    } finally {
      setTimeout(() => setTriggering(false), 400);
    }
  };

  // Demo action: send normal baseline data
  const triggerNormalTelemetry = async () => {
    setTriggering(true);
    try {
      await fetch(`${BACKEND_URL}/api/sensor-data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId: 'ESP32-001',
          temperature: 28.6,
          humidity: 61.4,
          vibration: 0.23,
          pressure: 1012.4,
          frequency: 48.2,
          motion: 0.0, // Clear track
        }),
      });
    } catch (err) {
      console.error('Normal trigger failed', err);
    } finally {
      setTimeout(() => setTriggering(false), 400);
    }
  };

  const value = {
    latestData,
    history,
    alerts,
    lastUpdate,
    connected,
    health,
    deviceId,
    isOnline,
    sensorStats,
    trackHealthScore,
    aiRiskScore,
    triggering,
    acknowledgedAlertIds,
    acknowledgeAlert,
    clearAlerts,
    triggerDemoAnomaly,
    triggerNormalTelemetry,
  };

  return (
    <TelemetryContext.Provider value={value}>
      {children}
    </TelemetryContext.Provider>
  );
}

export function useTelemetry() {
  const ctx = useContext(TelemetryContext);
  if (!ctx) {
    throw new Error('useTelemetry must be used within a TelemetryProvider');
  }
  return ctx;
}
