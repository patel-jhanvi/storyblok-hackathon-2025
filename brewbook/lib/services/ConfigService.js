const fs = require('fs');
const path = require('path');

/**
 * Configuration service responsible for loading and validating environment variables
 * Follows Single Responsibility Principle
 */
class ConfigService {
  constructor() {
    this.loadEnvironmentVariables();
    this.validateRequiredConfig();
  }

  /**
   * Load environment variables from .env file if available
   */
  loadEnvironmentVariables() {
    try {
      const envPath = path.join(process.cwd(), '.env');
      if (!fs.existsSync(envPath)) {
        return;
      }

      const envFile = fs.readFileSync(envPath, 'utf8');
      envFile.split('\n').forEach(line => {
        line = line.trim();
        if (line && !line.startsWith('#') && line.includes('=')) {
          const [key, ...valueParts] = line.split('=');
          if (key && valueParts.length > 0) {
            process.env[key] = valueParts.join('=');
          }
        }
      });
    } catch (error) {
      // Environment variables will be used from system if .env not available
    }
  }

  /**
   * Validate that all required configuration is present
   */
  validateRequiredConfig() {
    const requiredVars = [
      'ALGOLIA_APPLICATION_ID',
      'ALGOLIA_WRITE_API_KEY',
      'STORYBLOK_TOKEN'
    ];

    const missing = requiredVars.filter(varName => !process.env[varName]);

    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }

  /**
   * Get Algolia configuration
   */
  getAlgoliaConfig() {
    return {
      appId: process.env.ALGOLIA_APPLICATION_ID,
      writeApiKey: process.env.ALGOLIA_WRITE_API_KEY,
      indexName: process.env.ALGOLIA_INDEX_NAME || 'brewbook'
    };
  }

  /**
   * Get Storyblok configuration
   */
  getStoryblokConfig() {
    return {
      token: process.env.STORYBLOK_TOKEN,
      baseUrl: 'https://api.storyblok.com/v2/cdn',
      perPage: 100
    };
  }
}

module.exports = ConfigService;