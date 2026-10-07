import { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_URL, BACKEND_URL } from '../config/api';

const MAX_HISTORY = 50; // Keep last 50 readings for charts

export function useSocket() {
  const [connected, setConnected] = useState(false);
  const [latestData, setLatestData] = useState(null);
  const [history, setHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);
  const socketRef = useRef(null);

  // Pre-load persisted data from MongoDB on mount so the dashboard never starts empty
  useEffect(() => {
    async function loadInitialData() {
      try {
        // 1. Fetch latest reading
        const latestRes = await fetch(`${BACKEND_URL}/api/readings/latest`);
        const latestJson = await latestRes.json();
        if (latestJson?.success && latestJson.data) {
          setLatestData(latestJson.data);
          setLastUpdate(new Date(latestJson.data.timestamp));
        }

        // 2. Fetch historical readings for charts
        const historyRes = await fetch(`${BACKEND_URL}/api/readings?limit=30`);
        const historyJson = await historyRes.json();
        if (historyJson?.success && Array.isArray(historyJson.data)) {
          // Sort ascending for chronological chart order
          const formatted = historyJson.data
            .slice()
            .reverse()
            .map((item) => ({
              ...item,
              time: new Date(item.timestamp).toLocaleTimeString(),
            }));
          setHistory(formatted);
        }

        // 3. Fetch past alerts
        const alertsRes = await fetch(`${BACKEND_URL}/api/alerts?limit=10`);
        const alertsJson = await alertsRes.json();
        if (alertsJson?.success && Array.isArray(alertsJson.data)) {
          setAlerts(alertsJson.data);
        }
      } catch (err) {
        console.error('Failed to prefetch initial sensor data:', err);
      }
    }

    loadInitialData();
  }, []);

  // Real-time Socket.IO listener
  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket.IO connected');
      setConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Socket.IO disconnected');
      setConnected(false);
    });

    socket.on('sensorData', (data) => {
      setLatestData(data);
      setLastUpdate(new Date(data.timestamp || Date.now()));
      setHistory((prev) => {
        const updated = [
          ...prev,
          {
            ...data,
            time: new Date(data.timestamp || Date.now()).toLocaleTimeString(),
          },
        ];
        return updated.slice(-MAX_HISTORY);
      });
    });

    socket.on('alert', (alert) => {
      setAlerts((prev) => [alert, ...prev].slice(0, 20));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  return { connected, latestData, history, alerts, lastUpdate, clearAlerts };
}
