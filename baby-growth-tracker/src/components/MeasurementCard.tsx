import React from 'react';
import { Measurement } from '../types';
import { Calendar, Ruler, Weight, TrendingUp, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface MeasurementCardProps {
  measurement: Measurement;
  onEdit: (measurement: Measurement) => void;
  onDelete: (id: string) => void;
}

const MeasurementCard: React.FC<MeasurementCardProps> = ({ measurement, onEdit, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
            <Ruler className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Measurement</h3>
            <p className="text-sm text-gray-500">{measurement.age_months} months old</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(measurement)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(measurement.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Ruler className="w-4 h-4 text-blue-600" />
          <div>
            <p className="text-sm text-gray-500">Height</p>
            <p className="font-semibold">{measurement.height_cm.toFixed(1)} cm</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Weight className="w-4 h-4 text-green-600" />
          <div>
            <p className="text-sm text-gray-500">Weight</p>
            <p className="font-semibold">{measurement.weight_kg.toFixed(1)} kg</p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <TrendingUp className="w-4 h-4 text-purple-600" />
          <p className="text-sm text-gray-500">Growth Status</p>
        </div>
        <div
          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
          style={{ backgroundColor: measurement.haz_color }}
        >
          HAZ {measurement.haz_score.toFixed(2)} - {measurement.haz_category}
        </div>
      </div>

      <div className="flex items-center text-sm text-gray-600">
        <Calendar className="w-4 h-4 mr-2" />
        <span>{new Date(measurement.measurement_date).toLocaleDateString()}</span>
      </div>

      {measurement.notes && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">{measurement.notes}</p>
        </div>
      )}
    </motion.div>
  );
};

export default MeasurementCard;