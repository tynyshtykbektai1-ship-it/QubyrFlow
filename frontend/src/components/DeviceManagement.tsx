import { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

interface Device {
  id: string;
  name: string;
  status: 'online' | 'offline';
  temperature: number;
  pressure: number;
  pipeline: string;
  lastSeen: string;
}

export function DeviceManagement() {
  const [devices, setDevices] = useState<Device[]>([
    {
      id: 'ESP32-001',
      name: 'Sensor Array A1',
      status: 'online',
      temperature: 68.5,
      pressure: 875,
      pipeline: 'PL-2024-001',
      lastSeen: new Date().toLocaleTimeString(),
    },
    {
      id: 'ESP32-002',
      name: 'Sensor Array A2',
      status: 'online',
      temperature: 70.2,
      pressure: 862,
      pipeline: 'PL-2024-001',
      lastSeen: new Date(Date.now() - 120000).toLocaleTimeString(),
    },
    {
      id: 'ESP32-003',
      name: 'Sensor Array B1',
      status: 'offline',
      temperature: 0,
      pressure: 0,
      pipeline: 'PL-2024-002',
      lastSeen: new Date(Date.now() - 3600000).toLocaleTimeString(),
    },
    {
      id: 'ESP32-004',
      name: 'Sensor Array B2',
      status: 'online',
      temperature: 67.8,
      pressure: 881,
      pipeline: 'PL-2024-002',
      lastSeen: new Date().toLocaleTimeString(),
    },
    {
      id: 'ESP32-005',
      name: 'Sensor Array C1',
      status: 'online',
      temperature: 71.5,
      pressure: 856,
      pipeline: 'PL-2024-003',
      lastSeen: new Date(Date.now() - 60000).toLocaleTimeString(),
    },
  ]);

  const [testingDevice, setTestingDevice] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<{ [key: string]: 'success' | 'failed' }>({});

  useEffect(() => {
    // Simulate real-time device updates
    const interval = setInterval(() => {
      setDevices((prev) =>
        prev.map((device) => {
          if (device.status === 'online') {
            return {
              ...device,
              temperature: Math.round((65 + Math.random() * 10) * 10) / 10,
              pressure: Math.round(850 + Math.random() * 50),
              lastSeen: new Date().toLocaleTimeString(),
            };
          }
          return device;
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleTestConnection = async (deviceId: string) => {
    setTestingDevice(deviceId);
    setTestResults((prev) => {
      const newResults = { ...prev };
      delete newResults[deviceId];
      return newResults;
    });

    // Simulate connection test
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const device = devices.find((d) => d.id === deviceId);
    const result = device?.status === 'online' ? 'success' : 'failed';
    
    setTestResults((prev) => ({ ...prev, [deviceId]: result }));
    setTestingDevice(null);
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl mb-2">Device Management</h1>
        <p className="text-gray-500 text-sm">Monitor and manage ESP32 sensor arrays</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Total Devices</p>
              <p className="text-2xl">{devices.length}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Wifi className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Online</p>
              <p className="text-2xl" style={{ color: '#008000' }}>{devices.filter((d) => d.status === 'online').length}</p>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#e6ffe6' }}>
              <CheckCircle className="w-6 h-6" style={{ color: '#008000' }} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Offline</p>
              <p className="text-2xl text-red-600">{devices.filter((d) => d.status === 'offline').length}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Device List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm text-gray-600">Device ID</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">Name</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">Status</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">Temperature</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">Pressure</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">Pipeline</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">Last Seen</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {devices.map((device) => (
                <tr key={device.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm">{device.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm">{device.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {device.status === 'online' ? (
                        <>
                          <Wifi className="w-4 h-4" style={{ color: '#008000' }} />
                          <span className="text-sm" style={{ color: '#008000' }}>Online</span>
                        </>
                      ) : (
                        <>
                          <WifiOff className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-red-600">Offline</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">
                      {device.status === 'online' ? `${device.temperature}°C` : '--'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">
                      {device.status === 'online' ? `${device.pressure} psi` : '--'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">{device.pipeline}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">{device.lastSeen}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleTestConnection(device.id)}
                      disabled={testingDevice === device.id}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {testingDevice === device.id ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Testing...
                        </>
                      ) : testResults[device.id] === 'success' ? (
                        <>
                          <CheckCircle className="w-4 h-4" style={{ color: '#008000' }} />
                          Success
                        </>
                      ) : testResults[device.id] === 'failed' ? (
                        <>
                          <XCircle className="w-4 h-4 text-red-500" />
                          Failed
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4" />
                          Test
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}