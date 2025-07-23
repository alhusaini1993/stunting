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