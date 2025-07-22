# 🌧️ Bataan Weather Alerts Dashboard

A simple, real-time rainfall warning dashboard for Bataan Province, Philippines. Fetches data from the PAGASA API every 10 minutes and displays only alerts relevant to Bataan.

## ✨ Features

- **Real-time Data**: Auto-fetches alerts every 10 minutes from PAGASA API
- **Bataan-Specific**: Shows only alerts for Bataan Province
- **Municipality Details**: Expands alerts by municipality when available
- **Alert Categories**: Groups alerts by warning levels (Red, Orange, Yellow, Expecting)
- **Responsive Design**: Mobile-friendly with Tailwind CSS
- **Manual Refresh**: Click to refresh data anytime
- **Duplicate Prevention**: Filters out duplicate alerts from API

## 🎯 Alert Types

- **🔴 Red**: Critical rainfall warnings
- **🟠 Orange**: High rainfall warnings  
- **🟡 Yellow**: Moderate rainfall warnings / Thunderstorm advisories
- **🔵 Expecting**: Expected rainfall conditions

## 🛠️ Tech Stack

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Axios** for API calls

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── alerts/route.ts      # Fetch current alerts from PAGASA
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                 # Main dashboard
├── components/
│   └── AlertsList.tsx           # Alert list display
├── hooks/
│   └── useWeatherData.ts        # Data fetching and state management
├── types/
│   └── index.ts                 # TypeScript interfaces
└── utils/
    └── dataHelpers.ts           # Filtering and utility functions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/cyrrileric/BataanRainfallFloodTracking.git
cd BataanWeather/site
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
npm run build
npm start
```

## 📊 Data Source

Fetches data from [PAGASA API](https://panahon.gov.ph/api/v1/cap-alerts):
- **Endpoint**: `https://panahon.gov.ph/api/v1/cap-alerts`
- **Updates**: Every 10 minutes automatically
- **Content**: Province, municipality, alert type, and coordinates

## 🔧 API Endpoints

### `/api/alerts`
- **Method**: GET  
- **Returns**: Current Bataan alerts with metadata
- **Features**: Deduplication, filtering, municipality expansion

## ⚙️ Customization

- **Alert Colors**: Modify in `src/utils/dataHelpers.ts`
- **Update Interval**: Change 10-minute timer in `src/hooks/useWeatherData.ts`  
- **Styling**: Edit Tailwind classes in components or `src/app/globals.css`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/NewFeature`)
3. Commit changes (`git commit -m 'Add NewFeature'`)
4. Push to branch (`git push origin feature/NewFeature`)
5. Open Pull Request

## 🙏 Acknowledgments

- [PAGASA](https://panahon.gov.ph) for the weather alert API
- Developed by [Praryo](https://praryo.lol)

---

**Note**: For informational purposes only. Always refer to official PAGASA announcements for critical weather decisions.
