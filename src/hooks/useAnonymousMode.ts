
import { useState, useEffect } from 'react';

export const useAnonymousMode = () => {
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    const anonymousMode = localStorage.getItem('anonymousMode') === 'true';
    setIsAnonymous(anonymousMode);
  }, []);

  const enableAnonymousMode = () => {
    localStorage.setItem('anonymousMode', 'true');
    setIsAnonymous(true);
  };

  const disableAnonymousMode = () => {
    localStorage.removeItem('anonymousMode');
    setIsAnonymous(false);
  };

  return {
    isAnonymous,
    enableAnonymousMode,
    disableAnonymousMode
  };
};
