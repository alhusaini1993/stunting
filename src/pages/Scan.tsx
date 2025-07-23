try {
        setIsProcessing(true);
        const result = await detectPoseAndMeasure(
          ageMonths,
          baby.gender as 'male' | 'female'
        );