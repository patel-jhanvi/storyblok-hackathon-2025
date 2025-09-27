const Logger = require('../utils/Logger');

/**
 * Orchestrator service that coordinates the seeding process
 * Follows Single Responsibility Principle and Dependency Inversion
 */
class SeedingOrchestrator {
  constructor(storyblokService, algoliaService, recordNormalizer) {
    this.storyblokService = storyblokService;
    this.algoliaService = algoliaService;
    this.recordNormalizer = recordNormalizer;
    this.logger = Logger.create('SeedingOrchestrator');
  }

  /**
   * Execute the complete seeding process
   * @param {Object} options - Seeding options
   * @returns {Object} Seeding results
   */
  async executeSeedingProcess(options = {}) {
    const startTime = Date.now();

    try {
      this.logger.info('Starting Algolia index seeding process');

      // Step 1: Configure Algolia index
      await this.configureSearchIndex(options.indexSettings);

      // Step 2: Fetch stories from Storyblok
      const stories = await this.fetchStoryblokContent();

      // Step 3: Normalize stories for Algolia
      const records = await this.normalizeContent(stories);

      // Step 4: Validate requirements
      const validation = this.validateRecords(records);
      if (!validation.isValid) {
        this.logger.warn('Seeding completed but requirements not met', validation);
      }

      // Step 5: Index records in Algolia
      const indexingResult = await this.indexRecords(records, options.replaceAll);

      const duration = Date.now() - startTime;
      const result = {
        ...validation,
        ...indexingResult,
        duration: `${duration}ms`,
        timestamp: new Date().toISOString()
      };

      this.logger.success('Seeding process completed', result);
      return result;

    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(`Seeding process failed after ${duration}ms`, error);
      throw error;
    }
  }

  /**
   * Configure the Algolia search index
   * @param {Object} customSettings - Custom index settings
   */
  async configureSearchIndex(customSettings) {
    await this.algoliaService.configureIndex(customSettings);
  }

  /**
   * Fetch and filter relevant stories from Storyblok
   * @returns {Array} Array of relevant stories
   */
  async fetchStoryblokContent() {
    const allStories = await this.storyblokService.fetchAllStories();
    const relevantStories = this.storyblokService.filterRelevantStories(allStories);

    this.logger.info(`Filtered ${relevantStories.length} relevant stories from ${allStories.length} total stories`);

    return relevantStories;
  }

  /**
   * Normalize stories into Algolia records
   * @param {Array} stories - Array of Storyblok stories
   * @returns {Array} Array of normalized records
   */
  async normalizeContent(stories) {
    return this.recordNormalizer.normalizeStories(stories);
  }

  /**
   * Validate records meet the requirements
   * @param {Array} records - Array of normalized records
   * @returns {Object} Validation result
   */
  validateRecords(records) {
    const stats = this.calculateRecordStats(records);
    const requirements = {
      minimumCafes: 10,
      minimumEvents: 3
    };

    const isValid = stats.cafeCount >= requirements.minimumCafes &&
                    stats.eventCount >= requirements.minimumEvents;

    const validation = {
      isValid,
      requirements,
      stats,
      message: isValid
        ? 'All requirements met'
        : `Requirements not met. Need ${requirements.minimumCafes} cafes (have ${stats.cafeCount}) and ${requirements.minimumEvents} events (have ${stats.eventCount})`
    };

    if (isValid) {
      this.logger.success('Record validation passed', validation);
    } else {
      this.logger.warn('Record validation failed', validation);
    }

    return validation;
  }

  /**
   * Calculate statistics for record types
   * @param {Array} records - Array of records
   * @returns {Object} Statistics object
   */
  calculateRecordStats(records) {
    const stats = {
      totalRecords: records.length,
      cafeCount: 0,
      eventCount: 0,
      otherCount: 0
    };

    records.forEach(record => {
      switch (record.type) {
        case 'cafe':
          stats.cafeCount++;
          break;
        case 'event':
          stats.eventCount++;
          break;
        default:
          stats.otherCount++;
      }
    });

    return stats;
  }

  /**
   * Index records in Algolia with upsert logic
   * @param {Array} records - Array of records to index
   * @param {boolean} replaceAll - Whether to replace all existing data (default: false)
   * @returns {Object} Indexing result
   */
  async indexRecords(records, replaceAll = false) {
    if (records.length === 0) {
      this.logger.warn('No records to index');
      return { indexed: 0, skipped: records.length, created: 0, updated: 0 };
    }

    // Validate records before indexing
    const validation = this.algoliaService.validateObjects(records);

    if (validation.errors.length > 0) {
      this.logger.warn(`${validation.errors.length} records failed validation and will be skipped`);
    }

    // Index valid records with upsert logic
    const response = await this.algoliaService.saveObjects(validation.validObjects, replaceAll);

    return {
      indexed: validation.validObjects.length,
      skipped: validation.errors.length,
      created: response.created || validation.validObjects.length,
      updated: response.updated || 0,
      algoliaResponse: response.response || response
    };
  }
}

module.exports = SeedingOrchestrator;