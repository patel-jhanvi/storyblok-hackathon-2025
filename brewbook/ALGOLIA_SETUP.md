# Algolia Search Configuration

This document explains how to configure Algolia search with synonyms and typo tolerance for the BrewBook application.

## Features Implemented

### Synonyms
- **Atmosphere**: quiet ↔ calm ↔ peaceful ↔ silent ↔ tranquil
- **Connectivity**: wifi ↔ wi-fi ↔ internet ↔ wireless ↔ connection
- **Power**: outlets ↔ power ↔ charging ↔ plugs ↔ electricity
- **Spaces**: cafe ↔ café ↔ coffee shop ↔ coffeehouse
- **Activities**: study ↔ work ↔ workspace ↔ coworking
- **Events**: meetup ↔ event ↔ gathering ↔ workshop ↔ networking
- **Amenities**: food ↔ snacks ↔ meals, restroom ↔ bathroom ↔ toilet
- **Accessibility**: wheelchair ↔ accessible, pet friendly ↔ dog friendly

### Typo Tolerance
- **1 typo allowed** for words with 4+ characters (`quitet` → `quiet`)
- **2 typos allowed** for words with 8+ characters
- **Smart matching** that prioritizes exact matches over typos

### Advanced Search Features
- **Plurals handling**: `cafe` matches `cafes`
- **Stop words removal**: ignores "the", "a", "an", etc.
- **Proximity ranking**: closer words rank higher
- **Faceted search**: filter by type, amenities, location

## Quick Setup

### 1. Install Dependencies
```bash
npm install algoliasearch
```

### 2. Configure Environment Variables
Ensure your `.env` file has:
```env
# Server-side credentials
ALGOLIA_APPLICATION_ID=your_app_id
ALGOLIA_WRITE_API_KEY=your_write_key
ALGOLIA_INDEX_NAME=brewbook

# Client-side credentials (for React InstantSearch)
NEXT_PUBLIC_ALGOLIA_APPLICATION_ID=your_app_id
NEXT_PUBLIC_ALGOLIA_API_KEY=your_search_key
NEXT_PUBLIC_ALGOLIA_INDEX_NAME=brewbook
```

### 3. Apply Configuration
Run the complete setup:
```bash
npm run algolia:config
```

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run algolia:config` | Apply all settings and synonyms |
| `npm run algolia:synonyms` | Apply synonyms only |
| `npm run algolia:settings` | Apply index settings only |
| `npm run algolia:test` | Test search functionality |

## Example Usage

### Search Examples That Work

#### Typo Tolerance
```javascript
// These searches will find items with "quiet"
search('quitet')   // 1 typo
search('quite')    // 1 typo
search('qiet')     // 1 typo
```

#### Synonyms
```javascript
// These searches will find items tagged with "outlets"
search('power')     // synonym match
search('charging')  // synonym match
search('plugs')     // synonym match

// These searches will find items with "wifi"
search('internet')  // synonym match
search('wireless')  // synonym match
search('wi-fi')     // synonym match
```

#### Complex Queries
```javascript
search('calm coffee shop')    // "calm" matches "quiet" cafes
search('outdoor wifi power')  // Multiple synonyms combined
search('pet freindly cafe')   // Typo + synonym matching
```

## Configuration Details

### Synonym Types

The configuration includes these synonym groups:

```javascript
// Atmosphere
['quiet', 'calm', 'peaceful', 'silent', 'tranquil']
['loud', 'noisy', 'busy', 'lively', 'buzzing']
['cozy', 'comfortable', 'warm', 'inviting', 'homey']

// Technology & Amenities
['wifi', 'wi-fi', 'internet', 'wireless', 'connection']
['outlets', 'power', 'charging', 'plugs', 'electricity']

// Space Types
['cafe', 'café', 'coffee shop', 'coffeehouse', 'coffee']
['study', 'work', 'workspace', 'coworking', 'study spot']
['meetup', 'event', 'gathering', 'workshop', 'networking']
```

### Typo Tolerance Settings

```javascript
typoTolerance: {
  enabled: true,
  minWordSizefor1Typo: 4,     // "cafe" allows "caff"
  minWordSizefor2Typos: 8,    // "restaurant" allows "resturant"
  disableOnWords: [],          // No words excluded
  disableOnAttributes: []      // No attributes excluded
}
```

### Search Ranking

The search results are ranked by:

1. **Typo** - Exact matches first
2. **Geo** - Proximity (if location-based)
3. **Words** - More matched words rank higher
4. **Filters** - Applied filters
5. **Proximity** - Word proximity in content
6. **Attribute** - Searchable attribute order
7. **Exact** - Exact phrase matches
8. **Custom** - Business logic (popularity, distance)

## Troubleshooting

### Common Issues

1. **"appId is missing" error**
   - Ensure `NEXT_PUBLIC_ALGOLIA_APPLICATION_ID` is set
   - Restart your development server after changing `.env`

2. **Synonyms not working**
   - Run `npm run algolia:synonyms` to reapply
   - Check that your index name matches `ALGOLIA_INDEX_NAME`

3. **Typos not working**
   - Run `npm run algolia:settings` to reapply settings
   - Ensure words are 4+ characters for 1 typo tolerance

### Testing Your Setup

```bash
# Test the complete configuration
npm run algolia:test

# Check specific searches in your browser console
# The script will output results for test queries
```

## Advanced Configuration

### Adding New Synonyms

Edit `scripts/algolia-config.js` and add to the `synonyms` array:

```javascript
{
  objectID: 'new-synonym-group',
  type: 'synonym',
  synonyms: ['word1', 'word2', 'word3']
}
```

Then run:
```bash
npm run algolia:synonyms
```

### Customizing Search Behavior

Modify the `indexSettings` object in `scripts/algolia-config.js`:

```javascript
// Example: Disable typos for specific words
typoTolerance: {
  enabled: true,
  disableOnWords: ['brand', 'specific-term']
}

// Example: Change ranking priorities
ranking: [
  'typo', 'words', 'proximity', 'attribute', 'exact', 'custom'
]
```

## Integration with React InstantSearch

Your search component automatically benefits from these settings:

```jsx
// No changes needed in your React components
<InstantSearch searchClient={searchClient} indexName="brewbook">
  <SearchBox placeholder="Search cafés, events, study spots..." />
  <Hits hitComponent={Hit} />
</InstantSearch>
```

The synonyms and typo tolerance work transparently with your existing React InstantSearch implementation.