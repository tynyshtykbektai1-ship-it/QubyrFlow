import { useState } from 'react';
import { useAuth } from './AuthContext';
import { Lock, User } from 'lucide-react';

export function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password);
    if (!success) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="inline-block p-3 rounded-xl mb-4" style={{ backgroundColor: '#e6ffe6' }}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl" style={{ backgroundColor: '#008000' }}>
                IO
              </div>
            </div>
            <h1 className="text-2xl mb-2">IntegrityOS</h1>
            <p className="text-gray-500 text-sm">Pipeline Integrity Monitoring Platform</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': '#008000' } as React.CSSProperties}
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': '#008000' } as React.CSSProperties}
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full text-white py-3 rounded-lg transition-colors"
              style={{ backgroundColor: '#008000' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#006600'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#008000'}
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-3 text-center">Demo Credentials:</p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between bg-gray-50 p-2 rounded">
                <span className="text-gray-600">Guest:</span>
                <span className="text-gray-800">guest / guest123</span>
              </div>
              <div className="flex justify-between bg-gray-50 p-2 rounded">
                <span className="text-gray-600">Expert:</span>
                <span className="text-gray-800">expert / expert123</span>
              </div>
              <div className="flex justify-between bg-gray-50 p-2 rounded">
                <span className="text-gray-600">Admin:</span>
                <span className="text-gray-800">admin / admin123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}