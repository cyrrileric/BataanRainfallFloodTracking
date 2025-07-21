'use client';

import { useWeatherData } from '@/hooks/useWeatherData';
// import DashboardStatsComponent from '@/components/DashboardStats';
import AlertsList from '@/components/AlertsList';

export default function Home() {
  const {
    alerts,
    stats,
    isLoading,
    error,
    lastUpdated,
    refreshData
  } = useWeatherData();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🌧️ Bataan Weather Alerts
              </h1>
              <p className="text-gray-600 mt-1">
                Real-time rainfall warnings for Bataan Province
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-col items-end">
              <div className="flex items-center space-x-4">
                <button
                  onClick={refreshData}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {isLoading ? '⏳ Loading...' : '🔄 Refresh'}
                </button>
              </div>
              
              {lastUpdated && (
                <div className="text-sm text-gray-500 mt-2">
                  Last updated: {lastUpdated}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Dashboard Stats */}
        {/* <DashboardStatsComponent stats={stats} isLoading={isLoading} /> */}

        {/* Current Alerts */}
        <AlertsList alerts={alerts} isLoading={isLoading} />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-600">
            <p>Data source: <a href="https://panahon.gov.ph" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">PAGASA</a></p>
            <p className="text-sm mt-1">Updates automatically every 10 minutes</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
