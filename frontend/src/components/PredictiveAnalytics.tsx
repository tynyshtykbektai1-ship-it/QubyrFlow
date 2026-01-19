import { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertCircle, Clock } from 'lucide-react';

interface PredictionResult {
  thicknessLoss: number;
  remainingLife: number;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export function PredictiveAnalytics() {
  const [formData, setFormData] = useState({
    pipeSize: '24',
    initialThickness: '12.7',
    minThickness: '8.0',
    material: 'Carbon Steel',
    grade: 'API 5L X65',
    corrosionImpact: '15',
    materialLoss: '8',
    condition: 'Good',
  });

  const [liveData, setLiveData] = useState({
    temperature: 68.5,
    pressure: 875,
  });

  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulate live sensor data updates
    const interval = setInterval(() => {
      setLiveData({
        temperature: Math.round((65 + Math.random() * 10) * 10) / 10,
        pressure: Math.round(850 + Math.random() * 50),
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRunPrediction = async () => {
    setIsLoading(true);
    setPrediction(null);

    // Simulate API call
    try {
      const response = await fetch('/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          temperature: liveData.temperature,
          pressure: liveData.pressure,
        }),
      });

      // Mock response since we don't have a real backend
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Calculate mock prediction based on inputs
      const corrosionFactor = parseFloat(formData.corrosionImpact) / 100;
      const materialLossFactor = parseFloat(formData.materialLoss) / 100;
      const thicknessLoss = Math.round((2.5 + corrosionFactor * 3 + materialLossFactor * 2) * 100) / 100;
      
      const currentThickness = parseFloat(formData.initialThickness) - thicknessLoss;
      const thicknessToMin = currentThickness - parseFloat(formData.minThickness);
      const remainingLife = Math.max(0, Math.round((thicknessToMin / 0.3) * 10) / 10);
      
      const riskLevel: 'Low' | 'Medium' | 'High' = 
        thicknessLoss > 3.5 ? 'High' : 
        thicknessLoss > 2.0 ? 'Medium' : 'Low';

      setPrediction({
        thicknessLoss,
        remainingLife,
        riskLevel,
      });
    } catch (error) {
      console.error('Prediction failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      default:
        return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl mb-2">Predictive Analytics</h1>
        <p className="text-gray-500 text-sm">AI-powered thickness loss prediction and remaining life estimation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
            <h3 className="mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5" style={{ color: '#008000' }} />
              Pipeline Parameters
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Pipe Size (mm)</label>
                <input
                  type="number"
                  name="pipeSize"
                  value={formData.pipeSize}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': '#008000' } as React.CSSProperties}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">Initial Thickness (mm)</label>
                <input
                  type="number"
                  name="initialThickness"
                  value={formData.initialThickness}
                  onChange={handleInputChange}
                  step="0.1"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">Minimum Allowed Thickness (mm)</label>
                <input
                  type="number"
                  name="minThickness"
                  value={formData.minThickness}
                  onChange={handleInputChange}
                  step="0.1"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">Material</label>
                <select
                  name="material"
                  value={formData.material}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option>Carbon Steel</option>
                  <option>Stainless Steel</option>
                  <option>Duplex Steel</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">Grade</label>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option>API 5L X65</option>
                  <option>API 5L X70</option>
                  <option>API 5L X80</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">Condition</label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option>Excellent</option>
                  <option>Good</option>
                  <option>Fair</option>
                  <option>Poor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">Corrosion Impact (%)</label>
                <input
                  type="number"
                  name="corrosionImpact"
                  value={formData.corrosionImpact}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">Material Loss (%)</label>
                <input
                  type="number"
                  name="materialLoss"
                  value={formData.materialLoss}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-500" />
              Live Sensor Data
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Temperature</p>
                <p className="text-2xl text-blue-600">{liveData.temperature}°C</p>
              </div>
              <div className="bg-cyan-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Pressure</p>
                <p className="text-2xl text-cyan-600">{liveData.pressure} psi</p>
              </div>
            </div>

            <button
              onClick={handleRunPrediction}
              disabled={isLoading}
              className="w-full text-white py-3 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ backgroundColor: isLoading ? '#d1d5db' : '#008000' }}
              onMouseEnter={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#006600')}
              onMouseLeave={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#008000')}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Running Prediction...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  Run AI Prediction
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-8">
            <h3 className="mb-4">Prediction Results</h3>
            
            {!prediction && !isLoading && (
              <div className="text-center py-12 text-gray-400">
                <Brain className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Run prediction to see results</p>
              </div>
            )}

            {isLoading && (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-3" style={{ borderColor: '#008000', borderTopColor: 'transparent' }}></div>
                <p className="text-sm text-gray-500">Analyzing data...</p>
              </div>
            )}

            {prediction && !isLoading && (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4 border border-orange-100">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                    <p className="text-sm text-gray-600">Predicted Thickness Loss</p>
                  </div>
                  <p className="text-3xl text-orange-600">{prediction.thicknessLoss} mm</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <p className="text-sm text-gray-600">Remaining Life</p>
                  </div>
                  <p className="text-3xl text-blue-600">{prediction.remainingLife} years</p>
                </div>

                <div className={`rounded-lg p-4 border ${getRiskColor(prediction.riskLevel)}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5" />
                    <p className="text-sm">Risk Level</p>
                  </div>
                  <p className="text-3xl">{prediction.riskLevel}</p>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-sm mb-3">Recommendation</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {prediction.riskLevel === 'High' && 
                      'Immediate inspection recommended. Consider pipeline replacement or reinforcement.'}
                    {prediction.riskLevel === 'Medium' && 
                      'Schedule inspection within 6 months. Monitor thickness loss trends closely.'}
                    {prediction.riskLevel === 'Low' && 
                      'Continue normal monitoring schedule. Pipeline integrity is within acceptable limits.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}