import React from 'react';
import { Settings as SettingsIcon, Info, Shield, Bell, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const Settings: React.FC = () => {
  const settingsGroups = [
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { label: 'Measurement Reminders', description: 'Get notified to take regular measurements', enabled: true },
        { label: 'Growth Alerts', description: 'Alerts for significant growth changes', enabled: false },
      ]
    },
    {
      title: 'Privacy & Security',
      icon: Shield,
      items: [
        { label: 'Data Encryption', description: 'All data is encrypted and secure', enabled: true },
        { label: 'Anonymous Analytics', description: 'Help improve the app with anonymous usage data', enabled: false },
      ]
    },
    {
      title: 'Data Management',
      icon: Download,
      items: [
        { label: 'Export Data', description: 'Download your data as CSV', action: 'export' },
        { label: 'Backup Settings', description: 'Backup your app settings', action: 'backup' },
      ]
    }
  ];

  const appInfo = [
    { label: 'Version', value: '1.0.0' },
    { label: 'Build', value: '2024.01.15' },
    { label: 'AI Models', value: 'YOLO v8 Pose + MediaPipe' },
    { label: 'WHO Standards', value: '2006 Growth Charts' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Customize your app experience</p>
      </div>

      {/* Settings Groups */}
      {settingsGroups.map((group, groupIndex) => (
        <motion.div
          key={group.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: groupIndex * 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <group.icon className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">{group.title}</h2>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {group.items.map((item, itemIndex) => (
              <div key={itemIndex} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.label}</h3>
                    <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                  </div>
                  
                  {item.hasOwnProperty('enabled') ? (
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked={item.enabled}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  ) : (
                    <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      {item.action === 'export' ? 'Export' : 'Backup'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* App Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100"
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Info className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">App Information</h2>
          </div>
        </div>
        
        <div className="divide-y divide-gray-100">
          {appInfo.map((info, index) => (
            <div key={index} className="p-6 flex items-center justify-between">
              <span className="font-medium text-gray-900">{info.label}</span>
              <span className="text-gray-500">{info.value}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* About */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <SettingsIcon className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">BabyGrowth AI</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Advanced AI-powered growth tracking using computer vision and WHO growth standards. 
            Helping parents monitor their children's development with precision and care.
          </p>
          <div className="mt-4 text-xs text-gray-500">
            Made with ❤️ for healthy growth
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;