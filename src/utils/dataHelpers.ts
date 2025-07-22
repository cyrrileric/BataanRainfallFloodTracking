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
    rivers: [] as string[],
    hazards: [] as string[] // Add hazards array for tropical cyclones
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
  
  // Handle tropical cyclone alerts
  if (alert.event === 'TROPICAL_CYCLONE' || (alert.type === 'CAP' && alert.subtype?.toLowerCase().includes('tropical cyclone'))) {
    // Extract hazards affecting Bataan from tropical cyclone alerts
    if (message.toLowerCase().includes('bataan')) {
      // Check for severe winds affecting Bataan - multiple patterns
      if (message.toLowerCase().includes('severe winds') || 
          message.toLowerCase().includes('strong to gale-force gusts') ||
          (message.toLowerCase().includes('winds') && message.toLowerCase().includes('bataan'))) {
        info.hazards.push('Severe Winds');
        info.warningLevel = 'ORANGE'; // Severe winds are typically orange level
      }
      
      // Check for heavy rainfall
      if (message.toLowerCase().includes('heavy rainfall') || 
          message.toLowerCase().includes('heavy rains')) {
        info.hazards.push('Heavy Rainfall');
      }
      
      // Check for rough seas affecting Bataan seaboards
      if (message.toLowerCase().includes('rough seas') && message.toLowerCase().includes('bataan')) {
        info.hazards.push('Rough Seas');
      }
      
      // Check for moderate seas affecting Bataan
      if (message.toLowerCase().includes('moderate seas') && 
          (message.toLowerCase().includes('southern seaboard of bataan') || 
           message.toLowerCase().includes('bataan'))) {
        info.hazards.push('Moderate Seas');
      }
      
      // Enhanced pattern matching for Bataan mentions in different sections
      // Check severe winds section
      const severeWindsSection = message.match(/severe winds[^]*?(?=hazards affecting coastal waters|track and intensity|$)/i);
      if (severeWindsSection && severeWindsSection[0].toLowerCase().includes('bataan')) {
        if (!info.hazards.includes('Severe Winds')) {
          info.hazards.push('Severe Winds');
          info.warningLevel = 'ORANGE';
        }
      }
      
      // Check coastal waters section for sea conditions
      const coastalWatersSection = message.match(/hazards affecting coastal waters[^]*?(?=track and intensity|$)/i);
      if (coastalWatersSection) {
        const coastalText = coastalWatersSection[0].toLowerCase();
        if (coastalText.includes('bataan')) {
          if (coastalText.includes('rough seas') && coastalText.includes('bataan')) {
            if (!info.hazards.includes('Rough Seas')) {
              info.hazards.push('Rough Seas');
            }
          }
          if (coastalText.includes('moderate seas') && coastalText.includes('bataan')) {
            if (!info.hazards.includes('Moderate Seas')) {
              info.hazards.push('Moderate Seas');
            }
          }
        }
      }
      
      // Set warning level if hazards were found but no level set
      if (info.hazards.length > 0 && !info.warningLevel) {
        info.warningLevel = 'ORANGE';
      }
      
      info.municipalities.push('Province-wide'); // Tropical cyclones affect the entire province
    }
  }
  
  // Handle thunderstorm alerts
  if (alert.event === 'THUNDERSTORM' || alert.type === 'THUNDERSTORM') {
    if (message.toLowerCase().includes('bataan') || 
        (alert.provinces && Object.values(alert.provinces).some(p => p.province?.toLowerCase().includes('bataan')))) {
      
      // Determine warning level based on subtype
      if (alert.subtype?.toLowerCase().includes('watch')) {
        info.warningLevel = 'ORANGE';
        info.hazards.push('Thunderstorm Watch');
      } else if (alert.subtype?.toLowerCase().includes('advisory')) {
        info.warningLevel = 'YELLOW';
        info.hazards.push('Thunderstorm Advisory');
      } else if (alert.subtype?.toLowerCase().includes('warning')) {
        info.warningLevel = 'RED';
        info.hazards.push('Thunderstorm Warning');
      }
      
      info.municipalities.push('Province-wide');
    }
  }
  
  // Handle flood alerts
  if (alert.event === 'FLOOD' || alert.subtype?.toLowerCase().includes('flood')) {
    // Check for Bataan-specific flood information
    const bataanFloodMatch = message.match(/\*\*Bataan\*\*\s*-\s*([^+\n]*)/i);
    if (bataanFloodMatch) {
      const description = bataanFloodMatch[1].trim();
      
      // Determine flood severity
      if (alert.subtype?.toLowerCase().includes('extreme')) {
        info.warningLevel = 'RED';
        info.hazards.push('Extreme Flood Advisory');
      } else if (alert.subtype?.toLowerCase().includes('severe')) {
        info.warningLevel = 'ORANGE';
        info.hazards.push('Severe Flood Advisory');
      } else {
        info.warningLevel = 'YELLOW';
        info.hazards.push('General Flood Advisory');
      }
      
      // Extract affected rivers/areas
      if (description.includes('particularly')) {
        const riverMatch = description.match(/particularly\s+(.+)/i);
        if (riverMatch) {
          const riverList = riverMatch[1].split(/\s+and\s+|\s*,\s*/).map((r: string) => r.trim());
          info.rivers = riverList;
          
          // Map rivers to municipalities if possible
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
        }
      }
      
      // If no specific municipalities found, it affects the whole province
      if (info.municipalities.length === 0) {
        info.municipalities.push('Province-wide');
      }
    }
  }
  
  // Handle regular rainfall warning levels
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
    
    // Handle tropical cyclone alerts - they typically affect the whole province
    if (alert.event === 'TROPICAL_CYCLONE' || 
        (alert.type === 'CAP' && alert.subtype?.toLowerCase().includes('tropical cyclone'))) {
      expandedAlerts.push({
        ...alert,
        municipalityName: 'Province-wide'
      });
    } 
    // Handle thunderstorm alerts - they typically affect the whole province or large areas
    else if (alert.event === 'THUNDERSTORM' || alert.type === 'THUNDERSTORM') {
      expandedAlerts.push({
        ...alert,
        municipalityName: 'Province-wide'
      });
    }
    // Handle flood alerts - check if we have specific municipalities or rivers
    else if (alert.event === 'FLOOD' || alert.subtype?.toLowerCase().includes('flood')) {
      if (bataanInfo.municipalities.length > 0) {
        // If we have specific municipalities, create entries for each
        bataanInfo.municipalities.forEach(municipality => {
          expandedAlerts.push({
            ...alert,
            municipalityName: municipality
          });
        });
      } else {
        // If no specific municipalities but we have rivers, show as general alert
        expandedAlerts.push({
          ...alert,
          municipalityName: bataanInfo.rivers.length > 0 ? 'River Systems' : 'Province-wide'
        });
      }
    }
    // Handle other alerts with municipality expansion
    else if (bataanInfo.municipalities.length > 0) {
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
