import { AppDefinition, OSData } from '@/types/deltaos';
import { playClickSound, playHoverSound } from '@/utils/sounds';
import { Search, Power } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState, useMemo } from 'react';

const apps: AppDefinition[] = [
  { id: 'settings', name: 'Settings', icon: '⚙️', component: 'settings' },
  { id: 'calculator', name: 'Calculator', icon: '🔢', component: 'calculator' },
  { id: 'ai', name: 'AI Assistant', icon: '🤖', component: 'ai' },
  { id: 'browser', name: 'Browser', icon: '🌐', component: 'browser' },
  { id: 'games', name: 'Games', icon: '🎮', component: 'games' },
  { id: 'files', name: 'File Explorer', icon: '📁', component: 'files' },
  { id: 'chat', name: 'Chat', icon: '💬', component: 'chat' },
  { id: 'camera', name: 'Camera', icon: '📷', component: 'camera' },
  { id: 'snippet', name: 'Snippet', icon: '✂️', component: 'snippet' },
];

interface StartMenuProps {
  onOpenApp: (id: string, name: string, icon: string, component: string) => void;
  onClose: () => void;
  onLogout: () => void;
  userData: OSData;
}

export const StartMenu = ({ onOpenApp, onClose, onLogout, userData }: StartMenuProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Combine apps and games for search
  const searchResults = useMemo(() => {
    if (!searchQuery) {
      return { apps: apps, games: [] };
    }

    const query = searchQuery.toLowerCase();
    const filteredApps = apps.filter(app =>
      app.name.toLowerCase().includes(query)
    );

    const filteredGames = (userData.customGames || []).map(game => ({
      id: `game-${game.id}`,
      name: game.name,
      icon: '🎮',
      component: 'games',
      gameId: game.id
    })).filter(game =>
      game.name.toLowerCase().includes(query)
    );

    return { apps: filteredApps, games: filteredGames };
  }, [searchQuery, userData.customGames]);

  return (
    <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-[650px] h-[620px] bg-background/98 backdrop-blur-3xl rounded-2xl border border-border/60 shadow-2xl overflow-hidden animate-scale-in-bounce">
      {/* Search Bar */}
      <div className="p-6 border-b border-border/50 bg-muted/20 animate-fade-in">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search apps and games..."
            className="pl-11 bg-background/60 border-border/40 h-11 rounded-xl focus-visible:ring-primary transition-all duration-200"
            autoFocus
          />
        </div>
      </div>

      {/* Results */}
      <div className="p-6 overflow-y-auto h-[calc(100%-160px)] custom-scrollbar">
        {!searchQuery && (
          <>
            <h3 className="text-sm font-bold text-muted-foreground mb-4 uppercase tracking-wide animate-fade-in">Pinned Apps</h3>
            <div className="grid grid-cols-4 gap-3">
              {apps.map((app, index) => (
                <button
                  key={app.id}
                  onClick={() => {
                    playClickSound();
                    onOpenApp(app.id, app.name, app.icon, app.component);
                    onClose();
                  }}
                  onMouseEnter={() => playHoverSound()}
                  className="flex flex-col items-center justify-center p-4 rounded-xl bg-background/40 hover:bg-background/60 border border-border/30 transition-all duration-200 hover:scale-105 hover:shadow-lg backdrop-blur-md shadow-sm animate-fade-in-up group"
                  style={{ animationDelay: `${index * 0.03}s` }}
                >
                  <span className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-200">{app.icon}</span>
                  <span className="text-xs text-center font-medium text-foreground">{app.name}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {searchQuery && (
          <>
            {searchResults.apps.length > 0 && (
              <div className="mb-6 animate-fade-in">
                <h3 className="text-sm font-bold text-muted-foreground mb-3 uppercase tracking-wide flex items-center gap-2">
                  <span className="inline-block w-1 h-4 bg-primary rounded-full"></span>
                  Apps
                  <span className="text-xs font-normal ml-1 bg-primary/10 text-primary px-2 py-0.5 rounded-full">{searchResults.apps.length}</span>
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {searchResults.apps.map((app, index) => (
                    <button
                      key={app.id}
                      onClick={() => {
                        playClickSound();
                        onOpenApp(app.id, app.name, app.icon, app.component);
                        onClose();
                      }}
                      onMouseEnter={() => playHoverSound()}
                      className="flex flex-col items-center justify-center p-4 rounded-xl bg-background/40 hover:bg-background/60 border border-border/30 transition-all duration-200 hover:scale-105 hover:shadow-lg backdrop-blur-md shadow-sm animate-fade-in-up group"
                      style={{ animationDelay: `${index * 0.03}s` }}
                    >
                      <span className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-200">{app.icon}</span>
                      <span className="text-xs text-center font-medium text-foreground">{app.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {searchResults.games.length > 0 && (
              <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <h3 className="text-sm font-bold text-muted-foreground mb-3 uppercase tracking-wide flex items-center gap-2">
                  <span className="inline-block w-1 h-4 bg-primary rounded-full"></span>
                  Games
                  <span className="text-xs font-normal ml-1 bg-primary/10 text-primary px-2 py-0.5 rounded-full">{searchResults.games.length}</span>
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {searchResults.games.map((game, index) => (
                    <button
                      key={game.id}
                      onClick={() => {
                        playClickSound();
                        onOpenApp(game.id, game.name, game.icon, game.component);
                        onClose();
                      }}
                      onMouseEnter={() => playHoverSound()}
                      className="flex flex-col items-center justify-center p-4 rounded-xl bg-background/40 hover:bg-background/60 border border-border/30 transition-all duration-200 hover:scale-105 hover:shadow-lg backdrop-blur-md shadow-sm animate-fade-in-up group"
                      style={{ animationDelay: `${index * 0.03}s` }}
                    >
                      <span className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-200">{game.icon}</span>
                      <span className="text-xs text-center font-medium text-foreground">{game.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {searchResults.apps.length === 0 && searchResults.games.length === 0 && (
              <div className="text-center py-12 text-muted-foreground animate-fade-in">
                <div className="text-4xl mb-3">🔍</div>
                <div className="font-medium">No results found</div>
                <div className="text-sm mt-1">Try searching for "{searchQuery}"</div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-border/50 bg-background/70 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary via-primary to-primary/80 flex items-center justify-center text-primary-foreground font-bold text-lg shadow-md">
              {userData.user.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-semibold">{userData.user.name}</span>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onLogout();
            }}
            className="p-2.5 rounded-xl hover:bg-destructive/20 transition-all duration-200 group"
            onMouseEnter={() => playHoverSound()}
          >
            <Power className="h-5 w-5 text-destructive group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
