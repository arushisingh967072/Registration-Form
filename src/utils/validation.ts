const disposableDomains = [
  'tempmail.com',
  'throwaway.email',
  'guerrillamail.com',
  '10minutemail.com',
  'mailinator.com',
  'trashmail.com',
  'yopmail.com',
  'temp-mail.org',
  'fakeinbox.com',
  'sharklasers.com',
];

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isDisposableEmail = (email: string): boolean => {
  const domain = email.split('@')[1]?.toLowerCase();
  return disposableDomains.includes(domain);
};
