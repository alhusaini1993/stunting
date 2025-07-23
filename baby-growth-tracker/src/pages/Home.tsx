import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Baby, BarChart3, Plus, TrendingUp, Users, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { getBabies, getMeasurements } from '../lib/database';
import { Baby as BabyType, Measurement } from '../types';

const Home: React.FC = () => {
  const [babies, setBabies] = useState<BabyType[]>([]);
  const [recentMeasurements, setRecentMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const babiesData = await getBabies();
      setBabies(babiesData);

      // Get recent measurements from all babies
      const allMeasurements: Measurement[] = [];
      for (const baby of babiesData) {
        const measurements = await getMeasurements(baby.id);
        allMeasurements.push(...measurements);
      }
      
      // Sort by date and take the 5 most recent
      const sortedMeasurements = allMeasurements
        .sort((a, b) => new Date(b.measurement_date).getTime() - new Date(a.measurement_date).getTime())
        .slice(0, 5);
      
      setRecentMeasurements(sortedMeasurements);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Scan Baby',
      description: 'Take photo and measure',
      icon: Camera,
      color: 'from-blue-500 to-purple-600',
      path: '/scan'
    },
    {
      title: 'Add Baby',
      description: 'Register new baby',
      icon: Plus,
      color: 'from-green-500 to-teal-600',
      path: '/babies'
    },
    {
      title: 'View Analytics',
      description: 'Growth charts & trends',
      icon: BarChart3,
      color: 'from-orange-500 to-red-600',
      path: '/analytics'
    }
  ];

  const stats = [
    {
      label: 'Total Babies',
      value: babies.length,
      icon: Users,
      color: 'text-blue-600'
    },
    {
      label: 'Measurements',
      value: recentMeasurements.length,
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      label: 'This Month',
      value: recentMeasurements.filter(m => 
        new Date(m.measurement_date).getMonth() === new Date().getMonth()
      ).length,
      icon: Calendar,
      color: 'text-purple-600'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to BabyGrowth
        </h1>
        <p className="text-gray-600">
          AI-powered growth tracking for your little ones
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
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
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
        <div className="grid gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={action.path}
                className="block bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{action.title}</h3>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      {recentMeasurements.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Recent Measurements</h2>
            <Link
              to="/analytics"
              className="text-blue-600 text-sm font-medium hover:text-blue-700"
            >
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {recentMeasurements.slice(0, 3).map((measurement, index) => (
              <motion.div
                key={measurement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <Baby className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {measurement.height_cm.toFixed(1)} cm, {measurement.weight_kg.toFixed(1)} kg
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(measurement.measurement_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div
                    className="px-3 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: measurement.haz_color }}
                  >
                    {measurement.haz_category}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;