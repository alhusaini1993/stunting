import React from 'react';
import { Baby } from '../types';
import { Calendar, User, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { calculateAgeInMonths } from '../lib/anthropometry';

interface BabyCardProps {
  baby: Baby;
  onEdit: (baby: Baby) => void;
  onDelete: (id: string) => void;
  onSelect: (baby: Baby) => void;
}

const BabyCard: React.FC<BabyCardProps> = ({ baby, onEdit, onDelete, onSelect }) => {
  const ageMonths = calculateAgeInMonths(baby.birth_date);
  const ageYears = Math.floor(ageMonths / 12);
  const remainingMonths = ageMonths % 12;

  const formatAge = () => {
    if (ageYears === 0) {
      return `${ageMonths} months`;
    } else if (remainingMonths === 0) {
      return `${ageYears} year${ageYears > 1 ? 's' : ''}`;
    } else {
      return `${ageYears}y ${remainingMonths}m`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
      onClick={() => onSelect(baby)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            baby.gender === 'male' ? 'bg-blue-100' : 'bg-pink-100'
          }`}>
            <User className={`w-6 h-6 ${
              baby.gender === 'male' ? 'text-blue-600' : 'text-pink-600'
            }`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{baby.name}</h3>
            <p className="text-sm text-gray-500 capitalize">{baby.gender}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(baby);
            }}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(baby.id);
            }}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Age: {formatAge()}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <User className="w-4 h-4 mr-2" />
          <span>Parent: {baby.parent_name}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400">
          Added {new Date(baby.created_at).toLocaleDateString()}
        </p>
      </div>
    </motion.div>
  );
};

export default BabyCard;