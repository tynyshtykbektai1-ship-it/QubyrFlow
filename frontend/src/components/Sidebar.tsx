import { useAuth } from './AuthContext';
import { Activity, BarChart3, HardDrive, FileText, LogOut, User } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export function Sidebar({ activeView, setActiveView }: SidebarProps) {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'monitoring', label: 'Pipeline Monitoring Hub', icon: Activity, permission: ['guest', 'expert', 'admin'] },
    { id: 'analytics', label: 'Predictive Analytics', icon: BarChart3, permission: ['guest', 'expert', 'admin'] },
    { id: 'devices', label: 'Device Management', icon: HardDrive, permission: ['admin'] },
    { id: 'summary', label: 'Executive Summary', icon: FileText, permission: ['expert', 'admin'] },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.permission.includes(user?.role || '')
  );

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: '#008000' }}>
            IO
          </div>
          <div>
            <h1 className="text-lg">IntegrityOS</h1>
            <p className="text-xs text-gray-500">Pipeline Monitoring</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                  activeView === item.id
                    ? 'text-gray-600 hover:bg-gray-50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                style={activeView === item.id ? { backgroundColor: '#e6ffe6', color: '#008000' } : {}}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-3 px-4 py-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm">{user?.username}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors text-left"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  );
}