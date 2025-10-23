import { useState, useEffect } from 'react';
import { Taskbar } from './Taskbar';
import { Window } from './Window';
import { StartMenu } from './StartMenu';
import { WindowState, OSData } from '@/types/deltaos';
import { saveUserData, loadUserData } from '@/utils/storage';
import { toast } from 'sonner';

interface DesktopProps {
  userData: OSData;
  onLogout: () => void;
}

export const Desktop = ({ userData: initialUserData, onLogout }: DesktopProps) => {
  const [userData, setUserData] = useState(initialUserData);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [maxZIndex, setMaxZIndex] = useState(1);
  const [taskbarPosition, setTaskbarPosition] = useState<'bottom' | 'left' | 'right'>('bottom');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showStartMenu, setShowStartMenu] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      // Reload userData from localStorage to sync changes
      const latest = loadUserData();
      if (latest) {
        setUserData(latest);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const openWindow = (appId: string, appName: string, appIcon: string, component: string) => {
    const existingWindow = windows.find(w => w.id === appId);
    if (existingWindow) {
      bringToFront(appId);
      if (existingWindow.isMinimized) {
        toggleMinimize(appId);
      }
      return;
    }

    const newWindow: WindowState = {
      id: appId,
      title: appName,
      icon: appIcon,
      component,
      isMinimized: false,
      isMaximized: false,
      position: { x: 100 + windows.length * 30, y: 100 + windows.length * 30 },
      size: { width: 800, height: 600 },
      zIndex: maxZIndex + 1,
    };

    setWindows([...windows, newWindow]);
    setMaxZIndex(maxZIndex + 1);
  };

  const closeWindow = (id: string) => {
    setWindows(windows.filter(w => w.id !== id));
  };

  const toggleMinimize = (id: string) => {
    setWindows(windows.map(w =>
      w.id === id ? { ...w, isMinimized: !w.isMinimized } : w
    ));
  };

  const toggleMaximize = (id: string) => {
    setWindows(windows.map(w =>
      w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
    ));
  };

  const bringToFront = (id: string) => {
    const newZIndex = maxZIndex + 1;
    setWindows(windows.map(w =>
      w.id === id ? { ...w, zIndex: newZIndex } : w
    ));
    setMaxZIndex(newZIndex);
  };

  const updatePosition = (id: string, position: { x: number; y: number }) => {
    setWindows(windows.map(w =>
      w.id === id ? { ...w, position } : w
    ));
  };

  const updateSize = (id: string, size: { width: number; height: number }) => {
    setWindows(windows.map(w =>
      w.id === id ? { ...w, size } : w
    ));
  };

  return (
    <div 
      className="h-screen w-screen overflow-hidden relative"
      style={{
        backgroundColor: userData.user.settings.backgroundColor,
        backgroundImage: userData.user.settings.backgroundImage 
          ? `url(${userData.user.settings.backgroundImage})`
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      onClick={() => showStartMenu && setShowStartMenu(false)}
    >
      {windows.map(window => (
        <Window
          key={window.id}
          window={window}
          onClose={closeWindow}
          onMinimize={toggleMinimize}
          onMaximize={toggleMaximize}
          onFocus={bringToFront}
          onUpdatePosition={updatePosition}
          onUpdateSize={updateSize}
          userData={userData}
          roundedCorners={userData.user.settings.roundedCorners}
          themeMode={userData.user.settings.themeMode}
        />
      ))}

      {showStartMenu && (
        <StartMenu
          onOpenApp={openWindow}
          onClose={() => setShowStartMenu(false)}
          onLogout={onLogout}
          userData={userData}
        />
      )}

      <Taskbar
        windows={windows}
        position={taskbarPosition}
        onWindowClick={(id) => {
          const window = windows.find(w => w.id === id);
          if (window?.isMinimized) {
            toggleMinimize(id);
          }
          bringToFront(id);
        }}
        onPositionChange={setTaskbarPosition}
        currentTime={currentTime}
        timezone={userData.user.timezone}
        onStartClick={() => setShowStartMenu(!showStartMenu)}
        taskbarColor={userData.user.settings.taskbarColor}
        themeMode={userData.user.settings.themeMode}
      />
    </div>
  );
};
