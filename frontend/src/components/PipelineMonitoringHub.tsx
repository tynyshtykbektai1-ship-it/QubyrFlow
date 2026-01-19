import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Thermometer, Gauge, AlertTriangle, Activity } from 'lucide-react';

interface SensorData {
  time: string;
  temperature: number;
  pressure: number;
  thicknessLoss: number;
}

export function PipelineMonitoringHub() {
  const [data, setData] = useState<SensorData[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState({
    temperature: 0,
    pressure: 0,
    thicknessLoss: 0,
    riskLevel: 'Low',
    online: true,
    lastUpdate: new Date().toLocaleTimeString(),
    pipelineId: 'PL-2024-001',
  });

  useEffect(() => {
    // Generate initial mock data
    const initialData: SensorData[] = [];
    const now = Date.now();
    for (let i = 20; i >= 0; i--) {
      const time = new Date(now - i * 60000);
      initialData.push({
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        temperature: 65 + Math.random() * 10,
        pressure: 850 + Math.random() * 50,
        thicknessLoss: 1.2 + Math.random() * 0.3,
      });
    }
    setData(initialData);

    // Simulate real-time updates
    const interval = setInterval(() => {
      const newTemp = 65 + Math.random() * 10;
      const newPressure = 850 + Math.random() * 50;
      const newLoss = 1.2 + Math.random() * 0.3;

      const newDataPoint: SensorData = {
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        temperature: newTemp,
        pressure: newPressure,
        thicknessLoss: newLoss,
      };

      setData((prev) => [...prev.slice(-20), newDataPoint]);
      setCurrentMetrics({
        temperature: Math.round(newTemp * 10) / 10,
        pressure: Math.round(newPressure),
        thicknessLoss: Math.round(newLoss * 100) / 100,
        riskLevel: newLoss > 1.4 ? 'High' : newLoss > 1.3 ? 'Medium' : 'Low',
        online: true,
        lastUpdate: new Date().toLocaleTimeString(),
        pipelineId: 'PL-2024-001',
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High':
        return 'text-red-600 bg-red-50';
      case 'Medium':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'bg-green-50';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl mb-2">Pipeline Monitoring Hub</h1>
        <p className="text-gray-500 text-sm">Real-time sensor data and AI-powered insights</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Thermometer className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-xs text-gray-500">°C</span>
          </div>
          <p className="text-2xl mb-1">{currentMetrics.temperature}</p>
          <p className="text-gray-500 text-sm">Temperature</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-cyan-50 rounded-lg flex items-center justify-center">
              <Gauge className="w-5 h-5 text-cyan-500" />
            </div>
            <span className="text-xs text-gray-500">psi</span>
          </div>
          <p className="text-2xl mb-1">{currentMetrics.pressure}</p>
          <p className="text-gray-500 text-sm">Pressure</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
            </div>
            <span className="text-xs text-gray-500">mm</span>
          </div>
          <p className="text-2xl mb-1">{currentMetrics.thicknessLoss}</p>
          <p className="text-gray-500 text-sm">Predicted Thickness Loss</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#e6ffe6' }}>
              <Activity className="w-5 h-5" style={{ color: '#008000' }} />
            </div>
          </div>
          <p className={`inline-block px-3 py-1 rounded-full text-sm mb-2 ${getRiskColor(currentMetrics.riskLevel)}`} style={currentMetrics.riskLevel === 'Low' ? { color: '#008000' } : {}}>
            {currentMetrics.riskLevel}
          </p>
          <p className="text-gray-500 text-sm">Risk Level</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="mb-4">Temperature vs Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="#999" />
              <YAxis tick={{ fontSize: 12 }} stroke="#999" domain={[60, 80]} />
              <Tooltip />
              <Line type="monotone" dataKey="temperature" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="mb-4">Pressure vs Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="#999" />
              <YAxis tick={{ fontSize: 12 }} stroke="#999" domain={[800, 950]} />
              <Tooltip />
              <Line type="monotone" dataKey="pressure" stroke="#0ea5e9" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="mb-4">Thickness Loss vs Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="#999" />
              <YAxis tick={{ fontSize: 12 }} stroke="#999" domain={[1.0, 1.6]} />
              <Tooltip />
              <Line type="monotone" dataKey="thicknessLoss" stroke="#f97316" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Status Panel */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="mb-4">Device Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600 text-sm">Status</span>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full`} style={currentMetrics.online ? { backgroundColor: '#008000' } : { backgroundColor: '#dc2626' }}></div>
                <span style={currentMetrics.online ? { color: '#008000' } : { color: '#dc2626' }}>
                  {currentMetrics.online ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600 text-sm">Last Update</span>
              <span className="text-gray-900">{currentMetrics.lastUpdate}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600 text-sm">Pipeline ID</span>
              <span className="text-gray-900">{currentMetrics.pipelineId}</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-gray-600 text-sm">Device Type</span>
              <span className="text-gray-900">ESP32 Sensor Array</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}