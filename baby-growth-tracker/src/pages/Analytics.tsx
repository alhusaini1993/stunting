import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Baby, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { getBabies, getMeasurements } from '../lib/database';
import { Baby as BabyType, Measurement } from '../types';

const Analytics: React.FC = () => {
  const [babies, setBabies] = useState<BabyType[]>([]);
  const [selectedBabyId, setSelectedBabyId] = useState<string>('');
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedBabyId) {
      loadMeasurements(selectedBabyId);
    }
  }, [selectedBabyId]);

  const loadData = async () => {
    try {
      const babiesData = await getBabies();
      setBabies(babiesData);
      if (babiesData.length > 0) {
        setSelectedBabyId(babiesData[0].id);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMeasurements = async (babyId: string) => {
    try {
      const data = await getMeasurements(babyId);
      setMeasurements(data.reverse()); // Show oldest first for chart
    } catch (error) {
      console.error('Error loading measurements:', error);
    }
  };

  const selectedBaby = babies.find(b => b.id === selectedBabyId);

  const chartData = measurements.map((m, index) => ({
    measurement: index + 1,
    height: m.height_cm,
    weight: m.weight_kg,
    haz: m.haz_score,
    date: new Date(m.measurement_date).toLocaleDateString(),
    age: m.age_months
  }));

  const latestMeasurement = measurements[measurements.length - 1];
  
  const stats = [
    {
      label: 'Total Measurements',
      value: measurements.length,
      icon: BarChart3,
      color: 'text-blue-600'
    },
    {
      label: 'Latest Height',
      value: latestMeasurement ? `${latestMeasurement.height_cm.toFixed(1)} cm` : 'N/A',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      label: 'Latest Weight',
      value: latestMeasurement ? `${latestMeasurement.weight_kg.toFixed(1)} kg` : 'N/A',
      icon: Calendar,
      color: 'text-purple-600'
    },
    {
      label: 'Growth Status',
      value: latestMeasurement ? latestMeasurement.haz_category : 'N/A',
      icon: Baby,
      color: 'text-orange-600'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (babies.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No data available</h3>
        <p className="text-gray-500">Add babies and take measurements to see analytics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Growth Analytics</h1>
          <p className="text-gray-600">Track growth patterns and trends</p>
        </div>
      </div>

      {/* Baby Selector */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Baby
        </label>
        <select
          value={selectedBabyId}
          onChange={(e) => setSelectedBabyId(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {babies.map((baby) => (
            <option key={baby.id} value={baby.id}>
              {baby.name}
            </option>
          ))}
        </select>
      </div>

      {selectedBaby && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </motion.div>
            ))}
          </div>

          {measurements.length > 0 ? (
            <>
              {/* Height Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Height Growth</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="age" label={{ value: 'Age (months)', position: 'insideBottom', offset: -10 }} />
                      <YAxis label={{ value: 'Height (cm)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip 
                        formatter={(value, name) => [`${value} cm`, 'Height']}
                        labelFormatter={(label) => `Age: ${label} months`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="height" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Weight Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Weight Growth</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="age" label={{ value: 'Age (months)', position: 'insideBottom', offset: -10 }} />
                      <YAxis label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip 
                        formatter={(value, name) => [`${value} kg`, 'Weight']}
                        labelFormatter={(label) => `Age: ${label} months`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="weight" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* HAZ Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Height-for-Age Z-Score (HAZ)</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="age" label={{ value: 'Age (months)', position: 'insideBottom', offset: -10 }} />
                      <YAxis label={{ value: 'HAZ Score', angle: -90, position: 'insideLeft' }} />
                      <Tooltip 
                        formatter={(value, name) => [`${value}`, 'HAZ Score']}
                        labelFormatter={(label) => `Age: ${label} months`}
                      />
                      <Bar 
                        dataKey="haz" 
                        fill="#8b5cf6"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Stunted (&lt; -2)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span>At Risk (-2 to -1)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Normal (&gt; -1)</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No measurements yet</h3>
              <p className="text-gray-500">Take your first measurement to see growth analytics</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Analytics;