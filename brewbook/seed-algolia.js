#!/usr/bin/env node

/**
 * Algolia Index Seeding Script
 *
 * This script orchestrates the seeding of Algolia search index with content from Storyblok.
 * It follows SOLID principles with clean separation of concerns and proper error handling.
 *
 * Usage: node seed-algolia.js
 */

const ConfigService = require('./lib/services/ConfigService');
const StoryblokService = require('./lib/services/StoryblokService');
const AlgoliaService = require('./lib/services/AlgoliaService');
const RecordNormalizer = require('./lib/services/RecordNormalizer');
const SeedingOrchestrator = require('./lib/services/SeedingOrchestrator');
const Logger = require('./lib/utils/Logger');

/**
 * Application entry point
 */
class AlgoliaSeedingApp {
  constructor() {
    this.logger = Logger.create('AlgoliaSeedingApp');
  }

  /**
   * Initialize and wire up all services
   */
  initializeServices() {
    try {
      // Load configuration
      const config = new ConfigService();

      // Initialize services with dependency injection
      const storyblokService = new StoryblokService(config.getStoryblokConfig());
      const algoliaService = new AlgoliaService(config.getAlgoliaConfig());
      const recordNormalizer = new RecordNormalizer();

      // Create orchestrator with injected dependencies
      const orchestrator = new SeedingOrchestrator(
        storyblokService,
        algoliaService,
        recordNormalizer
      );

      return { config, orchestrator };

    } catch (error) {
      this.logger.error('Failed to initialize services', error);
      throw error;
    }
  }

  /**
   * Execute the seeding process
   */
  async run() {
    const startTime = process.hrtime.bigint();

    try {
      this.logger.info('Initializing Algolia seeding application');

      const { config, orchestrator } = this.initializeServices();

      this.logger.info('Configuration loaded successfully', {
        algoliaIndex: config.getAlgoliaConfig().indexName,
        storyblokEndpoint: config.getStoryblokConfig().baseUrl
      });

      // Execute seeding with optional custom settings
      const result = await orchestrator.executeSeedingProcess({
        indexSettings: this.getCustomIndexSettings()
      });

      const endTime = process.hrtime.bigint();
      const totalDuration = Number(endTime - startTime) / 1000000; // Convert to milliseconds

      this.logFinalResults(result, totalDuration);

      // Exit with appropriate code based on validation
      process.exit(result.isValid ? 0 : 1);

    } catch (error) {
      const endTime = process.hrtime.bigint();
      const totalDuration = Number(endTime - startTime) / 1000000;

      this.logger.error(`Application failed after ${totalDuration}ms`, error);
      process.exit(1);
    }
  }

  /**
   * Get custom index settings if needed
   * @returns {Object} Custom settings object
   */
  getCustomIndexSettings() {
    // Return empty object to use defaults, or customize as needed
    return {};
  }

  /**
   * Log final results in a clean, summary format
   * @param {Object} result - Seeding result object
   * @param {number} duration - Total duration in milliseconds
   */
  logFinalResults(result, duration) {
    this.logger.info('========================================');
    this.logger.info('ALGOLIA SEEDING COMPLETED');
    this.logger.info('========================================');

    this.logger.info('Records processed:', {
      'Total cafes': result.stats.cafeCount,
      'Total events': result.stats.eventCount,
      'Total indexed': result.indexed,
      'Total skipped': result.skipped
    });

    this.logger.info('Requirements validation:', {
      'Status': result.isValid ? 'PASSED' : 'FAILED',
      'Message': result.message
    });

    this.logger.info('Performance:', {
      'Total duration': `${Math.round(duration)}ms`,
      'Timestamp': result.timestamp
    });

    if (!result.isValid) {
      this.logger.warn('Seeding completed but validation failed. You may need to run the Storyblok seed script first.');
    }

    this.logger.info('========================================');
  }
}

// Execute the application when run directly
if (require.main === module) {
  const app = new AlgoliaSeedingApp();
  app.run();
}

module.exports = AlgoliaSeedingApp;