import { v4 as uuidv4 } from 'uuid';

export const generateSessionKey = () => {
  return uuidv4();
};

export const setSession = (sessionKey: string, email: string) => {
  localStorage.setItem('sessionKey', sessionKey);
  localStorage.setItem('userEmail', email);
  // Set session timestamp
  localStorage.setItem('sessionTimestamp', new Date().toISOString());
};

export const getSessionKey = () => {
  return localStorage.getItem('sessionKey');
};

export const getUserEmail = () => {
  return localStorage.getItem('userEmail');
};

export const clearSession = () => {
  localStorage.removeItem('sessionKey');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('sessionTimestamp');
};

export const hasValidSession = () => {
  const sessionKey = getSessionKey();
  const userEmail = getUserEmail();
  const timestamp = localStorage.getItem('sessionTimestamp');
  
  if (!sessionKey || !userEmail || !timestamp) return false;
  
  // Check if session is within 30 days
  const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
  const sessionDate = new Date(timestamp).getTime();
  const now = new Date().getTime();
  
  return (now - sessionDate) < thirtyDaysInMs;
};