# Algolia Search Configuration

Our Algolia search configuration with synonyms and typo tolerance for BrewBook.

## Quick Setup

### 1. Environment Variables We Need

```env
# Server-side
ALGOLIA_APPLICATION_ID=your_app_id
ALGOLIA_WRITE_API_KEY=your_write_key
ALGOLIA_INDEX_NAME=brewbook

# Client-side (for React InstantSearch)
NEXT_PUBLIC_ALGOLIA_APPLICATION_ID=your_app_id
NEXT_PUBLIC_ALGOLIA_API_KEY=your_search_key
NEXT_PUBLIC_ALGOLIA_INDEX_NAME=brewbook
```

### 2. Let's Apply Our Configuration

```bash
npm run algolia:config
```

## Available Commands

| Command                    | Description                     |
| -------------------------- | ------------------------------- |
| `npm run algolia:config`   | Apply all settings and synonyms |
| `npm run algolia:synonyms` | Apply synonyms only             |
| `npm run algolia:settings` | Apply index settings only       |
| `npm run algolia:test`     | Test search functionality       |

## Features We've Built

### Synonyms We've Configured

- **Atmosphere**: quiet ↔ calm ↔ peaceful ↔ silent ↔ tranquil
- **Connectivity**: wifi ↔ wi-fi ↔ internet ↔ wireless ↔ connection
- **Power**: outlets ↔ power ↔ charging ↔ plugs ↔ electricity
- **Spaces**: cafe ↔ café ↔ coffee shop ↔ coffeehouse
- **Activities**: study ↔ work ↔ workspace ↔ coworking
- **Events**: meetup ↔ event ↔ gathering ↔ workshop ↔ networking

### Typo Tolerance We've Set Up

- **1 typo allowed** for words with 4+ characters
- **2 typos allowed** for words with 8+ characters
- **Smart matching** that prioritizes exact matches over typos

### Search Examples That Work

```javascript
// Typo tolerance we've set up
search('quitet') → finds "quiet"
search('caff')   → finds "cafe"

// Synonyms we've configured
search('power')     → finds items with "outlets"
search('internet')  → finds items with "wifi"
search('workspace') → finds "study" spots
```

## Troubleshooting

### Common Issues We've Seen

1. **"appId is missing"** - We need to set `NEXT_PUBLIC_ALGOLIA_APPLICATION_ID` and restart server
2. **Synonyms not working** - Let's run `npm run algolia:synonyms`
3. **Typos not working** - Let's run `npm run algolia:settings`

### Testing Our Setup

```bash
npm run algolia:test
```

## Integration

Works automatically with our React InstantSearch components:

```jsx
<InstantSearch searchClient={searchClient} indexName='brewbook'>
  <SearchBox placeholder='Search cafés, events, study spots...' />
  <Hits hitComponent={Hit} />
</InstantSearch>
```

We configure once, search everywhere with smart synonyms and typo tolerance!
