import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Baby, Camera, BarChart3, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const Layout: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/babies', icon: Baby, label: 'Babies' },
    { path: '/scan', icon: Camera, label: 'Scan' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="flex flex-col h-screen">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Baby className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">BabyGrowth</h1>
                <p className="text-xs text-gray-500">AI Growth Tracker</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <Outlet />
          </div>
        </main>

        {/* Bottom Navigation */}
        <nav className="bg-white/90 backdrop-blur-md border-t border-gray-200 px-4 py-2">
          <div className="flex justify-around max-w-md mx-auto">
            {navItems.map(({ path, icon: Icon, label }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className="relative flex flex-col items-center py-2 px-3 rounded-lg transition-colors"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-blue-100 rounded-lg"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon
                    className={`w-6 h-6 relative z-10 ${
                      isActive ? 'text-blue-600' : 'text-gray-400'
                    }`}
                  />
                  <span
                    className={`text-xs mt-1 relative z-10 ${
                      isActive ? 'text-blue-600 font-medium' : 'text-gray-400'
                    }`}
                  >
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Layout;