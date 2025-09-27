"use client";

import { useState } from 'react';
import {
  InstantSearch,
  SearchBox,
  Hits,
  Pagination,
  Configure,
  Stats,
  PoweredBy,
  useHits,
  useSearchBox,
} from 'react-instantsearch';
import { liteClient as algoliasearch } from 'algoliasearch/lite';
import { Search, AlertTriangle } from 'lucide-react';

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID;
const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_API_KEY;

if (!appId || !apiKey) {
  console.error('Algolia credentials are missing. Please check your environment variables.');
}

const searchClient = algoliasearch(appId || '', apiKey || '');

interface Hit {
  objectID: string;
  title: string;
  summary: string;
  type?: string;
  image?: string;
  metadata?: string[];
}

interface AlgoliaSearchProps {
  isHeroMode?: boolean;
}

function Hit({ hit }: { hit: Hit }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {hit.image && (
          <img
            src={hit.image}
            alt={hit.title}
            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
          />
        )}
        <div className="flex-grow min-w-0">
          {hit.type && (
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold text-white mb-2
              ${hit.type === "cafe" ? "bg-[#A9745B]" :
                hit.type === "event" ? "bg-[#82B0D8]" :
                  hit.type === "study" ? "bg-[#8FBF8F]" :
                    "bg-gray-500"}
            `}>
              {hit.type.toUpperCase()}
            </span>
          )}
          <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">
            {hit.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {hit.summary}
          </p>
          {hit.metadata && hit.metadata.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {hit.metadata.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-[#F5F5DC] text-[#6B4F37] text-xs px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SearchResults() {
  const { hits } = useHits();
  const { query } = useSearchBox();

  if (!query) return null;

  if (hits.length === 0) {
    return (
      <div className="text-center py-12">
        <Search className="text-gray-400 w-16 h-16 mb-4 mx-auto" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
        <p className="text-gray-600">Try adjusting your search terms or browse our categories.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mb-8">
      <Hits
        hitComponent={Hit}
        classNames={{
          root: '',
          list: 'space-y-4',
          item: '',
        }}
      />
    </div>
  );
}

function HeroSearchBox() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { query } = useSearchBox();

  const handleFocus = () => setIsExpanded(true);
  const handleBlur = () => {
    if (!query) setIsExpanded(false);
  };

  return (
    <div className="relative">
      <div className="flex w-full max-w-3xl h-16 rounded-full border border-gray-300 bg-white shadow-md overflow-hidden items-center">
        <SearchBox
          placeholder="Search cafés, events, study spots..."
          classNames={{
            root: 'flex-grow',
            form: 'flex items-center h-full',
            input: 'flex-grow px-4 text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent border-0',
            submit: 'h-full px-6 bg-[#6B4026] text-white font-semibold hover:bg-[#4E2F1C] border-0 rounded-r-full',
            submitIcon: 'w-5 h-5',
            reset: 'px-2 text-gray-400 hover:text-gray-600',
            resetIcon: 'w-4 h-4',
            loadingIndicator: 'px-2',
            loadingIcon: 'w-4 h-4 text-[#6B4026] animate-spin'
          }}
          submitIconComponent={() => <span>Search</span>}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>

      {/* Results dropdown */}
      {isExpanded && query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <Stats
                classNames={{
                  root: 'text-sm text-gray-600',
                }}
              />
              <PoweredBy
                classNames={{
                  root: 'text-xs',
                }}
              />
            </div>
            <SearchResults />
            <div className="flex justify-center mt-4">
              <Pagination
                classNames={{
                  root: 'flex items-center gap-2',
                  list: 'flex items-center gap-1',
                  item: 'inline-flex',
                  link: 'px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 hover:text-[#6B4026]',
                  selectedItem: 'px-3 py-2 text-sm font-medium text-white bg-[#6B4026] border border-[#6B4026] rounded',
                  disabledItem: 'px-3 py-2 text-sm font-medium text-gray-300 bg-gray-100 border border-gray-200 rounded cursor-not-allowed',
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FullPageSearch() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <SearchBox
          placeholder="Search cafés, events, study spots..."
          classNames={{
            root: 'relative',
            form: 'relative',
            input: 'w-full h-14 px-4 pr-12 rounded-full border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6B4026] focus:border-transparent text-gray-700 placeholder-gray-400',
            submit: 'absolute right-3 top-1/2 transform -translate-y-1/2 bg-[#6B4026] text-white p-2 rounded-full hover:bg-[#4E2F1C] transition-colors',
            submitIcon: 'w-4 h-4',
            reset: 'absolute right-14 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1',
            resetIcon: 'w-4 h-4',
            loadingIndicator: 'absolute right-24 top-1/2 transform -translate-y-1/2',
            loadingIcon: 'w-4 h-4 text-[#6B4026] animate-spin'
          }}
        />
      </div>

      <div className="flex justify-between items-center mb-4">
        <Stats
          classNames={{
            root: 'text-sm text-gray-600',
          }}
        />
        <PoweredBy
          classNames={{
            root: 'text-xs',
          }}
        />
      </div>

      <SearchResults />

      <div className="flex justify-center">
        <Pagination
          classNames={{
            root: 'flex items-center gap-2',
            list: 'flex items-center gap-1',
            item: 'inline-flex',
            link: 'px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 hover:text-[#6B4026]',
            selectedItem: 'px-3 py-2 text-sm font-medium text-white bg-[#6B4026] border border-[#6B4026] rounded',
            disabledItem: 'px-3 py-2 text-sm font-medium text-gray-300 bg-gray-100 border border-gray-200 rounded cursor-not-allowed',
          }}
        />
      </div>
    </div>
  );
}

export default function AlgoliaSearch({ isHeroMode = false }: AlgoliaSearchProps) {
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
      <Configure hitsPerPage={10} />
      {isHeroMode ? <HeroSearchBox /> : <FullPageSearch />}
    </InstantSearch>
  );
}