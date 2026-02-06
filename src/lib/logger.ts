/**
 * Safe logging utility for production environments
 * Prevents sensitive data from being logged to console
 */

const isDevelopment = import.meta.env.DEV;

export const logger = {
  error: (message: string, error?: unknown) => {
    if (isDevelopment) {
      console.error(message, error);
    }
    // In production, only log generic messages without error details
  },
  
  warn: (message: string) => {
    if (isDevelopment) {
      console.warn(message);
    }
  },
  
  info: (message: string) => {
    if (isDevelopment) {
      console.info(message);
    }
  },
};
