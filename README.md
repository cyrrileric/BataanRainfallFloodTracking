# 🌧️ Bataan Weather Alerts Dashboard

A real-time rainfall warning dashboard specifically for Bataan Province, Philippines. This Next.js application fetches data from the PAGASA API every 10 minutes, filters alerts for Bataan only, logs the data to JSON files, and displays interactive charts and statistics.

## 🚀 Features

- **Real-time Data**: Automatically fetches rainfall alerts every 10 minutes from PAGASA API
- **Bataan-Specific**: Filters and displays only alerts relevant to Bataan Province
- **Data Logging**: Saves all fetched data to timestamped JSON files for historical analysis
- **Interactive Charts**: Line and bar charts showing alert trends over time
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Auto-refresh**: Automatic updates with countdown timer
- **Error Handling**: Robust error handling with user-friendly messages

## 🎯 Alert Types

- **🔴 Red**: Critical rainfall warning
- **🟠 Orange**: High rainfall warning  
- **🟡 Yellow**: Moderate rainfall warning
- **🔵 Expecting**: Expected rainfall conditions

## 🛠️ Tech Stack

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Chart.js & React Chart.js 2** for data visualization
- **Axios** for API calls
- **date-fns** for date handling

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── alerts/route.ts      # Fetch and log current alerts
│   │   └── history/route.ts     # Retrieve historical data
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                 # Main dashboard
├── components/
│   ├── AlertsChart.tsx          # Chart component
│   ├── AlertsList.tsx           # Alert list display
│   └── DashboardStats.tsx       # Statistics cards
├── hooks/
│   └── useWeatherData.ts        # Custom hook for data management
├── types/
│   └── index.ts                 # TypeScript type definitions
└── utils/
    └── dataHelpers.ts           # Utility functions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd bataan-weather-site
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Production Build

```bash
npm run build
npm start
```

## 📊 Data Source

This application fetches data from the [PAGASA API](https://panahon.gov.ph/api/v1/cap-alerts):
- **API Endpoint**: `https://panahon.gov.ph/api/v1/cap-alerts`
- **Update Frequency**: Every 10 minutes
- **Data Format**: JSON with province, municipality, alert type, and geographical coordinates

## 💾 Data Logging

All fetched data is automatically logged to JSON files in the `/public/data/` directory:
- Files are named by date: `bataan-alerts-YYYY-MM-DD.json`
- Each entry includes timestamp, filtered Bataan alerts, and total count
- Historical data can be accessed via the `/api/history` endpoint

## 🔧 API Endpoints

### `/api/alerts`
- **Method**: GET
- **Description**: Fetches current alerts from PAGASA and logs them
- **Response**: Current Bataan alerts with metadata

### `/api/history`
- **Method**: GET
- **Parameters**: 
  - `days` (optional): Number of days to retrieve (default: 1)
  - `list=true` (optional): Get list of available log files
- **Description**: Retrieves historical alert data and chart data

## 🎨 Customization

### Styling
- Modify `src/app/globals.css` for global styles
- Component styling uses Tailwind CSS classes
- Alert colors are defined in `src/utils/dataHelpers.ts`

### Data Update Frequency
- Change the 10-minute interval in `src/hooks/useWeatherData.ts`
- Update the countdown calculation in `src/utils/dataHelpers.ts`

### Chart Configuration
- Modify chart options in `src/components/AlertsChart.tsx`
- Add new chart types or customize existing ones

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [PAGASA](https://panahon.gov.ph) for providing the weather alert API
- Next.js team for the excellent framework
- Chart.js for the visualization library

---

**Note**: This application is for informational purposes only. Always refer to official PAGASA announcements for critical weather decisions.
