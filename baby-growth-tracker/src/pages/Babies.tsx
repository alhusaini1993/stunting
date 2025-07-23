import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import BabyCard from '../components/BabyCard';
import { Baby } from '../types';
import { getBabies, createBaby, updateBaby, deleteBaby } from '../lib/database';

const babySchema = yup.object({
  name: yup.string().required('Name is required'),
  birth_date: yup.string().required('Birth date is required'),
  gender: yup.string().oneOf(['male', 'female']).required('Gender is required'),
  parent_name: yup.string().required('Parent name is required'),
});

type BabyFormData = yup.InferType<typeof babySchema>;

const Babies: React.FC = () => {
  const [babies, setBabies] = useState<Baby[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBaby, setEditingBaby] = useState<Baby | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<BabyFormData>({
    resolver: yupResolver(babySchema)
  });

  useEffect(() => {
    loadBabies();
  }, []);

  const loadBabies = async () => {
    try {
      const data = await getBabies();
      setBabies(data);
    } catch (error) {
      toast.error('Failed to load babies');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: BabyFormData) => {
    try {
      if (editingBaby) {
        await updateBaby(editingBaby.id, data);
        toast.success('Baby updated successfully');
      } else {
        await createBaby(data);
        toast.success('Baby added successfully');
      }
      await loadBabies();
      handleCloseForm();
    } catch (error) {
      toast.error('Failed to save baby');
    }
  };

  const handleEdit = (baby: Baby) => {
    setEditingBaby(baby);
    reset({
      name: baby.name,
      birth_date: baby.birth_date.split('T')[0],
      gender: baby.gender,
      parent_name: baby.parent_name,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this baby?')) {
      try {
        await deleteBaby(id);
        toast.success('Baby deleted successfully');
        await loadBabies();
      } catch (error) {
        toast.error('Failed to delete baby');
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBaby(null);
    reset();
  };

  const filteredBabies = babies.filter(baby =>
    baby.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    baby.parent_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Babies</h1>
          <p className="text-gray-600">Manage your little ones</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Baby</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search babies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Babies Grid */}
      <div className="grid gap-4">
        <AnimatePresence>
          {filteredBabies.map((baby) => (
            <BabyCard
              key={baby.id}
              baby={baby}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSelect={(baby) => {
                // Navigate to baby details or measurements
                console.log('Selected baby:', baby);
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      {filteredBabies.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No babies found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'Try adjusting your search' : 'Get started by adding your first baby'}
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Add Baby
          </button>
        </div>
      )}

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={handleCloseForm}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {editingBaby ? 'Edit Baby' : 'Add New Baby'}
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Baby Name
                  </label>
                  <input
                    {...register('name')}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter baby's name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Birth Date
                  </label>
                  <input
                    {...register('birth_date')}
                    type="date"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.birth_date && (
                    <p className="text-red-500 text-sm mt-1">{errors.birth_date.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    {...register('gender')}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  {errors.gender && (
                    <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parent Name
                  </label>
                  <input
                    {...register('parent_name')}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter parent's name"
                  />
                  {errors.parent_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.parent_name.message}</p>
                  )}
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : editingBaby ? 'Update' : 'Add Baby'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Babies;