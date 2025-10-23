import { useState, useEffect } from 'react';
import { TermsModal } from '@/components/deltaos/TermsModal';
import { LoginScreen } from '@/components/deltaos/LoginScreen';
import { Desktop } from '@/components/deltaos/Desktop';
import { OSData } from '@/types/deltaos';
import { loadUserData, saveUserData, getDefaultUser } from '@/utils/storage';

const Index = () => {
  const [showTerms, setShowTerms] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<OSData | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('deltaos_terms_accepted');
    if (accepted) {
      setTermsAccepted(true);
      const data = loadUserData();
      if (data) {
        setUserData(data);
        setIsLoggedIn(true);
      }
    } else {
      setShowTerms(true);
    }
  }, []);

  const handleTermsAccept = () => {
    localStorage.setItem('deltaos_terms_accepted', 'true');
    setTermsAccepted(true);
    setShowTerms(false);
  };

  const handleTermsDecline = () => {
    window.location.href = 'https://google.com';
  };

  const handleLogin = (name: string, password: string, timezone: string) => {
    const existingData = loadUserData();
    
    if (existingData) {
      if (existingData.user.password === password) {
        setUserData(existingData);
        setIsLoggedIn(true);
      }
    } else {
      const newUserData: OSData = {
        user: {
          ...getDefaultUser(),
          name,
          password,
          timezone,
        },
        customGames: [],
        chatHistory: [],
        files: [],
      };
      saveUserData(newUserData);
      setUserData(newUserData);
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
  };

  if (showTerms) {
    return (
      <TermsModal
        open={showTerms}
        onAccept={handleTermsAccept}
        onDecline={handleTermsDecline}
      />
    );
  }

  if (!termsAccepted) {
    return null;
  }

  if (!isLoggedIn || !userData) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return <Desktop userData={userData} onLogout={handleLogout} />;
};

export default Index;
