import { useState } from 'react';
import { OSData } from '@/types/deltaos';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { saveUserData } from '@/utils/storage';
import { toast } from 'sonner';

interface SettingsAppProps {
  userData: OSData;
}

export const SettingsApp = ({ userData }: SettingsAppProps) => {
  const [settings, setSettings] = useState(userData.user.settings);
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');

  const handleSave = () => {
    // Validate PIN if enabled
    if (settings.pinEnabled) {
      if (!pin) {
        toast.error('Please enter a PIN');
        return;
      }
      if (pin.length !== settings.pinLength) {
        toast.error(`PIN must be ${settings.pinLength} digits`);
        return;
      }
      if (!/^\d+$/.test(pin)) {
        toast.error('PIN must contain only numbers');
        return;
      }
    }

    const updatedData = {
      ...userData,
      user: {
        ...userData.user,
        settings: {
          ...settings,
          ...(settings.pinEnabled && pin && { pin }),
        },
        ...(password && { password }),
      },
    };
    saveUserData(updatedData);
    toast.success('Settings saved! Refresh to see changes.');
    // Force reload to apply settings
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const applyThemePreset = (mode: 'dark' | 'light') => {
    const presets = {
      dark: {
        backgroundColor: '#1a1a2e',
        taskbarColor: '#0a0a0f',
      },
      light: {
        backgroundColor: '#f0f4f8',
        taskbarColor: '#ffffff',
      },
    };
    
    setSettings({
      ...settings,
      themeMode: mode,
      backgroundColor: presets[mode].backgroundColor,
      taskbarColor: presets[mode].taskbarColor,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setSettings({
        ...settings,
        backgroundImage: event.target?.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-8 space-y-8 max-w-2xl mx-auto">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Settings</h2>
        <p className="text-sm text-muted-foreground">Version: v8.0.0.0</p>
      </div>

      <div className="space-y-6 bg-muted/30 rounded-xl p-6">
        <div className="space-y-2">
          <Label htmlFor="themeMode">Theme Mode</Label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={settings.themeMode === 'dark' ? 'default' : 'outline'}
              onClick={() => applyThemePreset('dark')}
              className="flex-1"
            >
              🌙 Dark
            </Button>
            <Button
              type="button"
              variant={settings.themeMode === 'light' ? 'default' : 'outline'}
              onClick={() => applyThemePreset('light')}
              className="flex-1"
            >
              ☀️ Light
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            This will update background and taskbar colors
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fontSize">Font Size ({settings.fontSize}px)</Label>
          <Input
            id="fontSize"
            type="range"
            min="10"
            max="24"
            value={settings.fontSize}
            onChange={(e) => setSettings({ ...settings, fontSize: parseInt(e.target.value) })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="zoom">Screen Zoom ({settings.zoom}%)</Label>
          <Input
            id="zoom"
            type="range"
            min="75"
            max="150"
            step="25"
            value={settings.zoom}
            onChange={(e) => setSettings({ ...settings, zoom: parseInt(e.target.value) })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bgColor">Background Color</Label>
          <Input
            id="bgColor"
            type="color"
            value={settings.backgroundColor}
            onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="taskbarColor">Taskbar Color</Label>
          <Input
            id="taskbarColor"
            type="color"
            value={settings.taskbarColor}
            onChange={(e) => setSettings({ ...settings, taskbarColor: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bgImage">Background Image</Label>
          <Input
            id="bgImage"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
          {settings.backgroundImage && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSettings({ ...settings, backgroundImage: undefined })}
            >
              Remove Image
            </Button>
          )}
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="roundedCorners">Rounded Corners</Label>
          <Switch
            id="roundedCorners"
            checked={settings.roundedCorners}
            onCheckedChange={(checked) => setSettings({ ...settings, roundedCorners: checked })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Change Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
          />
        </div>
      </div>

      <div className="space-y-6 bg-muted/30 rounded-xl p-6">
        <h3 className="text-xl font-semibold">Security Settings</h3>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="pinEnabled">Enable PIN Login</Label>
            <p className="text-xs text-muted-foreground">
              Use a PIN instead of password for quick login
            </p>
          </div>
          <Switch
            id="pinEnabled"
            checked={settings.pinEnabled}
            onCheckedChange={(checked) => {
              setSettings({ ...settings, pinEnabled: checked });
              if (!checked) {
                setPin('');
              }
            }}
          />
        </div>

        {settings.pinEnabled && (
          <>
            <div className="space-y-2">
              <Label htmlFor="pinLength">PIN Length</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={settings.pinLength === 4 ? 'default' : 'outline'}
                  onClick={() => {
                    setSettings({ ...settings, pinLength: 4 });
                    setPin('');
                  }}
                  className="flex-1"
                >
                  4 Digits
                </Button>
                <Button
                  type="button"
                  variant={settings.pinLength === 6 ? 'default' : 'outline'}
                  onClick={() => {
                    setSettings({ ...settings, pinLength: 6 });
                    setPin('');
                  }}
                  className="flex-1"
                >
                  6 Digits
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pin">Set PIN ({settings.pinLength} digits)</Label>
              <Input
                id="pin"
                type="password"
                inputMode="numeric"
                pattern="\d*"
                maxLength={settings.pinLength}
                value={pin}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setPin(value);
                }}
                placeholder={`Enter ${settings.pinLength}-digit PIN`}
                className="text-center text-2xl tracking-widest"
              />
              <p className="text-xs text-muted-foreground">
                {userData.user.settings.pin ? 'Leave empty to keep current PIN' : 'Required when PIN login is enabled'}
              </p>
            </div>
          </>
        )}

        <Button onClick={handleSave} className="w-full">
          Save Settings
        </Button>
      </div>
    </div>
  );
};
