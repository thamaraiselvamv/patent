import React, { useState, useEffect } from 'react';
import { Search, Filter, Download } from 'lucide-react';
import { SearchFilters, SearchResult } from '../lib/types';
import toast from 'react-hot-toast';

interface AdvancedSearchProps {
  type: 'patent' | 'trademark';
  onSearch: (query: string, filters: SearchFilters) => Promise<SearchResult[]>;
}

export function AdvancedSearch({ type, onSearch }: AdvancedSearchProps) {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    dateRange: undefined,
    jurisdiction: undefined,
    category: undefined,
    status: undefined
  });

  // Real-time search effect
  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.length >= 2) {
        try {
          setLoading(true);
          // Fetch from Wikipedia API
          const wikiResponse = await fetch(
            `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
              query
            )}&format=json&origin=*`
          );
          const wikiData = await wikiResponse.json();
          
          // Fetch from Google Patents API (simulated)
          const patentResults = wikiData.query.search.map((item: any) => ({
            id: item.pageid.toString(),
            type: 'patent',
            title: item.title,
            number: `PAT${Math.floor(Math.random() * 1000000)}`,
            date: new Date().toISOString().split('T')[0],
            status: 'Active',
            description: item.snippet.replace(/<\/?[^>]+(>|$)/g, ""),
            company: item.title.split(' ')[0],
            price: Math.floor(Math.random() * 1000000) + 50000 // Random price between ₹50,000 and ₹1,050,000
          }));

          setResults(patentResults);
        } catch (error) {
          console.error('Search error:', error);
          toast.error('Error performing search');
        } finally {
          setLoading(false);
        }
      }
    }, 500);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    try {
      setLoading(true);
      const searchResults = await onSearch(query, filters);
      setResults(searchResults);
    } catch (error) {
      toast.error('Error performing search');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patents and companies..."
            className="w-full px-4 py-3 pl-12 text-gray-900 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="absolute right-20 top-2 px-3 py-1.5 text-gray-600 hover:text-gray-900"
          >
            <Filter className="h-5 w-5" />
          </button>
          <button
            type="submit"
            className="absolute right-2 top-2 px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Search
          </button>
        </div>

        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date Range</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <input
                    type="date"
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, start: e.target.value }
                    }))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <input
                    type="date"
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, end: e.target.value }
                    }))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Jurisdiction</label>
                <select
                  onChange={(e) => setFilters(prev => ({ ...prev, jurisdiction: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">All</option>
                  <option value="IN">India</option>
                  <option value="US">United States</option>
                  <option value="EP">European Union</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </form>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-6">
          <div className="space-y-4">
            {results.map((result) => (
              <div key={result.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{result.title}</h3>
                    <p className="text-gray-600 mb-4">{result.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Patent Number</p>
                        <p className="font-medium">{result.number}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Company</p>
                        <p className="font-medium">{result.company}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <p className="font-medium">{result.status}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Price</p>
                        <p className="font-medium text-green-600">₹{result.price.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toast.success('Redirecting to purchase flow...')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Purchase
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}