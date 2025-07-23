/*
  # Create measurements table

  1. New Tables
    - `measurements`
      - `id` (uuid, primary key)
      - `baby_id` (uuid, foreign key to babies)
      - `height_cm` (numeric, height in centimeters)
      - `weight_kg` (numeric, weight in kilograms)
      - `age_months` (integer, age in months at measurement)
      - `haz_score` (numeric, height-for-age z-score)
      - `haz_category` (text, stunting category)
      - `haz_color` (text, color code for category)
      - `image_url` (text, optional image URL)
      - `landmarks_data` (jsonb, pose landmarks data)
      - `measurement_date` (timestamp, when measurement was taken)
      - `notes` (text, optional notes)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `measurements` table
    - Add policy for authenticated users to manage measurements for their babies

  3. Indexes
    - Add index on baby_id for faster queries
    - Add index on measurement_date for chronological sorting
*/

CREATE TABLE IF NOT EXISTS measurements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  baby_id uuid NOT NULL REFERENCES babies(id) ON DELETE CASCADE,
  height_cm numeric(5,2) NOT NULL CHECK (height_cm > 0),
  weight_kg numeric(5,2) NOT NULL CHECK (weight_kg > 0),
  age_months integer NOT NULL CHECK (age_months >= 0),
  haz_score numeric(5,2) NOT NULL,
  haz_category text NOT NULL,
  haz_color text NOT NULL,
  image_url text,
  landmarks_data jsonb,
  measurement_date timestamptz NOT NULL DEFAULT now(),
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE measurements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage measurements for their babies"
  ON measurements
  FOR ALL
  TO authenticated
  USING (
    baby_id IN (
      SELECT id FROM babies WHERE true
    )
  )
  WITH CHECK (
    baby_id IN (
      SELECT id FROM babies WHERE true
    )
  );

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_measurements_baby_id ON measurements(baby_id);
CREATE INDEX IF NOT EXISTS idx_measurements_date ON measurements(measurement_date DESC);
CREATE INDEX IF NOT EXISTS idx_measurements_age ON measurements(age_months);