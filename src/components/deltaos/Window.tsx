import { useState, useRef, useEffect } from 'react';
import { WindowState, OSData } from '@/types/deltaos';
import { X, Minus, Maximize2 } from 'lucide-react';
import { SettingsApp } from './apps/SettingsApp';
import { CalculatorApp } from './apps/CalculatorApp';
import { AIApp } from './apps/AIApp';
import { BrowserApp } from './apps/BrowserApp';
import { GamesApp } from './apps/GamesApp';
import { FileExplorerApp } from './apps/FileExplorerApp';
import { ChatApp } from './apps/ChatApp';
import { CameraApp } from './apps/CameraApp';
import { SnippetApp } from './apps/SnippetApp';

interface WindowProps {
  window: WindowState;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  onUpdatePosition: (id: string, position: { x: number; y: number }) => void;
  onUpdateSize: (id: string, size: { width: number; height: number }) => void;
  userData: OSData;
  roundedCorners: boolean;
  themeMode: 'dark' | 'light';
}

export const Window = ({
  window: win,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onUpdatePosition,
  onUpdateSize,
  userData,
  roundedCorners,
  themeMode,
}: WindowProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !win.isMaximized) {
        onUpdatePosition(win.id, {
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, win.id, win.isMaximized, onUpdatePosition]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (win.isMaximized) return;
    const rect = windowRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
      onFocus(win.id);
    }
  };

  const renderApp = () => {
    switch (win.component) {
      case 'settings':
        return <SettingsApp userData={userData} />;
      case 'calculator':
        return <CalculatorApp themeMode={themeMode} />;
      case 'ai':
        return <AIApp />;
      case 'browser':
        return <BrowserApp />;
      case 'games':
        return <GamesApp userData={userData} />;
      case 'files':
        return <FileExplorerApp userData={userData} />;
      case 'chat':
        return <ChatApp userData={userData} />;
      case 'camera':
        return <CameraApp />;
      case 'snippet':
        return <SnippetApp />;
      default:
        return <div className="p-4">App not found</div>;
    }
  };

  if (win.isMinimized) return null;

  const style = win.isMaximized
    ? { top: 0, left: 0, width: '100%', height: 'calc(100% - 48px)', borderRadius: 0 }
    : {
        top: win.position.y,
        left: win.position.x,
        width: win.size.width,
        height: win.size.height,
        borderRadius: roundedCorners ? '12px' : '0px',
      };

  const windowBg = themeMode === 'dark' ? '#1a1a2e' : '#ffffff';
  const windowText = themeMode === 'dark' ? '#ffffff' : '#000000';
  const borderColor = themeMode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const titleBarBg = themeMode === 'dark' ? 'rgba(26,26,46,0.8)' : 'rgba(255,255,255,0.8)';

  return (
    <div
      ref={windowRef}
      className="absolute backdrop-blur-2xl shadow-2xl overflow-hidden animate-scale-in"
      style={{
        ...style,
        zIndex: win.zIndex,
        backgroundColor: windowBg,
        color: windowText,
        border: `1px solid ${borderColor}`,
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}
      onMouseDown={() => onFocus(win.id)}
    >
      {/* Title Bar */}
      <div
        className="h-8 backdrop-blur-xl flex items-center justify-between px-3 cursor-move"
        style={{
          backgroundColor: titleBarBg,
          borderBottom: `1px solid ${borderColor}`,
          color: windowText,
        }}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <span className="text-base">{win.icon}</span>
          <span className="text-xs font-medium">{win.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onMinimize(win.id)}
            className="w-8 h-6 flex items-center justify-center rounded transition-colors"
            style={{
              color: windowText,
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = themeMode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            aria-label="Minimize"
          >
            <div className="w-3 h-0.5" style={{ backgroundColor: windowText }} />
          </button>
          <button
            onClick={() => onMaximize(win.id)}
            className="w-8 h-6 flex items-center justify-center rounded transition-colors"
            style={{
              color: windowText,
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = themeMode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            aria-label="Maximize"
          >
            <div className="w-3 h-3" style={{ border: `1px solid ${windowText}` }} />
          </button>
          <button
            onClick={() => onClose(win.id)}
            className="w-8 h-6 flex items-center justify-center rounded transition-colors"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#ef4444';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = windowText;
            }}
            style={{
              color: windowText,
            }}
            aria-label="Close"
          >
            <span className="text-lg leading-none">×</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="h-[calc(100%-2rem)] overflow-auto" style={{ backgroundColor: windowBg, color: windowText }}>
        {renderApp()}
      </div>
    </div>
  );
};
