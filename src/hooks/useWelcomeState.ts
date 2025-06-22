
import { useState, useEffect } from 'react';

const WELCOME_COMPLETED_KEY = 'mind-garden-welcome-completed';

export const useWelcomeState = () => {
  const [hasSeenWelcome, setHasSeenWelcome] = useState<boolean | null>(null);

  useEffect(() => {
    const completed = localStorage.getItem(WELCOME_COMPLETED_KEY);
    setHasSeenWelcome(completed === 'true');
  }, []);

  const markWelcomeAsCompleted = () => {
    localStorage.setItem(WELCOME_COMPLETED_KEY, 'true');
    setHasSeenWelcome(true);
  };

  const resetWelcome = () => {
    localStorage.removeItem(WELCOME_COMPLETED_KEY);
    setHasSeenWelcome(false);
  };

  return {
    hasSeenWelcome,
    markWelcomeAsCompleted,
    resetWelcome
  };
};
