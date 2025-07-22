'use client';

import { useWeatherData } from '@/hooks/useWeatherData';
import AlertsList from '@/components/AlertsList';

export default function Home() {
  const {
    alerts,
    isLoading,
    error
  } = useWeatherData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-light text-gray-900 mb-3">
              Bataan Weather Alerts
            </h1>
            <p className="text-gray-600 text-lg font-light max-w-md mx-auto">
              Real-time weather monitoring for Bataan Province
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-8 flex items-center">
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span><strong>Error:</strong> {error}</span>
          </div>
        )}

        {/* Current Alerts */}
        <AlertsList alerts={alerts} isLoading={isLoading} />
      </main>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-200 mt-16">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center space-y-2">
            <p className="text-gray-600 text-sm">
              Data from <a href="https://panahon.gov.ph" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 transition-colors underline-offset-2 hover:underline">PAGASA</a> • Updates every 10 minutes
            </p>
            <p className="text-gray-500 text-xs">
              Built by <a href="https://praryo.lol" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900 transition-colors underline-offset-2 hover:underline">Praryo</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
