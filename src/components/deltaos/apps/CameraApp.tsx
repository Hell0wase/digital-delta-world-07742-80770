import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';

export const CameraApp = () => {
  const [image, setImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        setImage(canvas.toDataURL('image/png'));
      }
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Camera</h2>
      
      {!isStreaming && !image && (
        <Button onClick={startCamera} className="w-full">
          <Camera className="h-4 w-4 mr-2" />
          Start Camera
        </Button>
      )}

      {isStreaming && (
        <div className="space-y-4">
          <video ref={videoRef} autoPlay className="w-full rounded-lg" />
          <Button onClick={captureImage} className="w-full">
            Capture Photo
          </Button>
        </div>
      )}

      {image && (
        <div className="space-y-4">
          <img src={image} alt="Captured" className="w-full rounded-lg" />
          <Button onClick={() => setImage(null)} className="w-full">
            Take Another
          </Button>
        </div>
      )}
    </div>
  );
};
