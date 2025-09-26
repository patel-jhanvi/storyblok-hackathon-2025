const { algoliasearch } = require('algoliasearch');

// Load environment variables from .env file
function loadEnvFile() {
  try {
    const fs = require('fs');
    const path = require('path');
    const envPath = path.join(__dirname, '..', '.env');

    const envContent = fs.readFileSync(envPath, 'utf8');
    for (const line of envContent.split('\n')) {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#') && trimmedLine.includes('=')) {
        const [key, value] = trimmedLine.split('=', 2);
        process.env[key] = value;
      }
    }
  } catch (error) {
    console.log('Warning: .env file not found, using system environment variables');
  }
}

loadEnvFile();

// Initialize Algolia client with management credentials
const client = algoliasearch(
  process.env.ALGOLIA_APPLICATION_ID,
  process.env.ALGOLIA_WRITE_API_KEY // Use write API key for index management
);

const indexName = process.env.ALGOLIA_INDEX_NAME || 'brewbook';

// Synonyms configuration
const synonyms = [
  // Atmosphere synonyms
  {
    objectID: 'quiet-calm',
    type: 'synonym',
    synonyms: ['quiet', 'calm', 'peaceful', 'silent', 'tranquil']
  },
  {
    objectID: 'loud-noisy',
    type: 'synonym',
    synonyms: ['loud', 'noisy', 'busy', 'lively', 'buzzing']
  },
  {
    objectID: 'cozy-comfortable',
    type: 'synonym',
    synonyms: ['cozy', 'comfortable', 'warm', 'inviting', 'homey']
  },

  // Connectivity synonyms
  {
    objectID: 'wifi-internet',
    type: 'synonym',
    synonyms: ['wifi', 'wi-fi', 'internet', 'wireless', 'connection']
  },

  // Power synonyms
  {
    objectID: 'outlets-power',
    type: 'synonym',
    synonyms: ['outlets', 'power', 'charging', 'plugs', 'electricity']
  },

  // Space type synonyms
  {
    objectID: 'cafe-coffee',
    type: 'synonym',
    synonyms: ['cafe', 'café', 'coffee shop', 'coffeehouse', 'coffee']
  },
  {
    objectID: 'study-work',
    type: 'synonym',
    synonyms: ['study', 'work', 'workspace', 'coworking', 'study spot']
  },
  {
    objectID: 'meetup-event',
    type: 'synonym',
    synonyms: ['meetup', 'event', 'gathering', 'workshop', 'networking']
  },

  // Seating synonyms
  {
    objectID: 'outdoor-outside',
    type: 'synonym',
    synonyms: ['outdoor', 'outside', 'patio', 'terrace', 'garden']
  },
  {
    objectID: 'group-table',
    type: 'synonym',
    synonyms: ['group', 'groups', 'table', 'tables', 'communal']
  },

  // Amenities synonyms
  {
    objectID: 'food-snacks',
    type: 'synonym',
    synonyms: ['food', 'snacks', 'meals', 'dining', 'restaurant']
  },
  {
    objectID: 'restroom-bathroom',
    type: 'synonym',
    synonyms: ['restroom', 'bathroom', 'toilet', 'washroom', 'facilities']
  },
  {
    objectID: 'parking-car',
    type: 'synonym',
    synonyms: ['parking', 'car park', 'garage', 'parking lot', 'parking space']
  },

  // Accessibility synonyms
  {
    objectID: 'wheelchair-accessible',
    type: 'synonym',
    synonyms: ['wheelchair', 'accessible', 'disability friendly', 'handicap accessible']
  },
  {
    objectID: 'pet-friendly',
    type: 'synonym',
    synonyms: ['pet friendly', 'dog friendly', 'pets allowed', 'pet welcome']
  }
];

