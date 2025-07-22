import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { RainfallAlert } from '@/types';
import { API_URL, filterBataanAlerts, expandAlertsByMunicipalities, deduplicateAlerts } from '@/utils/dataHelpers';

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching data from Panahon API...');
    
    // Fetch data from the Panahon API
    const response = await axios.get(API_URL, {
      timeout: 30000, // 30 second timeout
      headers: {
        'User-Agent': 'BataanWeather-App/1.0',
        'Accept': 'application/json',
      }
    });

    console.log(`API response status: ${response.status}`);

    // Check if the response has the expected structure
    if (!response.data || !response.data.success || !response.data.data || !Array.isArray(response.data.data.alert_data)) {
      throw new Error(`Invalid API response structure: ${JSON.stringify(response.data)}`);
    }
    
    const allAlerts: RainfallAlert[] = response.data.data.alert_data;
    console.log(`Fetched ${allAlerts.length} total alerts`);
    
    // Remove duplicates based on identifier
    const uniqueAlerts = deduplicateAlerts(allAlerts);
    console.log(`Removed ${allAlerts.length - uniqueAlerts.length} duplicate alerts`);
    
    // Filter for Bataan province only
    const bataanAlerts = filterBataanAlerts(uniqueAlerts);
    console.log(`Found ${bataanAlerts.length} alerts for Bataan`);
    
    // Expand alerts by municipalities
    const expandedAlerts = expandAlertsByMunicipalities(bataanAlerts);
    console.log(`Expanded to ${expandedAlerts.length} municipal alerts`);
    
    // Return the data
    return NextResponse.json({
      success: true,
      data: expandedAlerts,
      timestamp: new Date().toISOString(),
      totalAlerts: expandedAlerts.length
    });
    
  } catch (error) {
    console.error('Error fetching alerts:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        data: [],
        timestamp: new Date().toISOString(),
        totalAlerts: 0
      },
      { status: 500 }
    );
  }
}
