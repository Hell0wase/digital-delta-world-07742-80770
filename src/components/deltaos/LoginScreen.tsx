import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, KeyRound } from 'lucide-react';
import { importData, loadUserData } from '@/utils/storage';
import { toast } from 'sonner';

const TIMEZONES = [
  'UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
  'America/Toronto', 'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Madrid',
  'Asia/Tokyo', 'Asia/Shanghai', 'Asia/Dubai', 'Australia/Sydney', 'Pacific/Auckland'
];

interface LoginScreenProps {
  onLogin: (name: string, password: string, timezone: string) => void;
}

export const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [timezone, setTimezone] = useState('UTC');
  const [isSignUp, setIsSignUp] = useState(true);
  const [pin, setPin] = useState('');
  const [usePinLogin, setUsePinLogin] = useState(false);
  const [pinLength, setPinLength] = useState<4 | 6>(4);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if user has PIN enabled on mount
  useEffect(() => {
    const userData = loadUserData();
    if (userData?.user.settings.pinEnabled && userData.user.settings.pin) {
      setUsePinLogin(true);
      setPinLength(userData.user.settings.pinLength);
      setName(userData.user.name);
      setTimezone(userData.user.timezone);
      setIsSignUp(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (usePinLogin) {
      // PIN Login
      if (!pin || pin.length !== pinLength) {
        toast.error(`Please enter your ${pinLength}-digit PIN`);
        return;
      }
      
      const userData = loadUserData();
      if (!userData || userData.user.settings.pin !== pin) {
        toast.error('Invalid PIN');
        setPin('');
        return;
      }
      
      onLogin(userData.user.name, userData.user.password, userData.user.timezone);
    } else {
      // Regular Login
      if (name && password && timezone) {
        onLogin(name, password, timezone);
      }
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await importData(file);
      toast.success('Data imported successfully!');
      onLogin(data.user.name, data.user.password, data.user.timezone);
    } catch (error) {
      toast.error('Failed to import data. Please check the file format.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      background: 'linear-gradient(135deg, #FF6B35 0%, #004E89 100%)'
    }}>
      <Button
        variant="outline"
        size="icon"
        className="absolute top-4 right-4"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="h-4 w-4" />
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleImport}
      />
      
      <Card className="w-full max-w-md animate-scale-in">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Delta OS</CardTitle>
          <CardDescription>v8.0.0.0</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {usePinLogin ? (
              <>
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
                    <KeyRound className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Welcome back, {name}</h3>
                    <p className="text-sm text-muted-foreground">Enter your {pinLength}-digit PIN</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Input
                    type="password"
                    inputMode="numeric"
                    pattern="\d*"
                    maxLength={pinLength}
                    value={pin}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setPin(value);
                      if (value.length === pinLength) {
                        // Auto-submit when PIN is complete
                        setTimeout(() => {
                          const form = e.target.form;
                          form?.requestSubmit();
                        }, 100);
                      }
                    }}
                    placeholder={'••••••'.slice(0, pinLength)}
                    className="text-center text-3xl tracking-[1em] font-bold"
                    autoFocus
                  />
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setUsePinLogin(false);
                    setPin('');
                    setName('');
                  }}
                >
                  Use Password Instead
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMEZONES.map((tz) => (
                        <SelectItem key={tz} value={tz}>
                          {tz}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button type="submit" className="w-full">
                  {isSignUp ? 'Sign Up' : 'Login'}
                </Button>
                
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => setIsSignUp(!isSignUp)}
                >
                  {isSignUp ? 'Already have an account? Login' : 'Need an account? Sign Up'}
                </Button>
              </>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
