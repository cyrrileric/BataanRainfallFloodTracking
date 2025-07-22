'use client';

import { useState, useEffect, useCallback } from 'react';
import { RainfallAlert } from '@/types';

interface UseWeatherDataReturn {
  alerts: RainfallAlert[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
  refreshData: () => void;
}

export function useWeatherData(): UseWeatherDataReturn {
  const [alerts, setAlerts] = useState<RainfallAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Fetch current alerts
  const fetchAlerts = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch('/api/alerts');
      const data = await response.json();
      
      if (data.success) {
        setAlerts(data.data);
        setLastUpdated(new Date(data.timestamp).toLocaleString());
      } else {
        setError(data.error || 'Failed to fetch alerts');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Manual refresh function
  const refreshData = useCallback(() => {
    setIsLoading(true);
    fetchAlerts();
  }, [fetchAlerts]);

  // Initial data fetch
  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  // Auto-refresh every 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAlerts();
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(interval);
  }, [fetchAlerts]);

  return {
    alerts,
    isLoading,
    error,
    lastUpdated,
    refreshData
  };
}
