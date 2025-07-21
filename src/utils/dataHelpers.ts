import { RainfallAlert } from '@/types';

export const API_URL = 'https://panahon.gov.ph/api/v1/cap-alerts';

// Filter alerts for Bataan province only and expand by municipalities
export function filterBataanAlerts(alerts: RainfallAlert[]): RainfallAlert[] {
  const bataanAlerts: RainfallAlert[] = [];
  
  alerts.forEach(alert => {
    let isBataanAlert = false;
    
    // Check if any of the provinces in the alert include Bataan
    if (alert.provinces && typeof alert.provinces === 'object') {
      Object.values(alert.provinces).forEach(province => {
        if (province.province?.toLowerCase().includes('bataan')) {
          isBataanAlert = true;
        }
      });
    }
    
    // Check if alert message mentions Bataan
    if (alert.message?.toLowerCase().includes('bataan') || 
        alert.generated_message?.toLowerCase().includes('bataan')) {
      isBataanAlert = true;
    }
    
    if (isBataanAlert) {
      bataanAlerts.push(alert);
    }
  });
  
  return bataanAlerts;
}

// Extract Bataan-specific information from an alert
export function extractBataanInfo(alert: RainfallAlert) {
  const info = {
    province: 'Bataan',
    municipalities: [] as string[],
    warningLevel: '',
    rivers: [] as string[]
  };
  
  // Check provinces structure
  if (alert.provinces && typeof alert.provinces === 'object') {
    Object.values(alert.provinces).forEach(province => {
      if (province.province?.toLowerCase().includes('bataan')) {
        info.province = province.province;
        if (province.municipality) {
          info.municipalities.push(province.municipality);
        }
      }
    });
  }
  
  // Parse message for warning levels and municipalities
  const message = alert.message || alert.generated_message || '';
  
  // Extract warning level for Bataan
  const redMatch = message.match(/RED WARNING LEVEL:([^.]+)/i);
  if (redMatch && redMatch[1].toLowerCase().includes('bataan')) {
    info.warningLevel = 'RED';
  }
  
  const orangeMatch = message.match(/ORANGE WARNING LEVEL:([^.]+)/i);
  if (orangeMatch && orangeMatch[1].toLowerCase().includes('bataan')) {
    info.warningLevel = 'ORANGE';
  }
  
  const yellowMatch = message.match(/YELLOW WARNING LEVEL:([^.]+)/i);
  if (yellowMatch && yellowMatch[1].toLowerCase().includes('bataan')) {
    info.warningLevel = 'YELLOW';
  }
  
  // Extract rivers/municipalities mentioned for Bataan in flood advisories
  const bataanMatch = message.match(/\*\*Bataan\*\*\s*-\s*([^+\n]+)/i);
  if (bataanMatch) {
    const description = bataanMatch[1];
    if (description.includes('particularly')) {
      const riverMatch = description.match(/particularly\s+(.+)/i);
      if (riverMatch) {
        const riverList = riverMatch[1].split(/\s+and\s+|\s*,\s*/).map((r: string) => r.trim());
        info.rivers = riverList;
        
        // For flood advisories, rivers often correspond to municipalities in Bataan
        // Common Bataan municipalities that match river names or are commonly mentioned
        const bataanMunicipalities = [
          'Balanga', 'Morong', 'Bagac', 'Mariveles', 'Abucay', 'Samal', 
          'Orani', 'Hermosa', 'Dinalupihan', 'Limay', 'Orion', 'Pilar'
        ];
        
        riverList.forEach(river => {
          // Check if river name matches a municipality
          const municipalityMatch = bataanMunicipalities.find(municipality => 
            river.toLowerCase().includes(municipality.toLowerCase()) || 
            municipality.toLowerCase().includes(river.toLowerCase())
          );
          
          if (municipalityMatch && !info.municipalities.includes(municipalityMatch)) {
            info.municipalities.push(municipalityMatch);
          }
        });
        
        // If no direct matches, treat river names as potential municipality indicators
        if (info.municipalities.length === 0) {
          riverList.forEach(river => {
            // Capitalize first letter for display
            const cleanRiver = river.charAt(0).toUpperCase() + river.slice(1).toLowerCase();
            if (!info.municipalities.includes(cleanRiver)) {
              info.municipalities.push(cleanRiver);
            }
          });
        }
      }
    }
  }
  
  // Also check for municipalities mentioned directly in Bataan context
  if (message.toLowerCase().includes('bataan')) {
    const bataanMunicipalities = [
      'Balanga', 'Morong', 'Bagac', 'Mariveles', 'Abucay', 'Samal', 
      'Orani', 'Hermosa', 'Dinalupihan', 'Limay', 'Orion', 'Pilar'
    ];
    
    bataanMunicipalities.forEach(municipality => {
      if (message.toLowerCase().includes(municipality.toLowerCase()) && 
          !info.municipalities.includes(municipality)) {
        info.municipalities.push(municipality);
      }
    });
  }
  
  return info;
}

// Create separate alert entries for each municipality mentioned in Bataan alerts
export function expandAlertsByMunicipalities(alerts: RainfallAlert[]): Array<RainfallAlert & { municipalityName?: string }> {
  const expandedAlerts: Array<RainfallAlert & { municipalityName?: string }> = [];
  
  alerts.forEach(alert => {
    const bataanInfo = extractBataanInfo(alert);
    
    // If we have specific municipalities, create separate entries for each
    if (bataanInfo.municipalities.length > 0) {
      bataanInfo.municipalities.forEach(municipality => {
        expandedAlerts.push({
          ...alert,
          municipalityName: municipality
        });
      });
    } else {
      // If no specific municipalities, add the general alert
      expandedAlerts.push({
        ...alert,
        municipalityName: 'General Alert'
      });
    }
  });
  
  return expandedAlerts;
}

// Get color for alert type
export function getAlertColor(type: string): string {
  switch (type.toLowerCase()) {
    case 'red':
      return '#dc2626'; // red-600
    case 'orange':
      return '#ea580c'; // orange-600
    case 'yellow':
      return '#ca8a04'; // yellow-600
    case 'expecting':
      return '#2563eb'; // blue-600
    default:
      return '#6b7280'; // gray-500
  }
}
