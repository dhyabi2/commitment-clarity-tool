export const getSessionHeaders = () => {
  const email = localStorage.getItem('userEmail');
  const sessionKey = localStorage.getItem('sessionKey');
  const mobileNumber = localStorage.getItem('userMobileNumber');

  if (!email || !sessionKey || !mobileNumber) {
    return null;
  }

  return {
    'request.user_email': email,
    'request.session_key': sessionKey,
    'request.mobile_number': mobileNumber,
  };
};

export const clearSession = () => {
  localStorage.removeItem('userEmail');
  localStorage.removeItem('sessionKey');
  localStorage.removeItem('userMobileNumber');
};

export const setSession = (email: string, sessionKey: string, mobileNumber: string) => {
  localStorage.setItem('userEmail', email);
  localStorage.setItem('sessionKey', sessionKey);
  localStorage.setItem('userMobileNumber', mobileNumber);
};