import { WindowState } from '@/types/deltaos';
import { Button } from '@/components/ui/button';
import { Wifi, Volume2, Battery } from 'lucide-react';
import { formatInTimeZone } from 'date-fns-tz';
import { playHoverSound, playClickSound } from '@/utils/sounds';

interface TaskbarProps {
  windows: WindowState[];
  position: 'bottom' | 'left' | 'right';
  onWindowClick: (id: string) => void;
  onPositionChange: (position: 'bottom' | 'left' | 'right') => void;
  currentTime: Date;
  timezone: string;
  onStartClick: () => void;
  taskbarColor: string;
  themeMode: 'dark' | 'light';
}

export const Taskbar = ({
  windows,
  onWindowClick,
  currentTime,
  timezone,
  onStartClick,
  taskbarColor,
  themeMode,
}: TaskbarProps) => {
  const formattedTime = formatInTimeZone(currentTime, timezone, 'h:mm a');
  const formattedDate = formatInTimeZone(currentTime, timezone, 'M/d/yyyy');

  const textColor = themeMode === 'dark' ? '#ffffff' : '#000000';
  const borderColor = themeMode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 h-12 backdrop-blur-3xl flex items-center justify-center px-3 z-50 shadow-lg animate-slide-up"
      style={{
        backgroundColor: taskbarColor + 'cc',
        borderTop: `1px solid ${borderColor}`,
        color: textColor,
      }}
    >
      {/* Start Button */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-1 bg-background/50 backdrop-blur-sm rounded-xl p-1 shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 hover:bg-primary/10 hover:text-primary transition-all duration-200 hover:scale-105"
          onClick={() => {
            playClickSound();
            onStartClick();
          }}
          onMouseEnter={() => playHoverSound()}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M0 0h11v11H0zm13 0h11v11H13zM0 13h11v11H0zm13 0h11v11H13z" />
          </svg>
        </Button>

        {/* Open Windows */}
        {windows.map(window => (
          <Button
            key={window.id}
            variant="ghost"
            size="icon"
            className={`h-9 w-9 relative transition-all duration-200 hover:scale-105 ${
              !window.isMinimized 
                ? 'bg-primary/15 text-primary shadow-sm' 
                : 'hover:bg-muted/60'
            }`}
            onClick={() => {
              playClickSound();
              onWindowClick(window.id);
            }}
            onMouseEnter={() => playHoverSound()}
          >
            <span className="text-lg">{window.icon}</span>
            {!window.isMinimized && (
              <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary shadow-sm animate-pulse-subtle" />
            )}
          </Button>
        ))}
      </div>

      {/* System Tray */}
      <div className="absolute right-2 flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-muted/60 transition-all duration-200 hover:scale-105"
          onMouseEnter={() => playHoverSound()}
        >
          <Wifi className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-muted/60 transition-all duration-200 hover:scale-105"
          onMouseEnter={() => playHoverSound()}
        >
          <Volume2 className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-muted/60 transition-all duration-200 hover:scale-105"
          onMouseEnter={() => playHoverSound()}
        >
          <Battery className="h-4 w-4" />
        </Button>
        
        {/* Clock */}
        <div className="ml-1.5 px-3 text-xs text-center hover:bg-muted/60 rounded-xl py-1.5 cursor-pointer transition-all duration-200 backdrop-blur-sm hover:scale-105">
          <div className="font-bold leading-tight text-[11px]">{formattedTime}</div>
          <div className="text-muted-foreground leading-tight text-[9px]">{formattedDate}</div>
        </div>
      </div>
    </div>
  );
};
