import { useState } from 'react';
import { AuthProvider, useAuth } from './components/AuthContext';
import { LoginPage } from './components/LoginPage';
import { Sidebar } from './components/Sidebar';
import { PipelineMonitoringHub } from './components/PipelineMonitoringHub';
import { PredictiveAnalytics } from './components/PredictiveAnalytics';
import { DeviceManagement } from './components/DeviceManagement';
import { ExecutiveSummary } from './components/ExecutiveSummary';

function AppContent() {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState('monitoring');

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 overflow-auto">
        {activeView === 'monitoring' && <PipelineMonitoringHub />}
        {activeView === 'analytics' && <PredictiveAnalytics />}
        {activeView === 'devices' && <DeviceManagement />}
        {activeView === 'summary' && <ExecutiveSummary />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
