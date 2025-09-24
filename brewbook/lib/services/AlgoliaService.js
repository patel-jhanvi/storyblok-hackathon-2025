const { algoliasearch } = require('algoliasearch');
const Logger = require('../utils/Logger');

/**
 * Service for interacting with Algolia search index
 * Follows Single Responsibility Principle and Dependency Inversion
 */
class AlgoliaService {
  constructor(config) {
    this.config = config;
    this.client = algoliasearch(config.appId, config.writeApiKey);
    this.logger = Logger.create('AlgoliaService');
  }

  /**
   * Get default index settings for the search index
   * @returns {Object} Index settings configuration
   */
  getDefaultIndexSettings() {
    return {
      searchableAttributes: [
        'title,name',
        'description',
        'location',
        'tags',
        'type'
      ],
      attributesForFaceting: [
        'type',
        'location',
        'tags'
      ],
      customRanking: [
        'desc(rating)',
        'desc(published_at)'
      ],
      ranking: [
        'typo',
        'geo',
        'words',
        'filters',
        'proximity',
        'attribute',
        'exact',
        'custom'
      ]
    };
  }

  /**
   * Configure the search index settings
   * @param {Object} customSettings - Optional custom settings to override defaults
   */
  async configureIndex(customSettings = {}) {
    try {
      this.logger.info(`Configuring Algolia index: ${this.config.indexName}`);

      const settings = { ...this.getDefaultIndexSettings(), ...customSettings };

      await this.client.setSettings({
        indexName: this.config.indexName,
        indexSettings: settings
      });

      this.logger.success('Index configuration completed');

    } catch (error) {
      this.logger.error('Failed to configure index', error);
      throw error;
    }
  }

  /**
   * Clear all objects from the index
   */
  async clearIndex() {
    try {
      this.logger.info('Clearing existing index data');

      await this.client.clearObjects({
        indexName: this.config.indexName
      });

      this.logger.success('Index cleared successfully');

    } catch (error) {
      this.logger.error('Failed to clear index', error);
      throw error;
    }
  }

  /**
   * Save objects to the index
   * @param {Array} objects - Array of objects to index
   * @returns {Object} Response from Algolia
   */
  async saveObjects(objects) {
    try {
      this.logger.info(`Indexing ${objects.length} objects`);

      const response = await this.client.saveObjects({
        indexName: this.config.indexName,
        objects: objects
      });

      this.logger.success(`Successfully indexed ${objects.length} objects`);
      return response;

    } catch (error) {
      this.logger.error('Failed to save objects to index', error);
      throw error;
    }
  }

  /**
   * Validate that objects have required fields
   * @param {Array} objects - Array of objects to validate
   * @returns {Object} Validation result with valid objects and errors
   */
  validateObjects(objects) {
    const requiredFields = ['objectID', 'title', 'slug', 'type'];
    const validObjects = [];
    const errors = [];

    objects.forEach((obj, index) => {
      const missingFields = requiredFields.filter(field => !obj[field]);

      if (missingFields.length === 0) {
        validObjects.push(obj);
      } else {
        errors.push({
          index,
          objectID: obj.objectID || 'unknown',
          missingFields
        });
      }
    });

    if (errors.length > 0) {
      this.logger.warn(`${errors.length} objects failed validation`, errors);
    }

    return { validObjects, errors };
  }
}

module.exports = AlgoliaService;