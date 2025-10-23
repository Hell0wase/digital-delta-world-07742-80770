import { OSData } from '@/types/deltaos';
import { Folder, File } from 'lucide-react';

interface FileExplorerAppProps {
  userData: OSData;
}

export const FileExplorerApp = ({ userData }: FileExplorerAppProps) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">File Explorer</h2>
      <div className="space-y-2">
        <div className="flex items-center gap-2 p-3 hover:bg-muted rounded-lg cursor-pointer">
          <Folder className="h-5 w-5" />
          <span>Documents</span>
        </div>
        <div className="flex items-center gap-2 p-3 hover:bg-muted rounded-lg cursor-pointer">
          <Folder className="h-5 w-5" />
          <span>Downloads</span>
        </div>
        <div className="flex items-center gap-2 p-3 hover:bg-muted rounded-lg cursor-pointer">
          <Folder className="h-5 w-5" />
          <span>Pictures</span>
        </div>
        <div className="flex items-center gap-2 p-3 hover:bg-muted rounded-lg cursor-pointer">
          <File className="h-5 w-5" />
          <span>Welcome.txt</span>
        </div>
      </div>
    </div>
  );
};
