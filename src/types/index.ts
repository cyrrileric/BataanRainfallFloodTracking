export interface RainfallAlert {
  event: string;
  type: string;
  subtype: string;
  identifier: string;
  headline: string;
  message: string;
  optional_message: string;
  issued_date: string;
  valid_date: string;
  published_by: string;
  generated_message?: string;
  expecting_intensity?: string;
  weather_systems?: string;
  polygon_color?: string;
  municipalityName?: string;
  provinces: {
    [key: string]: {
      province: string;
      shape?: string;
      municipality?: string;
      psgc_code?: string;
      type?: string;
      areaDesc?: string;
    };
  };
}

export interface PanahonApiResponse {
  success: boolean;
  data: {
    alert_count: number;
    alert_data: RainfallAlert[];
  };
}

export interface ApiResponse {
  data: RainfallAlert[];
  timestamp: string;
  success: boolean;
}

export interface DashboardStats {
  currentAlerts: number;
  redAlerts: number;
  orangeAlerts: number;
  yellowAlerts: number;
  expectingAlerts: number;
  lastUpdated: string;
}
