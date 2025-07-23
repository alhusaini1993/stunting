import { PredictionResult, WHOData, StuntingLabel } from '../types';

// WHO Growth Standards Data (0-60 months)
const BOYS_MEDIAN = [
  49.9, 54.7, 58.4, 61.4, 63.9, 65.9, 67.6, 69.2, 70.6, 72.0, 73.3, 74.5, 75.7,
  76.9, 78.0, 79.1, 80.2, 81.2, 82.3, 83.2, 84.2, 85.1, 86.0, 87.0, 87.9, 88.8,
  89.6, 90.5, 91.3, 92.1, 92.9, 93.7, 94.4, 95.2, 95.9, 96.6, 97.3, 98.0, 98.7,
  99.3, 99.9, 100.6, 101.2, 101.8, 102.4, 103.0, 103.6, 104.2, 104.8, 105.3,
  105.9, 106.4, 107.0, 107.5, 108.0, 108.5, 109.0, 109.5, 110.0, 110.5, 111.0
];

const GIRLS_MEDIAN = [
  49.1, 53.7, 57.1, 59.8, 62.1, 64.0, 65.7, 67.3, 68.7, 70.1, 71.5, 72.8, 74.0,
  75.2, 76.4, 77.5, 78.6, 79.7, 80.7, 81.7, 82.7, 83.7, 84.6, 85.5, 86.4, 87.3,
  88.2, 89.1, 89.9, 90.7, 91.4, 92.2, 92.9, 93.6, 94.3, 95.0, 95.7, 96.3, 97.0,
  97.6, 98.2, 98.8, 99.4, 100.0, 100.6, 101.2, 101.7, 102.3, 102.8, 103.3,
  103.9, 104.4, 104.9, 105.4, 105.9, 106.4, 106.9, 107.4, 107.9, 108.4, 108.9
];

const WHO_TABLE: WHOData = {
  male: { med: BOYS_MEDIAN },
  female: { med: GIRLS_MEDIAN }
};

const STUNTING_LABELS: StuntingLabel[] = [
  { threshold: -2.0, label: "Severely Stunted", color: "#e02401" },
  { threshold: -1.0, label: "Stunted", color: "#ff9e00" },
  { threshold: 1.0, label: "Normal", color: "#26a269" },
  { threshold: 99, label: "Tall", color: "#3182ce" }
];

export function calculateHAZ(height: number, ageMonths: number, gender: 'male' | 'female'): {
  haz: number;
  category: string;
  color: string;
} {
  const clampedAge = Math.max(0, Math.min(59, Math.floor(ageMonths)));
  const median = WHO_TABLE[gender].med[clampedAge];
  const sd = Math.max(median * 0.05, 1);
  const haz = (height - median) / sd;

  for (const { threshold, label, color } of STUNTING_LABELS) {
    if (haz < threshold) {
      return { haz, category: label, color };
    }
  }

  return {
    haz,
    category: STUNTING_LABELS[STUNTING_LABELS.length - 1].label,
    color: STUNTING_LABELS[STUNTING_LABELS.length - 1].color
  };
}

export function estimateWeightFromHeight(height: number, bmi: number = 15.0): number {
  return bmi * Math.pow(height / 100, 2);
}

// Simulate pose detection (in real app, this would use actual ML models)
export async function detectPoseAndMeasure(
  imageFile: File,
  ageMonths: number,
  gender: 'male' | 'female',
  scaleCmPerPx: number = 0.1
): Promise<PredictionResult> {
  return new Promise((resolve) => {
    // Simulate processing time
    setTimeout(() => {
      // Mock landmarks detection
      const mockLandmarks = {
        head: { x: 0.5, y: 0.1 },
        feet: { x: 0.5, y: 0.9 },
        confidence: 0.95
      };

      // Simulate height calculation based on image analysis
      // In real implementation, this would use YOLO v8 Pose + MediaPipe
      const mockHeightPx = 800; // pixels from head to feet
      const heightCm = mockHeightPx * scaleCmPerPx;
      
      // Add some realistic variation
      const variation = (Math.random() - 0.5) * 4; // ±2cm variation
      const finalHeight = Math.max(20, Math.min(130, heightCm + variation));
      
      const weightKg = estimateWeightFromHeight(finalHeight);
      const hazResult = calculateHAZ(finalHeight, ageMonths, gender);

      resolve({
        height_cm: finalHeight,
        weight_kg: weightKg,
        haz: hazResult.haz,
        haz_cat: hazResult.category,
        haz_color: hazResult.color,
        scale_cm_per_px: scaleCmPerPx,
        method: "YOLO v8 Pose + MediaPipe",
        landmarks: mockLandmarks
      });
    }, 2000);
  });
}

export function calculateAgeInMonths(birthDate: string): number {
  const birth = new Date(birthDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - birth.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 30.44); // Average days per month
}