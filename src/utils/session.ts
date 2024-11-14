import { v4 as uuidv4 } from 'uuid';

export const generateSessionKey = () => {
  return uuidv4();
};

export const setSession = (sessionKey: string, email: string) => {
  localStorage.setItem('sessionKey', sessionKey);
  localStorage.setItem('userEmail', email);
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
};

export const hasValidSession = () => {
  const sessionKey = getSessionKey();
  const userEmail = getUserEmail();
  return !!sessionKey && !!userEmail;
};