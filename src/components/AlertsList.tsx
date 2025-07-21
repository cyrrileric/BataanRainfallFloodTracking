'use client';

import { RainfallAlert } from '@/types';
import { getAlertColor, extractBataanInfo } from '@/utils/dataHelpers';

interface AlertsListProps {
  alerts: RainfallAlert[];
  isLoading?: boolean;
}

export default function AlertsList({ alerts, isLoading = false }: AlertsListProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Current Alerts</h2>
        <div className="space-y-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="border rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Current Alerts</h2>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🌤️</div>
          <p className="text-gray-500 text-lg">No active alerts for Bataan</p>
          <p className="text-gray-400 text-sm mt-2">All clear! No rainfall warnings at this time.</p>
        </div>
      </div>
    );
  }

  // Group alerts by type and extract province information
  const groupedAlerts = alerts.reduce((groups, alert) => {
    // Extract Bataan-specific info to determine warning level
    const bataanInfo = extractBataanInfo(alert);
    let category = 'other';
    
    // Use warning level from message if available
    if (bataanInfo.warningLevel) {
      category = bataanInfo.warningLevel.toLowerCase();
    } else {
      // Fallback to alert type categorization
      const type = alert.type?.toLowerCase() || alert.subtype?.toLowerCase() || 'unknown';
      
      if (type.includes('red') || type.includes('warning')) {
        category = 'red';
      } else if (type.includes('orange') || type.includes('watch')) {
        category = 'orange';
      } else if (type.includes('yellow') || type.includes('advisory')) {
        category = 'yellow';
      } else if (type.includes('expecting') || type.includes('forecast')) {
        category = 'expecting';
      } else if (type.includes('thunderstorm')) {
        category = 'yellow'; // Treat thunderstorm advisories as yellow
      } else if (type.includes('flood')) {
        // Determine flood severity from subtype
        if (alert.subtype?.toLowerCase().includes('extreme')) {
          category = 'red';
        } else if (alert.subtype?.toLowerCase().includes('severe')) {
          category = 'orange';
        } else {
          category = 'yellow';
        }
      }
    }
    
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(alert);
    return groups;
  }, {} as Record<string, RainfallAlert[]>);

  // Sort alert types by severity
  const alertTypePriority = { red: 1, orange: 2, yellow: 3, expecting: 4 };
  const sortedTypes = Object.keys(groupedAlerts).sort((a, b) => {
    const priorityA = alertTypePriority[a as keyof typeof alertTypePriority] || 5;
    const priorityB = alertTypePriority[b as keyof typeof alertTypePriority] || 5;
    return priorityA - priorityB;
  });

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">
        Current Alerts ({alerts.length})
      </h2>
      
      <div className="space-y-4">
        {sortedTypes.map(type => (
          <div key={type} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 
                className="text-lg font-semibold capitalize"
                style={{ color: getAlertColor(type) }}
              >
                {type} Alerts ({groupedAlerts[type].length})
              </h3>
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: getAlertColor(type) }}
              ></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {groupedAlerts[type].map((alert, index) => {
                // Extract Bataan-specific information
                const bataanInfo = extractBataanInfo(alert);
                
                return (
                  <div 
                    key={`${alert.identifier}-${alert.municipalityName || index}`}
                    className="border rounded p-3 hover:shadow-sm transition-shadow"
                    style={{ borderLeftColor: getAlertColor(type), borderLeftWidth: '4px' }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900">
                        {alert.municipalityName || bataanInfo.province}
                      </p>
                      {bataanInfo.warningLevel && (
                        <span 
                          className="px-2 py-1 text-xs font-semibold rounded"
                          style={{ 
                            backgroundColor: getAlertColor(bataanInfo.warningLevel.toLowerCase()),
                            color: 'white'
                          }}
                        >
                          {bataanInfo.warningLevel}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-1">
                      {alert.event || alert.type} - {alert.subtype}
                    </p>
                    
                    {alert.municipalityName && alert.municipalityName !== 'General Alert' && (
                      <p className="text-xs text-blue-600 font-medium mb-1">
                        📍 {alert.municipalityName}
                      </p>
                    )}
                    
                    {bataanInfo.rivers.length > 0 && (
                      <div className="mb-2">
                        <p className="text-xs text-gray-500 font-medium">Affected Rivers:</p>
                        <p className="text-xs text-gray-600">
                          {bataanInfo.rivers.join(', ')}
                        </p>
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                      {alert.headline}
                    </p>
                    
                    <p className="text-xs text-gray-400 mt-1">
                      Issued: {new Date(alert.issued_date).toLocaleString()}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
