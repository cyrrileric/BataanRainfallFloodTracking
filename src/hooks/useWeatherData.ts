'use client';

import { useState, useEffect, useCallback } from 'react';
import { RainfallAlert, DashboardStats } from '@/types';
import { extractBataanInfo } from '@/utils/dataHelpers';

interface UseWeatherDataReturn {
  alerts: RainfallAlert[];
  stats: DashboardStats;
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

  // Calculate dashboard stats from current alerts
  const stats: DashboardStats = {
    currentAlerts: alerts.length,
    redAlerts: alerts.filter(alert => {
      const bataanInfo = extractBataanInfo(alert);
      if (bataanInfo.warningLevel === 'RED') return true;
      
      const type = alert.type?.toLowerCase() || alert.subtype?.toLowerCase() || '';
      return type.includes('red') || type.includes('warning') || 
             (type.includes('flood') && alert.subtype?.toLowerCase().includes('extreme'));
    }).length,
    orangeAlerts: alerts.filter(alert => {
      const bataanInfo = extractBataanInfo(alert);
      if (bataanInfo.warningLevel === 'ORANGE') return true;
      
      const type = alert.type?.toLowerCase() || alert.subtype?.toLowerCase() || '';
      return type.includes('orange') || type.includes('watch') ||
             (type.includes('flood') && alert.subtype?.toLowerCase().includes('severe'));
    }).length,
    yellowAlerts: alerts.filter(alert => {
      const bataanInfo = extractBataanInfo(alert);
      if (bataanInfo.warningLevel === 'YELLOW') return true;
      
      const type = alert.type?.toLowerCase() || alert.subtype?.toLowerCase() || '';
      return type.includes('yellow') || type.includes('advisory') || type.includes('thunderstorm') ||
             type.includes('flood');
    }).length,
    expectingAlerts: alerts.filter(alert => {
      const type = alert.type?.toLowerCase() || alert.subtype?.toLowerCase() || '';
      return type.includes('expecting') || type.includes('forecast');
    }).length,
    lastUpdated: lastUpdated || 'Never'
  };

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
    stats,
    isLoading,
    error,
    lastUpdated,
    refreshData
  };
}
