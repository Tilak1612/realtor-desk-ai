/**
 * Error Monitoring and Logging System
 * Tracks errors, API failures, and user actions for debugging
 */
import * as Sentry from '@sentry/react';

export interface ErrorLog {
  timestamp: Date;
  type: 'error' | 'warning' | 'info';
  category: string;
  message: string;
  details?: unknown;
  userId?: string;
  userEmail?: string;
  url?: string;
  userAgent?: string;
}

export interface APILog {
  timestamp: Date;
  endpoint: string;
  method: string;
  statusCode?: number;
  duration?: number;
  error?: string;
  userId?: string;
}

class ErrorMonitor {
  private errors: ErrorLog[] = [];
  private apiLogs: APILog[] = [];
  private maxLogs = 500; // Keep last 500 logs in memory

  /**
   * Log an error with context
   */
  logError(
    category: string,
    message: string,
    details?: unknown,
    userId?: string,
    userEmail?: string
  ): void {
    const errorLog: ErrorLog = {
      timestamp: new Date(),
      type: 'error',
      category,
      message,
      details,
      userId,
      userEmail,
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    this.errors.push(errorLog);
    this.trimLogs();

    // Console log in development
    if (import.meta.env.DEV) {
      console.error(`[${category}] ${message}`, details);
    }

    // In production, you could send to an external service
    this.sendToMonitoringService(errorLog);
  }

  /**
   * Log a warning
   */
  logWarning(
    category: string,
    message: string,
    details?: unknown,
    userId?: string
  ): void {
    const warningLog: ErrorLog = {
      timestamp: new Date(),
      type: 'warning',
      category,
      message,
      details,
      userId,
      url: window.location.href,
    };

    this.errors.push(warningLog);
    this.trimLogs();

    if (import.meta.env.DEV) {
      console.warn(`[${category}] ${message}`, details);
    }
  }

  /**
   * Log general info
   */
  logInfo(category: string, message: string, details?: unknown): void {
    const infoLog: ErrorLog = {
      timestamp: new Date(),
      type: 'info',
      category,
      message,
      details,
      url: window.location.href,
    };

    this.errors.push(infoLog);
    this.trimLogs();

    if (import.meta.env.DEV) {
      console.info(`[${category}] ${message}`, details);
    }
  }

  /**
   * Log API calls for monitoring
   */
  logAPICall(
    endpoint: string,
    method: string,
    statusCode?: number,
    duration?: number,
    error?: string,
    userId?: string
  ): void {
    const apiLog: APILog = {
      timestamp: new Date(),
      endpoint,
      method,
      statusCode,
      duration,
      error,
      userId,
    };

    this.apiLogs.push(apiLog);
    this.trimLogs();

    // Log failed API calls
    if (statusCode && statusCode >= 400) {
      this.logError(
        'API_ERROR',
        `API call failed: ${method} ${endpoint}`,
        { statusCode, error },
        userId
      );
    }
  }

  /**
   * Get all error logs
   */
  getErrors(): ErrorLog[] {
    return [...this.errors];
  }

  /**
   * Get API logs
   */
  getAPILogs(): APILog[] {
    return [...this.apiLogs];
  }

  /**
   * Get errors by category
   */
  getErrorsByCategory(category: string): ErrorLog[] {
    return this.errors.filter((log) => log.category === category);
  }

  /**
   * Get recent errors (last N minutes)
   */
  getRecentErrors(minutes: number = 30): ErrorLog[] {
    const cutoff = new Date(Date.now() - minutes * 60 * 1000);
    return this.errors.filter((log) => log.timestamp >= cutoff);
  }

  /**
   * Get error statistics
   */
  getStats(): {
    totalErrors: number;
    totalWarnings: number;
    totalInfo: number;
    errorsByCategory: Record<string, number>;
    recentErrors: number;
  } {
    const recentErrors = this.getRecentErrors(30);
    const errorsByCategory: Record<string, number> = {};

    this.errors.forEach((log) => {
      if (log.type === 'error') {
        errorsByCategory[log.category] = (errorsByCategory[log.category] || 0) + 1;
      }
    });

    return {
      totalErrors: this.errors.filter((log) => log.type === 'error').length,
      totalWarnings: this.errors.filter((log) => log.type === 'warning').length,
      totalInfo: this.errors.filter((log) => log.type === 'info').length,
      errorsByCategory,
      recentErrors: recentErrors.filter((log) => log.type === 'error').length,
    };
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.errors = [];
    this.apiLogs = [];
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(
      {
        errors: this.errors,
        apiLogs: this.apiLogs,
        stats: this.getStats(),
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    );
  }

  /**
   * Trim logs to max size
   */
  private trimLogs(): void {
    if (this.errors.length > this.maxLogs) {
      this.errors = this.errors.slice(-this.maxLogs);
    }
    if (this.apiLogs.length > this.maxLogs) {
      this.apiLogs = this.apiLogs.slice(-this.maxLogs);
    }
  }

  /**
   * Send to external monitoring service (e.g., Sentry, LogRocket)
   * Replace with actual implementation
   */
  private sendToMonitoringService(log: ErrorLog): void {
    if (log.type === 'error') {
      Sentry.captureException(new Error(log.message), {
        level: 'error',
        tags: { category: log.category },
        extra: { details: log.details, url: log.url },
        user: log.userId ? { id: log.userId, email: log.userEmail } : undefined,
      });
    }
  }
}

// Singleton instance
export const errorMonitor = new ErrorMonitor();

/**
 * Setup global error handlers
 */
export function setupGlobalErrorHandling(): void {
  // Catch unhandled errors
  window.addEventListener('error', (event) => {
    errorMonitor.logError(
      'UNHANDLED_ERROR',
      event.message,
      {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.stack,
      }
    );
  });

  // Catch unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    errorMonitor.logError(
      'UNHANDLED_PROMISE_REJECTION',
      'Unhandled promise rejection',
      {
        reason: event.reason,
        promise: event.promise,
      }
    );
  });

  // Log info on app start
  errorMonitor.logInfo('APP_LIFECYCLE', 'Application started', {
    url: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Helper function to wrap async operations with error logging
 */
export async function withErrorLogging<T>(
  category: string,
  operation: string,
  fn: () => Promise<T>,
  userId?: string
): Promise<T> {
  try {
    const result = await fn();
    errorMonitor.logInfo(category, `${operation} succeeded`);
    return result;
  } catch (error: any) {
    errorMonitor.logError(
      category,
      `${operation} failed`,
      {
        error: error.message,
        stack: error.stack,
      },
      userId
    );
    throw error;
  }
}

/**
 * Helper function to measure API call performance
 */
export async function measureAPICall<T>(
  endpoint: string,
  method: string,
  fn: () => Promise<T>,
  userId?: string
): Promise<T> {
  const startTime = performance.now();
  try {
    const result = await fn();
    const duration = performance.now() - startTime;
    errorMonitor.logAPICall(endpoint, method, 200, duration, undefined, userId);
    return result;
  } catch (error: any) {
    const duration = performance.now() - startTime;
    const statusCode = error.status || error.statusCode || 500;
    errorMonitor.logAPICall(
      endpoint,
      method,
      statusCode,
      duration,
      error.message,
      userId
    );
    throw error;
  }
}

// Export for use in components
export { ErrorMonitor };
