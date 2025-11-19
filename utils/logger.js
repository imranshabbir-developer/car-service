// Production-safe logging utility
const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  log: (...args) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  error: (...args) => {
    // Always log errors, but in production, you might want to send to error tracking service
    if (isDevelopment) {
      console.error(...args);
    } else {
      // In production, you could send to error tracking service (e.g., Sentry)
      // For now, we'll still log critical errors
      console.error(...args);
    }
  },
  warn: (...args) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  debug: (...args) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },
};

