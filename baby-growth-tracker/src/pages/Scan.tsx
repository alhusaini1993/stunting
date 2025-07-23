import React, { useState, useEffect } from 'react';
import { Camera, Upload, Loader, Baby, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import CameraCapture from '../components/CameraCapture';
import { Baby as BabyType, PredictionResult } from '../types';
import { getBabies, createMeasurement } from '../lib/database';
import { detectPoseAndMeasure, calculateAgeInMonths } from '../lib/anthropometry';

interface ScanFormData {
  baby_id: string;
  scale_cm_per_px: number;
  notes?: string;
}

const Scan: React.FC = () => {
  const [babies, setBabies] = useState<BabyType[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [landmarks, setLandmarks] = useState<any>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<ScanFormData>({
    defaultValues: {
      scale_cm_per_px: 0.1
    }
  });

  const selectedBabyId = watch('baby_id');
  const selectedBaby = babies.find(b => b.id === selectedBabyId);

  useEffect(() => {
    loadBabies();
  }, []);

  const loadBabies = async () => {
    try {
      const data = await getBabies();
      setBabies(data);
    } catch (error) {
      toast.error('Failed to load babies');
    }
  };

  const handleImageCapture = (file: File) => {
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    setResult(null);
    setLandmarks(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageCapture(file);
    }
  };

  const onSubmit = async (data: ScanFormData) => {
    if (!selectedImage || !selectedBaby) {
      toast.error('Please select a baby and capture/upload an image');
      return;
    }

    setIsProcessing(true);
    try {
      const ageMonths = calculateAgeInMonths(selectedBaby.birth_date);
      
      const prediction = await detectPoseAndMeasure(
        selectedImage,
        ageMonths,
        selectedBaby.gender,
        data.scale_cm_per_px
      );

      setResult(prediction);
      setLandmarks(prediction.landmarks);

      // Save measurement to database
      await createMeasurement({
        baby_id: selectedBaby.id,
        height_cm: prediction.height_cm,
        weight_kg: prediction.weight_kg,
        age_months: ageMonths,
        haz_score: prediction.haz,
        haz_category: prediction.haz_cat,
        haz_color: prediction.haz_color,
        landmarks_data: prediction.landmarks,
        measurement_date: new Date().toISOString(),
        notes: data.notes
      });

      toast.success('Measurement saved successfully!');
    } catch (error) {
      toast.error('Failed to process image');
      console.error('Processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">AI Growth Scanner</h1>
        <p className="text-gray-600">Capture and analyze baby's growth automatically</p>
      </div>

      {/* Baby Selection */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Baby</h2>
        <select
          {...register('baby_id', { required: 'Please select a baby' })}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Choose a baby...</option>
          {babies.map((baby) => (
            <option key={baby.id} value={baby.id}>
              {baby.name} ({calculateAgeInMonths(baby.birth_date)} months)
            </option>
          ))}
        </select>
        {errors.baby_id && (
          <p className="text-red-500 text-sm mt-1">{errors.baby_id.message}</p>
        )}
      </div>

      {/* Image Capture */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Capture Image</h2>
        
        {!imagePreview ? (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Camera className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Take a Photo</h3>
                  <p className="text-gray-500">Position baby standing or lying down</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    type="button"
                    onClick={() => setShowCamera(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors"
                  >
                    <Camera className="w-5 h-5" />
                    <span>Open Camera</span>
                  </button>
                  <label className="bg-gray-600 text-white px-6 py-3 rounded-xl flex items-center justify-center space-x-2 hover:bg-gray-700 transition-colors cursor-pointer">
                    <Upload className="w-5 h-5" />
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Tips for best results:</p>
                  <ul className="space-y-1 text-blue-700">
                    <li>• Ensure baby's full body is visible</li>
                    <li>• Use good lighting</li>
                    <li>• Keep camera steady</li>
                    <li>• Include a reference object for scale</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={imagePreview}
                alt="Captured"
                className="w-full h-64 object-cover rounded-xl"
              />
              {landmarks && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white bg-black/50 px-3 py-1 rounded-full text-sm">
                    Landmarks Detected ✓
                  </div>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedImage(null);
                setImagePreview(null);
                setResult(null);
                setLandmarks(null);
              }}
              className="w-full py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Take Another Photo
            </button>
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Measurement Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Scale (cm per pixel)
            </label>
            <input
              {...register('scale_cm_per_px', { 
                required: 'Scale is required',
                min: { value: 0.01, message: 'Scale must be positive' }
              })}
              type="number"
              step="0.01"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.10"
            />
            {errors.scale_cm_per_px && (
              <p className="text-red-500 text-sm mt-1">{errors.scale_cm_per_px.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Adjust based on reference objects in the image
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add any notes about this measurement..."
            />
          </div>
        </div>
      </div>

      {/* Process Button */}
      <button
        onClick={handleSubmit(onSubmit)}
        disabled={!selectedImage || !selectedBabyId || isProcessing}
        className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isProcessing ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <Baby className="w-5 h-5" />
            <span>Analyze Growth</span>
          </>
        )}
      </button>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Measurement Results</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <p className="text-2xl font-bold text-blue-600">{result.height_cm.toFixed(1)}</p>
                <p className="text-sm text-blue-800">Height (cm)</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <p className="text-2xl font-bold text-green-600">{result.weight_kg.toFixed(1)}</p>
                <p className="text-sm text-green-800">Weight (kg)</p>
              </div>
            </div>

            <div className="text-center p-4 rounded-xl" style={{ backgroundColor: result.haz_color + '20' }}>
              <div
                className="inline-flex items-center px-4 py-2 rounded-full text-white font-medium"
                style={{ backgroundColor: result.haz_color }}
              >
                HAZ {result.haz.toFixed(2)} - {result.haz_cat}
              </div>
              <p className="text-sm text-gray-600 mt-2">Growth Status Assessment</p>
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600">
                <strong>Method:</strong> {result.method}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Scale:</strong> {result.scale_cm_per_px} cm/px
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Camera Modal */}
      {showCamera && (
        <CameraCapture
          onImageCapture={handleImageCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
};

export default Scan;