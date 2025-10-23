import { useState, useEffect, useRef } from 'react';
import { OSData, CustomGame } from '@/types/deltaos';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { saveUserData } from '@/utils/storage';
import { toast } from 'sonner';
import { Plus, Trash2, Maximize2, X } from 'lucide-react';

interface GamesAppProps {
  userData: OSData;
}

export const GamesApp = ({ userData }: GamesAppProps) => {
  const [showAddGame, setShowAddGame] = useState(false);
  const [gameName, setGameName] = useState('');
  const [gameCode, setGameCode] = useState('');
  const [selectedGame, setSelectedGame] = useState<CustomGame | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [escapeHoldTime, setEscapeHoldTime] = useState(0);
  const escapeTimerRef = useRef<number | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const addGame = () => {
    if (!gameName || !gameCode) {
      toast.error('Please fill in all fields');
      return;
    }

    const newGame: CustomGame = {
      id: Date.now().toString(),
      name: gameName,
      htmlCode: gameCode,
      createdAt: new Date().toISOString(),
    };

    const updatedData = {
      ...userData,
      customGames: [...(userData.customGames || []), newGame],
    };

    saveUserData(updatedData);
    toast.success('Game added successfully!');
    setGameName('');
    setGameCode('');
    setShowAddGame(false);
  };

  const deleteGame = (id: string) => {
    const updatedData = {
      ...userData,
      customGames: userData.customGames.filter(g => g.id !== id),
    };
    saveUserData(updatedData);
    setSelectedGame(null);
    toast.success('Game deleted');
  };

  useEffect(() => {
    if (!isFullscreen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !escapeTimerRef.current) {
        escapeTimerRef.current = window.setInterval(() => {
          setEscapeHoldTime(prev => {
            const newTime = prev + 100;
            if (newTime >= 2000) {
              exitFullscreen();
              return 0;
            }
            return newTime;
          });
        }, 100);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && escapeTimerRef.current) {
        window.clearInterval(escapeTimerRef.current);
        escapeTimerRef.current = null;
        setEscapeHoldTime(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (escapeTimerRef.current) {
        window.clearInterval(escapeTimerRef.current);
      }
    };
  }, [isFullscreen]);

  const enterFullscreen = () => {
    setIsFullscreen(true);
    if (iframeRef.current) {
      iframeRef.current.requestFullscreen?.();
    }
  };

  const exitFullscreen = () => {
    setIsFullscreen(false);
    setEscapeHoldTime(0);
    if (escapeTimerRef.current) {
      window.clearInterval(escapeTimerRef.current);
      escapeTimerRef.current = null;
    }
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  if (selectedGame) {
    return (
      <div className="h-full flex flex-col relative">
        {/* Compact top bar with controls */}
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
          <Button 
            variant="secondary" 
            size="icon"
            className="h-7 w-7 shadow-lg"
            onClick={enterFullscreen}
            title="Fullscreen"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </Button>
          <Button 
            variant="secondary" 
            size="icon"
            className="h-7 w-7 shadow-lg"
            onClick={() => {
              setSelectedGame(null);
              if (isFullscreen) exitFullscreen();
            }}
            title="Close"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Fullscreen escape indicator */}
        {isFullscreen && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] bg-background/95 backdrop-blur-sm px-6 py-3 rounded-xl border border-border shadow-xl">
            <div className="text-sm font-medium mb-2">Hold ESC to exit fullscreen</div>
            <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-100"
                style={{ width: `${(escapeHoldTime / 2000) * 100}%` }}
              />
            </div>
          </div>
        )}

        <iframe
          ref={iframeRef}
          srcDoc={selectedGame.htmlCode}
          className="flex-1 w-full h-full border-0"
          sandbox="allow-scripts"
        />
      </div>
    );
  }

  if (showAddGame) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Add HTML Game</h2>
          <Button variant="outline" onClick={() => setShowAddGame(false)}>
            Cancel
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gameName">Game Name</Label>
          <Input
            id="gameName"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            placeholder="Enter game name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gameCode">HTML Code</Label>
          <Textarea
            id="gameCode"
            value={gameCode}
            onChange={(e) => setGameCode(e.target.value)}
            placeholder="Paste your HTML game code here..."
            className="h-64 font-mono text-sm"
          />
        </div>

        <Button onClick={addGame} className="w-full">
          Add Game
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Games Library</h2>
        <Button onClick={() => setShowAddGame(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Game
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {userData.customGames?.map((game) => (
          <div
            key={game.id}
            className="p-4 border rounded-lg hover:bg-muted cursor-pointer group relative"
          >
            <div onClick={() => setSelectedGame(game)}>
              <div className="text-4xl mb-2">🎮</div>
              <h3 className="font-semibold">{game.name}</h3>
              <p className="text-xs text-muted-foreground">
                {new Date(game.createdAt).toLocaleDateString()}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                deleteGame(game.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {(!userData.customGames || userData.customGames.length === 0) && (
        <div className="text-center py-12 text-muted-foreground">
          No games added yet. Click "Add Game" to get started!
        </div>
      )}
    </div>
  );
};
