import React, { useRef, useState, useCallback } from 'react';
import { Camera, Upload, X, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CameraCaptureProps {
  onImageCapture: (file: File) => void;
  onClose: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onImageCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'captured-photo.jpg', { type: 'image/jpeg' });
        onImageCapture(file);
        stopCamera();
        onClose();
      }
    }, 'image/jpeg', 0.9);
  }, [onImageCapture, onClose, stopCamera]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageCapture(file);
      onClose();
    }
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    stopCamera();
  };

  React.useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-black/50 text-white">
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-semibold">Take Photo</h2>
          <button
            onClick={switchCamera}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>

        {/* Camera View */}
        <div className="flex-1 relative overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          
          {/* Overlay Guide */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="border-2 border-white/50 border-dashed rounded-lg w-80 h-96 flex items-center justify-center">
              <div className="text-white/70 text-center">
                <Camera className="w-12 h-12 mx-auto mb-2" />
                <p className="text-sm">Position baby within frame</p>
                <p className="text-xs mt-1">Ensure full body is visible</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 bg-black/50">
          <div className="flex items-center justify-center space-x-8">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-4 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
            >
              <Upload className="w-6 h-6" />
            </button>
            
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={capturePhoto}
              disabled={isCapturing}
              className="w-20 h-20 rounded-full bg-white border-4 border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              <div className="w-16 h-16 rounded-full bg-white border-2 border-gray-400" />
            </motion.button>
            
            <div className="w-12" /> {/* Spacer */}
          </div>
        </div>

        <canvas ref={canvasRef} className="hidden" />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default CameraCapture;