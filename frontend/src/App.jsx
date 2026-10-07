import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TelemetryProvider } from './context/TelemetryContext';
import MainLayout from './components/layout/MainLayout';

// Page Components
import DashboardPage from './pages/DashboardPage';
import LiveMonitoringPage from './pages/LiveMonitoringPage';
import DevicesPage from './pages/DevicesPage';
import DeviceDetailPage from './pages/DeviceDetailPage';
import TrackHealthPage from './pages/TrackHealthPage';
import TrackSectionDetailPage from './pages/TrackSectionDetailPage';
import AlertsPage from './pages/AlertsPage';
import AIPredictionsPage from './pages/AIPredictionsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ReportsPage from './pages/ReportsPage';
import MapPage from './pages/MapPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <TelemetryProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {/* Redirect root to /dashboard */}
            <Route index element={<Navigate to="/dashboard" replace />} />

            {/* Application Routes */}
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="monitoring" element={<LiveMonitoringPage />} />
            <Route path="devices" element={<DevicesPage />} />
            <Route path="devices/:deviceId" element={<DeviceDetailPage />} />
            <Route path="track" element={<TrackHealthPage />} />
            <Route path="track/:sectionId" element={<TrackSectionDetailPage />} />
            <Route path="alerts" element={<AlertsPage />} />
            <Route path="predictions" element={<AIPredictionsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="map" element={<MapPage />} />
            <Route path="settings" element={<SettingsPage />} />

            {/* Catch-all 404 redirect */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TelemetryProvider>
  );
}
