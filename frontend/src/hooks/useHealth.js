import { useState, useEffect } from 'react';
import { BACKEND_URL } from '../config/api';

const API_URL = `${BACKEND_URL}/api`;

export function useHealth() {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    async function fetchHealth() {
      try {
        const res = await fetch(`${API_URL}/health`);
        const data = await res.json();
        setHealth(data.data);
      } catch {
        setHealth(null);
      }
    }

    fetchHealth();
    const interval = setInterval(fetchHealth, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  return health;
}
