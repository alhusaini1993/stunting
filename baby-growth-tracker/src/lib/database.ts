import { supabase } from './supabase';
import { Baby, Measurement } from '../types';

export async function createBaby(baby: Omit<Baby, 'id' | 'created_at' | 'updated_at'>): Promise<Baby> {
  const { data, error } = await supabase
    .from('babies')
    .insert([baby])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getBabies(): Promise<Baby[]> {
  const { data, error } = await supabase
    .from('babies')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getBaby(id: string): Promise<Baby | null> {
  const { data, error } = await supabase
    .from('babies')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

export async function updateBaby(id: string, updates: Partial<Baby>): Promise<Baby> {
  const { data, error } = await supabase
    .from('babies')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteBaby(id: string): Promise<void> {
  const { error } = await supabase
    .from('babies')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function createMeasurement(measurement: Omit<Measurement, 'id' | 'created_at'>): Promise<Measurement> {
  const { data, error } = await supabase
    .from('measurements')
    .insert([measurement])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getMeasurements(babyId: string): Promise<Measurement[]> {
  const { data, error } = await supabase
    .from('measurements')
    .select('*')
    .eq('baby_id', babyId)
    .order('measurement_date', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function updateMeasurement(id: string, updates: Partial<Measurement>): Promise<Measurement> {
  const { data, error } = await supabase
    .from('measurements')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteMeasurement(id: string): Promise<void> {
  const { error } = await supabase
    .from('measurements')
    .delete()
    .eq('id', id);

  if (error) throw error;
}