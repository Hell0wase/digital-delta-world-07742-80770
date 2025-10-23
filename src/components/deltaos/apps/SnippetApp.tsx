import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Scissors } from 'lucide-react';
import { toast } from 'sonner';

export const SnippetApp = () => {
  const [screenshot, setScreenshot] = useState<string | null>(null);

  const captureScreenshot = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true
      } as any);
      
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      video.onloadedmetadata = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0);
          setScreenshot(canvas.toDataURL('image/png'));
          
          stream.getTracks().forEach(track => track.stop());
          toast.success('Screenshot captured!');
        }
      };
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      toast.error('Failed to capture screenshot');
    }
  };

  const downloadScreenshot = () => {
    if (!screenshot) return;
    
    const a = document.createElement('a');
    a.href = screenshot;
    a.download = `screenshot-${Date.now()}.png`;
    a.click();
    toast.success('Screenshot downloaded!');
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Snippet Tool</h2>
      <p className="text-sm text-muted-foreground">
        Capture screenshots of your screen
      </p>

      <Button onClick={captureScreenshot} className="w-full">
        <Scissors className="h-4 w-4 mr-2" />
        Capture Screenshot
      </Button>

      {screenshot && (
        <div className="space-y-4">
          <img src={screenshot} alt="Screenshot" className="w-full rounded-lg border" />
          <div className="flex gap-2">
            <Button onClick={downloadScreenshot} className="flex-1">
              Download
            </Button>
            <Button onClick={() => setScreenshot(null)} variant="outline" className="flex-1">
              Clear
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
