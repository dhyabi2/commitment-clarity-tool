import { v4 as uuidv4 } from 'uuid';

export const generateSessionKey = () => {
  return uuidv4();
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