/**
 * Type definitions and interfaces for the seeding application
 * This file documents the expected structure of data objects used throughout the application
 */

/**
 * @typedef {Object} StoryblokStory
 * @property {number} id - Unique story identifier
 * @property {string} slug - URL-friendly story identifier
 * @property {Object} content - Story content object
 * @property {Array} content.body - Array of content blocks
 * @property {string} published_at - Publication timestamp
 * @property {string} created_at - Creation timestamp
 */

/**
 * @typedef {Object} StoryblokComponent
 * @property {string} component - Component type (e.g., 'cafe', 'event')
 * @property {string} _uid - Unique component identifier
 * @property {string} [name] - Component name (for cafes)
 * @property {string} [title] - Component title (for events)
 * @property {Object} [description] - Rich text description
 * @property {string} [location] - Location information
 * @property {Object} [image] - Image asset
 * @property {string} image.filename - Image URL
 * @property {Array} [metadata] - Metadata blocks
 * @property {string} [date] - Event date (for events)
 */

/**
 * @typedef {Object} AlgoliaRecord
 * @property {string} objectID - Unique Algolia object identifier
 * @property {string} title - Display title
 * @property {string} slug - URL slug
 * @property {string} type - Record type ('cafe' or 'event')
 * @property {number} storyId - Original Storyblok story ID
 * @property {string} published_at - Publication timestamp
 * @property {string} created_at - Creation timestamp
 * @property {string} [name] - Name (for cafes)
 * @property {string} [location] - Location information
 * @property {string} [description] - Plain text description
 * @property {string} [image] - Image URL
 * @property {string} [date] - Event date (for events)
 * @property {Array<string>} [tags] - Array of tags
 * @property {string} [opening_hours] - Opening hours information
 * @property {number|null} [rating] - Numerical rating
 */

/**
 * @typedef {Object} AlgoliaConfig
 * @property {string} appId - Algolia application ID
 * @property {string} writeApiKey - Algolia write API key
 * @property {string} indexName - Name of the search index
 */

/**
 * @typedef {Object} StoryblokConfig
 * @property {string} token - Storyblok API token
 * @property {string} baseUrl - Base API URL
 * @property {number} perPage - Items per page for API requests
 */

/**
 * @typedef {Object} SeedingResult
 * @property {boolean} isValid - Whether seeding met requirements
 * @property {Object} requirements - Minimum requirements
 * @property {number} requirements.minimumCafes - Minimum cafe count required
 * @property {number} requirements.minimumEvents - Minimum event count required
 * @property {Object} stats - Actual statistics
 * @property {number} stats.totalRecords - Total records processed
 * @property {number} stats.cafeCount - Number of cafe records
 * @property {number} stats.eventCount - Number of event records
 * @property {number} indexed - Number of records successfully indexed
 * @property {number} skipped - Number of records skipped
 * @property {string} message - Human-readable result message
 * @property {string} duration - Processing duration
 * @property {string} timestamp - Completion timestamp
 */

module.exports = {
  // Export type definitions for JSDoc usage
  // These are mainly for documentation purposes in JavaScript
};