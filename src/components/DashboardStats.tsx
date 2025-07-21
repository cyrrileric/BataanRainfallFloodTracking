'use client';

import { DashboardStats } from '@/types';
import { getAlertColor } from '@/utils/dataHelpers';

interface DashboardStatsProps {
  stats: DashboardStats;
  isLoading?: boolean;
}

export default function DashboardStatsComponent({ stats, isLoading = false }: DashboardStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Alerts',
      value: stats.currentAlerts,
      color: '#6b7280',
      icon: '📊',
    },
    {
      title: 'Red Alerts',
      value: stats.redAlerts,
      color: getAlertColor('red'),
      icon: '🔴',
    },
    {
      title: 'Orange Alerts',
      value: stats.orangeAlerts || 0,
      color: getAlertColor('orange'),
      icon: '🟠',
    },
    {
      title: 'Yellow Alerts',
      value: stats.yellowAlerts,
      color: getAlertColor('yellow'),
      icon: '🟡',
    },
    {
      title: 'Expecting',
      value: stats.expectingAlerts,
      color: getAlertColor('expecting'),
      icon: '🔵',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {statCards.map((card, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p 
                className="text-2xl font-bold"
                style={{ color: card.color }}
              >
                {card.value}
              </p>
            </div>
            <div className="text-2xl">{card.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
