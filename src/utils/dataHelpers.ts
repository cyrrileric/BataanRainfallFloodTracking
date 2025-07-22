import { RainfallAlert } from '@/types';

export const API_URL = 'https://panahon.gov.ph/api/v1/cap-alerts';

export function deduplicateAlerts(alerts: RainfallAlert[]): RainfallAlert[] {
  const seen = new Set<string>();
  const uniqueAlerts: RainfallAlert[] = [];
  
  alerts.forEach(alert => {
    if (!seen.has(alert.identifier)) {
      seen.add(alert.identifier);
      uniqueAlerts.push(alert);
    }
  });
  
  return uniqueAlerts;
}

export function filterBataanAlerts(alerts: RainfallAlert[]): RainfallAlert[] {
  const bataanAlerts: RainfallAlert[] = [];
  
  alerts.forEach(alert => {
    let isBataanAlert = false;
    
    if (alert.provinces && typeof alert.provinces === 'object') {
      Object.values(alert.provinces).forEach(province => {
        if (province.province?.toLowerCase().includes('bataan')) {
          isBataanAlert = true;
        }
      });
    }
    
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
  
  const message = alert.message || alert.generated_message || '';
  
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
  
  const bataanMatch = message.match(/\*\*Bataan\*\*\s*-\s*([^+\n]+)/i);
  if (bataanMatch) {
    const description = bataanMatch[1];
    if (description.includes('particularly')) {
      const riverMatch = description.match(/particularly\s+(.+)/i);
      if (riverMatch) {
        const riverList = riverMatch[1].split(/\s+and\s+|\s*,\s*/).map((r: string) => r.trim());
        info.rivers = riverList;
        
        const bataanMunicipalities = [
          'Balanga', 'Morong', 'Bagac', 'Mariveles', 'Abucay', 'Samal', 
          'Orani', 'Hermosa', 'Dinalupihan', 'Limay', 'Orion', 'Pilar'
        ];
        
        riverList.forEach(river => {
          const municipalityMatch = bataanMunicipalities.find(municipality => 
            river.toLowerCase().includes(municipality.toLowerCase()) || 
            municipality.toLowerCase().includes(river.toLowerCase())
          );
          
          if (municipalityMatch && !info.municipalities.includes(municipalityMatch)) {
            info.municipalities.push(municipalityMatch);
          }
        });
        
        if (info.municipalities.length === 0) {
          riverList.forEach(river => {
            const cleanRiver = river.charAt(0).toUpperCase() + river.slice(1).toLowerCase();
            if (!info.municipalities.includes(cleanRiver)) {
              info.municipalities.push(cleanRiver);
            }
          });
        }
      }
    }
  }
  
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

export function expandAlertsByMunicipalities(alerts: RainfallAlert[]): Array<RainfallAlert & { municipalityName?: string }> {
  const expandedAlerts: Array<RainfallAlert & { municipalityName?: string }> = [];
  
  alerts.forEach(alert => {
    const bataanInfo = extractBataanInfo(alert);
    
    if (bataanInfo.municipalities.length > 0) {
      bataanInfo.municipalities.forEach(municipality => {
        expandedAlerts.push({
          ...alert,
          municipalityName: municipality
        });
      });
    } else {
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
