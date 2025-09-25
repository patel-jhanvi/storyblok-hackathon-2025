/**
 * Main library exports for the Algolia seeding application
 * Provides clean access to all services and utilities
 */

// Services
const ConfigService = require('./services/ConfigService');
const StoryblokService = require('./services/StoryblokService');
const AlgoliaService = require('./services/AlgoliaService');
const RecordNormalizer = require('./services/RecordNormalizer');
const SeedingOrchestrator = require('./services/SeedingOrchestrator');

// Utilities
const Logger = require('./utils/Logger');

// Types (for documentation)
const Types = require('./types');

module.exports = {
  // Services
  ConfigService,
  StoryblokService,
  AlgoliaService,
  RecordNormalizer,
  SeedingOrchestrator,

  // Utilities
  Logger,

  // Types
  Types
};