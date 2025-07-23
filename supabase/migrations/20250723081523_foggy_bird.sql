/*
  # Create babies table

  1. New Tables
    - `babies`
      - `id` (uuid, primary key)
      - `name` (text, baby's name)
      - `birth_date` (date, birth date)
      - `gender` (text, male/female)
      - `parent_name` (text, parent's name)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `babies` table
    - Add policy for authenticated users to manage their own babies
*/

CREATE TABLE IF NOT EXISTS babies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  birth_date date NOT NULL,
  gender text NOT NULL CHECK (gender IN ('male', 'female')),
  parent_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE babies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own babies"
  ON babies
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);