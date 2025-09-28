# Algolia Seeding System

Our complete seeding system with upsert logic and clean architecture for the BrewBook application.

## Quick Usage

### **How We Usually Do It**
```bash
# 1. We seed Storyblok content (creates/updates our stories)
npm run seed:storyblok

# 2. We sync to Algolia search index (upsert mode)
npm run seed:algolia

# 3. We configure search settings and synonyms
npm run algolia:config
```

### **One-Command Setup**
```bash
# We can do the complete setup with upsert logic
npm run seed:all && npm run algolia:config
```

## Available Commands

| Command | Description | Duplicate Safety |
|---------|-------------|------------------|
| `npm run seed:storyblok` | Create/update Storyblok stories | Upsert by slug |
| `npm run seed:algolia` | Sync to Algolia (upsert mode) | Upsert by objectID |
| `npm run seed:algolia:replace` | Rebuild Algolia index | ⚠️ Clears existing data |
| `npm run seed:all` | Complete upsert workflow | Safe re-runs |
| `npm run seed:all:replace` | Complete rebuild workflow | ⚠️ Clears existing data |
| `npm run algolia:config` | Apply search settings & synonyms | Idempotent |

## Key Features

### No More Duplicates
- **Storyblok**: We update existing stories by slug, create new ones if not found
- **Algolia**: We update existing records by objectID, create new ones if not found
- **Safe re-runs**: We can run seeding scripts multiple times without creating duplicates

### Data Structure Compatibility
- **Fixed field mapping**: Our Algolia records include both `description` and `summary` fields
- **Search component compatibility**: Records work seamlessly with our React InstantSearch
- **Metadata alignment**: We properly structure tags and metadata for search

## Architecture Overview

### Services (`lib/services/`)
- **ConfigService**: We manage environment variables and configuration validation
- **StoryblokService**: We handle Storyblok API interactions and data filtering
- **AlgoliaService**: We manage Algolia index operations and settings
- **RecordNormalizer**: We transform Storyblok data into Algolia-compatible records
- **SeedingOrchestrator**: We coordinate the entire seeding process

### Utilities (`lib/utils/`)
- **Logger**: Our professional logging system without emojis

## Environment Variables Required

```bash
# Storyblok
SB_SPACE_ID=your_space_id
SB_PAT=your_personal_access_token

# Algolia
ALGOLIA_APPLICATION_ID=your_app_id
ALGOLIA_WRITE_API_KEY=your_write_key
ALGOLIA_INDEX_NAME=brewbook
NEXT_PUBLIC_ALGOLIA_APPLICATION_ID=your_app_id
NEXT_PUBLIC_ALGOLIA_API_KEY=your_search_key
NEXT_PUBLIC_ALGOLIA_INDEX_NAME=brewbook
```

## Testing the Setup

### **Verify No Duplicates**
```bash
# We run seeding twice - should show updates, not duplicates
npm run seed:all
npm run seed:all
```

### **Test Search Functionality**
```bash
# We apply search configuration and test
npm run algolia:config
npm run algolia:test
```

## Requirements We've Met

- 10+ café records with objectID, title, slug, type
- 3+ event records with objectID, title, slug, type
- Clean logging without emojis
- Component-based architecture
- Proper error handling and validation
- Organized code structure

Let's run `npm run seed:all && npm run algolia:config` to get started!