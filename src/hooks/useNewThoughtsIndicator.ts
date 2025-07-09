import { useState, useEffect } from 'react';
import { useAnonymousMode } from './useAnonymousMode';
import { useThoughtsQuery } from './useThoughtsQuery';
import { useDeviceThoughtsQuery } from './useDeviceThoughtsQuery';

export const useNewThoughtsIndicator = () => {
  const [hasNewThoughts, setHasNewThoughts] = useState(false);
  const [lastSeenCount, setLastSeenCount] = useState<number>(0);
  const { isAnonymous } = useAnonymousMode();
  
  const { data: userThoughts } = useThoughtsQuery(null);
  const { data: deviceThoughts } = useDeviceThoughtsQuery(null);
  
  const thoughts = isAnonymous ? deviceThoughts : userThoughts;
  const currentCount = thoughts?.length || 0;

  useEffect(() => {
    // Get last seen count from localStorage
    const storageKey = isAnonymous ? 'lastSeenThoughtsCount_device' : 'lastSeenThoughtsCount_user';
    const stored = localStorage.getItem(storageKey);
    const storedCount = stored ? parseInt(stored, 10) : 0;
    
    setLastSeenCount(storedCount);
    
    // Check if there are new thoughts
    if (currentCount > storedCount) {
      setHasNewThoughts(true);
    }
  }, [currentCount, isAnonymous]);

  const markAsViewed = () => {
    const storageKey = isAnonymous ? 'lastSeenThoughtsCount_device' : 'lastSeenThoughtsCount_user';
    localStorage.setItem(storageKey, currentCount.toString());
    setLastSeenCount(currentCount);
    setHasNewThoughts(false);
  };

  return {
    hasNewThoughts,
    markAsViewed,
    thoughtsCount: currentCount
  };
};