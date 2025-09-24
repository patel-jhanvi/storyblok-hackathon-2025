/**
 * Logging utility for consistent, emoji-free output
 * Follows Single Responsibility Principle
 */
class Logger {
  constructor(context = 'App') {
    this.context = context;
  }

  /**
   * Create a logger with specific context
   */
  static create(context) {
    return new Logger(context);
  }

  /**
   * Log informational messages
   */
  info(message, data = null) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${this.context}] INFO: ${message}`);
    if (data) {
      console.log(JSON.stringify(data, null, 2));
    }
  }

  /**
   * Log success messages
   */
  success(message, data = null) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${this.context}] SUCCESS: ${message}`);
    if (data) {
      console.log(JSON.stringify(data, null, 2));
    }
  }

  /**
   * Log warning messages
   */
  warn(message, data = null) {
    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}] [${this.context}] WARN: ${message}`);
    if (data) {
      console.warn(JSON.stringify(data, null, 2));
    }
  }

  /**
   * Log error messages
   */
  error(message, error = null) {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] [${this.context}] ERROR: ${message}`);
    if (error) {
      console.error(error.message || error);
      if (error.stack) {
        console.error(error.stack);
      }
    }
  }

  /**
   * Log debug messages (only in development)
   */
  debug(message, data = null) {
    if (process.env.NODE_ENV === 'development') {
      const timestamp = new Date().toISOString();
      console.debug(`[${timestamp}] [${this.context}] DEBUG: ${message}`);
      if (data) {
        console.debug(JSON.stringify(data, null, 2));
      }
    }
  }
}

module.exports = Logger;