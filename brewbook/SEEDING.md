# Algolia Seeding Architecture

This document describes the clean, component-based architecture for seeding the Algolia search index.

## Architecture Overview

### Services (`lib/services/`)

- **ConfigService**: Manages environment variables and configuration validation
- **StoryblokService**: Handles Storyblok API interactions and data filtering
- **AlgoliaService**: Manages Algolia index operations and settings
- **RecordNormalizer**: Transforms Storyblok data into Algolia-compatible records
- **SeedingOrchestrator**: Coordinates the entire seeding process

### Utilities (`lib/utils/`)

- **Logger**: Professional logging system without emojis

### Types (`lib/types/`)

- **index.js**: JSDoc type definitions for all data structures

## Usage

```bash
# Run the seeding process
node seed-algolia.js
```

## Requirements Met

- ✅ 10+ café records with objectID, title, slug, type
- ✅ 3+ event records with objectID, title, slug, type
- ✅ Clean logging without emojis
- ✅ Component-based architecture
- ✅ Proper error handling and validation
- ✅ Organized code structure

## Environment Variables Required

```bash
ALGOLIA_APPLICATION_ID=your_app_id
ALGOLIA_WRITE_API_KEY=your_write_key
ALGOLIA_INDEX_NAME=brewbook
STORYBLOK_TOKEN=your_token
```

## Output

The script provides structured logging with timestamps and clean summary reports showing:

- Records processed by type
- Validation status against requirements
- Performance metrics
- Final indexing results
