/**
 * Main library exports for the Algolia seeding application
 * Provides clean access to all services and utilities
 */

// Services
import ConfigService from './services/ConfigService.js';
import StoryblokService from './services/StoryblokService.js';
import AlgoliaService from './services/AlgoliaService.js';
import RecordNormalizer from './services/RecordNormalizer.js';
import SeedingOrchestrator from './services/SeedingOrchestrator.js';

// Utilities
import Logger from './utils/Logger.js';

// Types (for documentation)
import Types from './types.js';

export {
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