export interface Baby {
  id: string;
  name: string;
  birth_date: string;
  gender: 'male' | 'female';
  parent_name: string;
  created_at: string;
  updated_at: string;
}

export interface Measurement {
  id: string;
  baby_id: string;
  height_cm: number;
  weight_kg: number;
  age_months: number;
  haz_score: number;
  haz_category: string;
  haz_color: string;
  image_url?: string;
  landmarks_data?: any;
  measurement_date: string;
  notes?: string;
  created_at: string;
}

export interface PredictionResult {
  height_cm: number;
  weight_kg: number;
  haz: number;
  haz_cat: string;
  haz_color: string;
  scale_cm_per_px: number;
  method: string;
  landmarks?: any;
}

export interface WHOData {
  male: { med: number[] };
  female: { med: number[] };
}

export interface StuntingLabel {
  threshold: number;
  label: string;
  color: string;
}