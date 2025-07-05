
import { useState, useEffect } from 'react';

export const useAnonymousMode = () => {
  const [isAnonymous, setIsAnonymous] = useState(() => {
    // Initialize from localStorage immediately
    return localStorage.getItem('anonymousMode') === 'true';
  });

  useEffect(() => {
    const checkAnonymousMode = () => {
      const anonymousMode = localStorage.getItem('anonymousMode') === 'true';
      setIsAnonymous(anonymousMode);
    };

    // Check initially
    checkAnonymousMode();

    // Listen for storage changes
    window.addEventListener('storage', checkAnonymousMode);
    
    // Custom event for same-tab updates
    window.addEventListener('anonymousModeChanged', checkAnonymousMode);

    return () => {
      window.removeEventListener('storage', checkAnonymousMode);
      window.removeEventListener('anonymousModeChanged', checkAnonymousMode);
    };
  }, []);

  const enableAnonymousMode = () => {
    localStorage.setItem('anonymousMode', 'true');
    setIsAnonymous(true);
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new CustomEvent('anonymousModeChanged'));
  };

  const disableAnonymousMode = () => {
    localStorage.removeItem('anonymousMode');
    setIsAnonymous(false);
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new CustomEvent('anonymousModeChanged'));
  };

  return {
    isAnonymous,
    enableAnonymousMode,
    disableAnonymousMode
  };
};
