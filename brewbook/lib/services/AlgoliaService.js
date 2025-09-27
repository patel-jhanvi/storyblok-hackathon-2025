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
        'description,short_summary',
        'address,city,location',
        'tags,specialties',
        'ai_tags,ai_summary',
        'type'
      ],
      attributesForFaceting: [
        'type',
        'city',
        'tags',
        'noise_level',
        'seating_capacity',
        'price_range',
        'wifi',
        'power_outlets',
        'outdoor_seating',
        'pet_friendly',
        'open_now'
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
   * Clear all objects from the index (use with caution)
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
   * Get existing objects from the index to check for duplicates
   * @returns {Array} Array of existing objects
   */
  async getExistingObjects() {
    try {
      const existingObjects = [];

      await this.client.browseObjects({
        indexName: this.config.indexName,
        browseParams: {
          query: ''
        },
        batch: (hits) => {
          existingObjects.push(...hits);
        }
      });

      this.logger.info(`Found ${existingObjects.length} existing objects in index`);
      return existingObjects;

    } catch (error) {
      this.logger.error('Failed to browse existing objects', error);
      return [];
    }
  }

  /**
   * Save objects to the index with upsert logic (update or create)
   * @param {Array} objects - Array of objects to index
   * @param {boolean} replaceAll - Whether to replace all existing data (default: false)
   * @returns {Object} Response from Algolia with update/create statistics
   */
  async saveObjects(objects, replaceAll = false) {
    try {
      if (replaceAll) {
        // Old behavior - clear and recreate
        await this.clearIndex();
        this.logger.info(`Indexing ${objects.length} objects (replace all)`);

        const response = await this.client.saveObjects({
          indexName: this.config.indexName,
          objects: objects
        });

        this.logger.success(`Successfully indexed ${objects.length} objects`);
        return { created: objects.length, updated: 0, response };
      }

      // New behavior - upsert logic
      return await this.upsertObjects(objects);

    } catch (error) {
      this.logger.error('Failed to save objects to index', error);
      throw error;
    }
  }

  /**
   * Upsert objects - update existing, create new ones
   * @param {Array} objects - Array of objects to upsert
   * @returns {Object} Response with statistics
   */
  async upsertObjects(objects) {
    try {
      this.logger.info(`Upserting ${objects.length} objects`);

      // Get existing objects to determine what to update vs create
      const existingObjects = await this.getExistingObjects();
      const existingIds = new Set(existingObjects.map(obj => obj.objectID));

      const toUpdate = [];
      const toCreate = [];

      objects.forEach(obj => {
        if (existingIds.has(obj.objectID)) {
          toUpdate.push(obj);
        } else {
          toCreate.push(obj);
        }
      });

      this.logger.info(`Objects to update: ${toUpdate.length}, Objects to create: ${toCreate.length}`);

      // Save all objects (Algolia automatically handles updates/creates)
      const response = await this.client.saveObjects({
        indexName: this.config.indexName,
        objects: objects
      });

      this.logger.success(`Successfully upserted ${objects.length} objects (${toCreate.length} created, ${toUpdate.length} updated)`);

      return {
        created: toCreate.length,
        updated: toUpdate.length,
        total: objects.length,
        response
      };

    } catch (error) {
      this.logger.error('Failed to upsert objects', error);
      throw error;
    }
  }

  /**
   * Partial update objects by objectID
   * @param {Array} updates - Array of partial update objects with objectID
   * @returns {Object} Response from Algolia
   */
  async partialUpdateObjects(updates) {
    try {
      this.logger.info(`Partially updating ${updates.length} objects`);

      const response = await this.client.partialUpdateObjects({
        indexName: this.config.indexName,
        objects: updates
      });

      this.logger.success(`Successfully updated ${updates.length} objects`);
      return response;

    } catch (error) {
      this.logger.error('Failed to partially update objects', error);
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