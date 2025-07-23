@@ .. @@
 // Simulate pose detection (in real app, this would use actual ML models)
 export async function detectPoseAndMeasure(
-  imageFile: File,
   ageMonths: number,
   gender: 'male' | 'female',
   scaleCmPerPx: number = 0.1
 ): Promise<PredictionResult> {