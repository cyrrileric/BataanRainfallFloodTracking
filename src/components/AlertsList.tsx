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
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50 p-8">
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-2 bg-gray-100 rounded-xl animate-pulse">
            <div className="w-6 h-6 bg-gray-300 rounded"></div>
          </div>
          <div>
            <div className="h-6 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-100 rounded w-32 animate-pulse"></div>
          </div>
        </div>
        
        <div className="space-y-8">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gray-100 rounded-xl animate-pulse">
                  <div className="w-5 h-5 bg-gray-200 rounded"></div>
                </div>
                <div>
                  <div className="h-5 bg-gray-200 rounded w-36 mb-2 animate-pulse"></div>
                  <div className="h-3 bg-gray-100 rounded w-20 animate-pulse"></div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {[...Array(3)].map((_, cardIndex) => (
                  <div key={cardIndex} className="bg-white rounded-xl border border-gray-100 p-4">
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                      <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse"></div>
                      <div className="flex gap-2">
                        <div className="h-6 bg-gray-100 rounded-full w-16 animate-pulse"></div>
                        <div className="h-6 bg-gray-100 rounded-full w-20 animate-pulse"></div>
                      </div>
                      <div className="h-3 bg-gray-100 rounded w-full animate-pulse"></div>
                      <div className="h-2 bg-gray-50 rounded w-2/3 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50 p-8">
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-2 bg-green-50 rounded-xl">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-light text-gray-900">Weather Status</h2>
            <p className="text-sm text-gray-600 font-light">Bataan Province • All Clear</p>
          </div>
        </div>
        
        <div className="text-center py-16">
          <div className="mb-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-50 to-blue-50 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          
          <h3 className="text-xl font-light text-gray-900 mb-3">No Active Weather Alerts</h3>
          <p className="text-gray-600 font-light mb-6 max-w-md mx-auto leading-relaxed">
            Current weather conditions in Bataan are stable with no active warnings or advisories.
          </p>
          
          <div className="inline-flex items-center px-4 py-2 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            All systems normal
          </div>
        </div>
      </div>
    );
  }

  // Group alerts by event type instead of severity level
  const groupedAlerts = alerts.reduce((groups, alert) => {
    // Extract Bataan-specific info for color coding
    const bataanInfo = extractBataanInfo(alert);
    
    // Determine the event category for grouping
    let eventCategory = 'Other';
    const event = alert.event?.toLowerCase() || '';
    const type = alert.type?.toLowerCase() || '';
    const subtype = alert.subtype?.toLowerCase() || '';
    
    // Group by main event types
    if (event.includes('rainfall') || type.includes('rainfall')) {
      eventCategory = 'Rainfall Warnings';
    } else if (event.includes('thunderstorm') || type.includes('thunderstorm')) {
      eventCategory = 'Thunderstorm Alerts';
    } else if (event.includes('tropical_cyclone') || 
               (type.includes('cap') && subtype.includes('tropical cyclone'))) {
      eventCategory = 'Tropical Cyclone';
    } else if (event.includes('flood') || subtype.includes('flood')) {
      eventCategory = 'Flood Advisories';
    } else if (subtype.includes('advisory')) {
      eventCategory = 'Weather Advisories';
    } else if (subtype.includes('warning')) {
      eventCategory = 'Weather Warnings';
    } else if (subtype.includes('watch')) {
      eventCategory = 'Weather Watch';
    }
    
    if (!groups[eventCategory]) {
      groups[eventCategory] = [];
    }
    groups[eventCategory].push(alert);
    return groups;
  }, {} as Record<string, RainfallAlert[]>);

  // Sort alert types by priority (most critical first)
  const eventTypePriority: Record<string, number> = { 
    'Tropical Cyclone': 1, 
    'Rainfall Warnings': 2, 
    'Flood Advisories': 3,
    'Thunderstorm Alerts': 4, 
    'Weather Warnings': 5,
    'Weather Watch': 6,
    'Weather Advisories': 7,
    'Other': 8
  };
  const sortedTypes = Object.keys(groupedAlerts).sort((a, b) => {
    const priorityA = eventTypePriority[a] || 9;
    const priorityB = eventTypePriority[b] || 9;
    return priorityA - priorityB;
  });

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50 p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-red-50 rounded-xl">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-light text-gray-900">Active Weather Alerts</h2>
            <p className="text-sm text-gray-600 font-light">Bataan Province • {alerts.length} active alert{alerts.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200">
            Live
          </div>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      <div className="space-y-6">
        {sortedTypes.map(eventType => (
          <div key={eventType} className="bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {/* Event type icon */}
                    {eventType === 'Tropical Cyclone' && (
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                    )}
                    {eventType === 'Rainfall Warnings' && (
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 5.359 3.13 9.989 7.676 12.25a11.952 11.952 0 008.648 0C20.87 21.989 24 17.359 24 12M8.25 9.75h4.875a2.625 2.625 0 010 5.25H9.375A1.125 1.125 0 018.25 16.5V9.75z" />
                        </svg>
                      </div>
                    )}
                    {eventType === 'Flood Advisories' && (
                      <div className="p-2 bg-cyan-100 rounded-lg">
                        <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      </div>
                    )}
                    {eventType === 'Thunderstorm Alerts' && (
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                    )}
                    {!['Tropical Cyclone', 'Rainfall Warnings', 'Flood Advisories', 'Thunderstorm Alerts'].includes(eventType) && (
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 18.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{eventType}</h3>
                      <p className="text-sm text-gray-500">{groupedAlerts[eventType].length} alert{groupedAlerts[eventType].length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {/* Severity indicators with improved styling */}
                  {Array.from(new Set(groupedAlerts[eventType].map(alert => {
                  const bataanInfo = extractBataanInfo(alert);
                  
                  // Determine severity color for this specific alert
                  if (bataanInfo.warningLevel) {
                    return bataanInfo.warningLevel.toLowerCase();
                  }
                  
                  // Fallback color determination
                  const type = alert.type?.toLowerCase() || alert.subtype?.toLowerCase() || '';
                  const event = alert.event?.toLowerCase() || '';
                  
                  if (event.includes('tropical_cyclone') || 
                      (type.includes('cap') && alert.subtype?.toLowerCase().includes('tropical cyclone'))) {
                    return 'orange';
                  } else if (event.includes('thunderstorm') || type.includes('thunderstorm')) {
                    if (alert.subtype?.toLowerCase().includes('watch')) return 'orange';
                    else if (alert.subtype?.toLowerCase().includes('warning')) return 'red';
                    else return 'yellow';
                  } else if (event.includes('flood') || alert.subtype?.toLowerCase().includes('flood')) {
                    if (alert.subtype?.toLowerCase().includes('extreme')) return 'red';
                    else if (alert.subtype?.toLowerCase().includes('severe')) return 'orange';
                    else return 'yellow';
                  } else if (type.includes('warning')) {
                    return 'red';
                  } else if (type.includes('watch')) {
                    return 'orange';
                  } else if (type.includes('advisory')) {
                    return 'yellow';
                  }
                  
                  return 'gray';
                }))).map((color, idx) => (
                    <div 
                      key={color}
                      className="relative group"
                    >
                      <div 
                        className="w-4 h-4 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200"
                        style={{ backgroundColor: getAlertColor(color) }}
                      ></div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {color.charAt(0).toUpperCase() + color.slice(1)} Level
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-5">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {groupedAlerts[eventType].map((alert, index) => {
                  // Extract Bataan-specific information
                  const bataanInfo = extractBataanInfo(alert);
                  
                  // Determine this alert's color
                  let alertColor = 'gray';
                  if (bataanInfo.warningLevel) {
                    alertColor = bataanInfo.warningLevel.toLowerCase();
                  } else {
                    const type = alert.type?.toLowerCase() || alert.subtype?.toLowerCase() || '';
                    const event = alert.event?.toLowerCase() || '';
                    
                    if (event.includes('tropical_cyclone') || 
                        (type.includes('cap') && alert.subtype?.toLowerCase().includes('tropical cyclone'))) {
                      alertColor = 'orange';
                    } else if (event.includes('thunderstorm') || type.includes('thunderstorm')) {
                      if (alert.subtype?.toLowerCase().includes('watch')) alertColor = 'orange';
                      else if (alert.subtype?.toLowerCase().includes('warning')) alertColor = 'red';
                      else alertColor = 'yellow';
                    } else if (event.includes('flood') || alert.subtype?.toLowerCase().includes('flood')) {
                      if (alert.subtype?.toLowerCase().includes('extreme')) alertColor = 'red';
                      else if (alert.subtype?.toLowerCase().includes('severe')) alertColor = 'orange';
                      else alertColor = 'yellow';
                    } else if (type.includes('warning')) {
                      alertColor = 'red';
                    } else if (type.includes('watch')) {
                      alertColor = 'orange';
                    } else if (type.includes('advisory')) {
                      alertColor = 'yellow';
                    }
                  }
                  
                  return (
                    <div 
                      key={`${alert.identifier}-${alert.municipalityName || index}`}
                      className="relative bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 overflow-hidden group"
                    >
                      {/* Color accent bar */}
                      <div 
                        className="absolute top-0 left-0 w-full h-1"
                        style={{ backgroundColor: getAlertColor(alertColor) }}
                      ></div>
                      
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-semibold text-gray-900 text-sm">
                                {alert.municipalityName || bataanInfo.province}
                              </h4>
                              {alert.municipalityName && alert.municipalityName !== 'General Alert' && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  {alert.municipalityName}
                                </span>
                              )}
                            </div>
                            
                            <p className="text-xs text-gray-600 mb-2">
                              <span className="font-medium">{alert.event || alert.type}</span>
                              {alert.subtype && <span> • {alert.subtype}</span>}
                            </p>
                            
                            {/* Weather System for Rainfall Warnings */}
                            {alert.weather_systems && (
                              <div className="mb-2">
                                <p className="text-xs font-medium text-gray-500 mb-1 flex items-center">
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                                  </svg>
                                  Weather System
                                </p>
                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200 rounded-md">
                                  {alert.weather_systems}
                                </span>
                              </div>
                            )}
                            
                            {/* Expecting Intensity for Rainfall */}
                            {alert.expecting_intensity && (
                              <div className="mb-2">
                                <p className="text-xs font-medium text-gray-500 mb-1 flex items-center">
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                  </svg>
                                  Rainfall Intensity
                                </p>
                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md">
                                  {alert.expecting_intensity}
                                </span>
                              </div>
                            )}
                            
                            {/* Published By for more official context */}
                            {alert.published_by && (
                              <div className="mb-2">
                                <p className="text-xs font-medium text-gray-500 mb-1 flex items-center">
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-6m-4 0H3m2 0h6M7 3h10M7 7h3m0 0h3m-3 0v8m-3-4h6" />
                                  </svg>
                                  Issued by
                                </p>
                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-50 text-green-700 border border-green-200 rounded-md">
                                  {alert.published_by}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {bataanInfo.warningLevel && (
                            <span 
                              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-sm"
                              style={{ 
                                backgroundColor: getAlertColor(bataanInfo.warningLevel.toLowerCase())
                              }}
                            >
                              {bataanInfo.warningLevel}
                            </span>
                          )}
                        </div>
                        
                        {/* Hazards section with improved styling */}
                        {bataanInfo.hazards && bataanInfo.hazards.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs font-medium text-gray-500 mb-2 flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 18.5c-.77.833.192 2.5 1.732 2.5z" />
                              </svg>
                              Hazards
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {bataanInfo.hazards.map((hazard, idx) => {
                                // Determine hazard color based on type
                                let hazardColor = 'bg-orange-50 text-orange-700 border-orange-200';
                                if (hazard.toLowerCase().includes('extreme') || hazard.toLowerCase().includes('warning')) {
                                  hazardColor = 'bg-red-50 text-red-700 border-red-200';
                                } else if (hazard.toLowerCase().includes('watch') || hazard.toLowerCase().includes('severe') || hazard.toLowerCase().includes('threatening')) {
                                  hazardColor = 'bg-orange-50 text-orange-700 border-orange-200';
                                } else if (hazard.toLowerCase().includes('advisory') || hazard.toLowerCase().includes('general') || hazard.toLowerCase().includes('possible')) {
                                  hazardColor = 'bg-yellow-50 text-yellow-700 border-yellow-200';
                                } else if (hazard.toLowerCase().includes('winds')) {
                                  hazardColor = 'bg-purple-50 text-purple-700 border-purple-200';
                                } else if (hazard.toLowerCase().includes('seas')) {
                                  hazardColor = 'bg-blue-50 text-blue-700 border-blue-200';
                                } else if (hazard.toLowerCase().includes('flooding')) {
                                  hazardColor = 'bg-cyan-50 text-cyan-700 border-cyan-200';
                                } else if (hazard.toLowerCase().includes('landslides')) {
                                  hazardColor = 'bg-amber-50 text-amber-700 border-amber-200';
                                }
                                
                                return (
                                  <span 
                                    key={idx}
                                    className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md border ${hazardColor}`}
                                  >
                                    {hazard}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}
                        
                        {/* Rivers section with improved styling */}
                        {bataanInfo.rivers.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs font-medium text-gray-500 mb-2 flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                              </svg>
                              Affected Rivers
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {bataanInfo.rivers.map((river, idx) => (
                                <span 
                                  key={idx}
                                  className="inline-flex items-center px-2 py-1 text-xs font-medium bg-cyan-50 text-cyan-700 border border-cyan-200 rounded-md"
                                >
                                  {river}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Alert details */}
                        {alert.headline && (
                          <div className="mb-3">
                            <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                              {alert.headline}
                            </p>
                          </div>
                        )}
                        
                        {/* Footer with timestamp and better styling */}
                        <div className="pt-3 border-t border-gray-100">
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex flex-col space-y-1">
                              <span className="flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Issued {new Date(alert.issued_date).toLocaleDateString()} at {new Date(alert.issued_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              {alert.valid_date && (
                                <span className="flex items-center text-amber-600">
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 18.5c-.77.833.192 2.5 1.732 2.5z" />
                                  </svg>
                                  Valid until {new Date(alert.valid_date).toLocaleDateString()} at {new Date(alert.valid_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              )}
                            </div>
                            <div 
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: getAlertColor(alertColor) }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
