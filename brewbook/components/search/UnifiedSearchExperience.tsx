"use client";

import { useState } from 'react';
import { InstantSearch, Configure, useInfiniteHits } from 'react-instantsearch';
import { liteClient as algoliasearch } from 'algoliasearch/lite';
import { AlertTriangle } from 'lucide-react';
import InstantFilters from './InstantFilters';
import Card from '../ui/Card';

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID;
const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_API_KEY;

if (!appId || !apiKey) {
  console.error('Algolia credentials are missing. Please check your environment variables.');
}

const searchClient = algoliasearch(appId || '', apiKey || '');

interface AlgoliaHit {
  objectID: string;
  title: string;
  summary?: string;
  short_summary?: string;
  image?: string;
  hero_image?: string;
  metadata?: string[];
  tags?: string[];
  type: 'cafe' | 'event' | 'study';
  slug: string;
  address?: string;
  _geoloc?: {
    lat: number;
    lng: number;
  };
}

function SearchResults() {
  const { hits, showMore, isLastPage } = useInfiniteHits<AlgoliaHit>();
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Show loading while search is processing
  if (hits.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
        <p className="text-gray-600">Try adjusting your filters or browse all our locations.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {hits.map((hit) => (
          <Card
            key={hit.objectID}
            id={hit.slug}
            type={hit.type}
            title={hit.title}
            summary={hit.summary || hit.short_summary || ''}
            image={hit.image || hit.hero_image || ''}
            metadata={hit.metadata || hit.tags || []}
            address={hit.address}
            lat={hit._geoloc?.lat}
            lng={hit._geoloc?.lng}
          />
        ))}
      </div>

      {!isLastPage && (
        <div className="text-center mt-8">
          <button
            onClick={async () => {
              setIsLoadingMore(true);
              try {
                await showMore();
              } finally {
                setIsLoadingMore(false);
              }
            }}
            disabled={isLoadingMore}
            className="px-6 py-3 bg-[#6B4026] text-white font-medium rounded-lg hover:bg-[#4E2F1C] transition-colors flex items-center justify-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoadingMore ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Load More
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default function UnifiedSearchExperience() {
  const indexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'brewbook';

  if (!appId || !apiKey) {
    return (
      <div className="flex items-center justify-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="text-center">
          <AlertTriangle className="text-yellow-600 w-8 h-8 mb-2 mx-auto" />
          <p className="text-sm text-yellow-800">Search is temporarily unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={indexName}
      future={{
        preserveSharedStateOnUnmount: true,
      }}
    >
      <Configure
        hitsPerPage={6}
        attributesToRetrieve={[
          'objectID',
          'title',
          'summary',
          'short_summary',
          'image',
          'hero_image',
          'metadata',
          'tags',
          'type',
          'slug',
          'address',
          '_geoloc'
        ]}
        facets={[
          'wifi',
          'power_outlets',
          'noise_level',
          'price_range',
          'type'
        ]}
      />

      {/* Filters */}
      <div className="mb-8">
        <InstantFilters />
      </div>

      {/* Results */}
      <div className="p-8">
        <SearchResults />
      </div>
    </InstantSearch>
  );
}