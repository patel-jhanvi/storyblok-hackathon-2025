"use client";

import { InstantSearch, Configure } from 'react-instantsearch';
import { liteClient as algoliasearch } from 'algoliasearch/lite';
import InstantFilters from './InstantFilters';

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID;
const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_API_KEY;

if (!appId || !apiKey) {
  console.error('Algolia credentials are missing. Please check your environment variables.');
}

const searchClient = algoliasearch(appId || '', apiKey || '');

export default function StandaloneFilters() {
  const indexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'brewbook';

  if (!appId || !apiKey) {
    return null; // Don't render if credentials are missing
  }

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={indexName}
      future={{
        preserveSharedStateOnUnmount: true,
      }}
    >
      <Configure hitsPerPage={0} />
      <div className="max-w-4xl mx-auto px-4">
        <InstantFilters />
      </div>
    </InstantSearch>
  );
}