// Index settings configuration
const indexSettings = {
  // Searchable attributes configuration
  searchableAttributes: [
    'title',
    'summary',
    'type',
    'metadata',
    'tags',
    'location'
  ],

  // Attributes for faceting (filtering)
  attributesForFaceting: [
    'type',
    'metadata',
    'tags',
    'location'
  ],

  // Typo tolerance settings
  typoTolerance: true,
  minWordSizefor1Typo: 4,     // Allow 1 typo for words >= 4 characters
  minWordSizefor2Typos: 8,    // Allow 2 typos for words >= 8 characters

  // Query expansion settings
  ignorePlurals: true,           // "cafe" matches "cafes"
  removeStopWords: true,         // Remove common words like "the", "a", "an"

  // Ranking and relevance
  ranking: [
    'typo',        // Prefer exact matches over typos
    'geo',         // Geographic proximity (if using geo search)
    'words',       // Number of query words matched
    'filters',     // Applied filters
    'proximity',   // Proximity of query words
    'attribute',   // Searchable attribute order
    'exact',       // Exact matches
    'custom'       // Custom ranking criteria
  ],

  // Highlighting settings
  highlightPreTag: '<mark>',
  highlightPostTag: '</mark>',

  // Advanced settings
  minProximity: 1,               // Minimum proximity between query words
  maxValuesPerFacet: 100        // Maximum values per facet
};

// Function to apply synonyms to the index
async function applySynonyms() {
  try {
    console.log('Applying synonyms to Algolia index...');

    // Save synonyms in batches
    const batchSize = 100;
    for (let i = 0; i < synonyms.length; i += batchSize) {
      const batch = synonyms.slice(i, i + batchSize);
      for (const synonym of batch) {
        await client.saveSynonym({
          indexName: indexName,
          objectID: synonym.objectID,
          synonymHit: synonym
        });
      }
      console.log(`Applied synonyms batch ${Math.floor(i / batchSize) + 1}`);
    }

    console.log('All synonyms applied successfully');
    return true;
  } catch (error) {
    console.error('Error applying synonyms:', error);
    return false;
  }
}

// Function to apply index settings
async function applyIndexSettings() {
  try {
    console.log('Applying index settings...');

    await client.setSettings({
      indexName: indexName,
      indexSettings: indexSettings
    });

    console.log('Index settings applied successfully');
    return true;
  } catch (error) {
    console.error('Error applying index settings:', error);
    return false;
  }
}

// Function to test the configuration
async function testConfiguration() {
  try {
    console.log('Testing search configuration...');

    // Test typo tolerance
    const typoResults = await client.searchSingleIndex({
      indexName: indexName,
      searchParams: { query: 'quitet' }
    }); // Should match "quiet"
    console.log(`Typo test "quitet" returned ${typoResults.hits.length} results`);

    // Test synonyms
    const synonymResults = await client.searchSingleIndex({
      indexName: indexName,
      searchParams: { query: 'power' }
    }); // Should match "outlets"
    console.log(`Synonym test "power" returned ${synonymResults.hits.length} results`);

    // Test another synonym
    const wifiResults = await client.searchSingleIndex({
      indexName: indexName,
      searchParams: { query: 'internet' }
    }); // Should match "wifi"
    console.log(`Synonym test "internet" returned ${wifiResults.hits.length} results`);

    console.log('Configuration test completed');
    return true;
  } catch (error) {
    console.error('Error testing configuration:', error);
    return false;
  }
}

// Main function to run all configurations
async function configureAlgoliaIndex() {
  console.log(`Configuring Algolia index: ${indexName}`);
  console.log('=====================================');

  try {
    // Apply index settings first
    const settingsSuccess = await applyIndexSettings();
    if (!settingsSuccess) {
      throw new Error('Failed to apply index settings');
    }

    // Then apply synonyms
    const synonymsSuccess = await applySynonyms();
    if (!synonymsSuccess) {
      throw new Error('Failed to apply synonyms');
    }

    // Wait a moment for indexing
    console.log('Waiting for index to update...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Test the configuration
    await testConfiguration();

    console.log('=====================================');
    console.log('Algolia index configuration completed successfully!');

  } catch (error) {
    console.error('Configuration failed:', error);
    process.exit(1);
  }
}

// Export functions for use in other scripts
module.exports = {
  configureAlgoliaIndex,
  applySynonyms,
  applyIndexSettings,
  testConfiguration,
  synonyms,
  indexSettings
};

// Run if called directly
if (require.main === module) {
  configureAlgoliaIndex();
}