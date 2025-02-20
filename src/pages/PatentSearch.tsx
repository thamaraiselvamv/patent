import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { AdvancedSearch } from '../components/AdvancedSearch';
import { ImageUpload } from '../components/ImageUpload';
import { SearchFilters, SearchResult, ImageSearchResult } from '../lib/types';
import { supabase } from '../lib/supabase';
import { FileText, Image, DollarSign, Shield, Award } from 'lucide-react';
import toast from 'react-hot-toast';

export function PatentSearch() {
  const [searchMode, setSearchMode] = useState<'none' | 'text' | 'image'>('none');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [imageResults, setImageResults] = useState<ImageSearchResult[]>([]);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const handleSearch = async (query: string, filters: SearchFilters): Promise<SearchResult[]> => {
    try {
      const { data, error } = await supabase
        .from('patents')
        .select('*')
        .textSearch('title', query)
        .eq('jurisdiction', filters.jurisdiction || '')
        .gte('filing_date', filters.dateRange?.start || '')
        .lte('filing_date', filters.dateRange?.end || '');

      if (error) throw error;

      const results = data.map(patent => ({
        id: patent.id,
        type: 'patent',
        title: patent.title,
        number: patent.application_number,
        date: patent.filing_date,
        status: patent.status
      }));

      setSearchResults(results);
      return results;
    } catch (error) {
      toast.error('Error performing search');
      return [];
    }
  };

  const handleImageSearch = async (file: File): Promise<ImageSearchResult[]> => {
    try {
      // Simulated API call
      const mockResults: ImageSearchResult[] = [
        {
          id: '1',
          type: 'patent',
          title: 'Smart Device Design Pattern',
          number: 'US20230123456',
          date: '2023-01-01',
          status: 'Active',
          similarityScore: 0.95,
          imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837',
          companyName: 'TechCorp Industries',
          patentDetails: {
            filingDate: '2022-01-01',
            expiryDate: '2042-01-01',
            inventors: ['John Smith', 'Maria Garcia'],
            description: 'A novel design pattern for smart device interfaces...',
            purchasePrice: 250000, // ₹250,000
            licenseOptions: ['Full Rights', 'Limited Use', 'Research Only']
          }
        }
      ];

      setImageResults(mockResults);
      return mockResults;
    } catch (error) {
      toast.error('Error processing image');
      return [];
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-fixed"
    >
      <div className="min-h-screen bg-black/50 backdrop-blur-sm py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Patent Search</h1>
            <p className="text-xl text-gray-200">
              Choose your search method to discover and protect intellectual property
            </p>
          </motion.div>

          {searchMode === 'none' && (
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSearchMode('text')}
                className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-lg hover:shadow-xl transition-all group"
              >
                <FileText className="h-16 w-16 text-blue-600 mb-4 mx-auto group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-semibold mb-2">Text Search</h3>
                <p className="text-gray-600">Search patents using keywords and filters</p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSearchMode('image')}
                className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-lg hover:shadow-xl transition-all group"
              >
                <Image className="h-16 w-16 text-green-600 mb-4 mx-auto group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-semibold mb-2">Image Search</h3>
                <p className="text-gray-600">Find similar patents using an image</p>
              </motion.button>
            </motion.div>
          )}

          {searchMode !== 'none' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSearchMode('none')}
                className="mb-8 px-6 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
              >
                ← Back to Search Options
              </motion.button>

              <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-lg">
                {searchMode === 'text' && <AdvancedSearch type="patent" onSearch={handleSearch} />}
                {searchMode === 'image' && <ImageUpload onImageSearch={handleImageSearch} />}
              </div>

              {/* Results Section */}
              {(searchResults.length > 0 || imageResults.length > 0) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-8 bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-lg"
                >
                  <h2 className="text-2xl font-semibold mb-6">Search Results</h2>
                  <div className="space-y-6">
                    {searchMode === 'image' ? (
                      imageResults.map((result) => (
                        <div key={result.id} className="border rounded-lg p-6">
                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="w-full md:w-1/3">
                              <img
                                src={result.imageUrl}
                                alt={result.title}
                                className="w-full h-48 object-cover rounded-lg shadow-md"
                              />
                              <div className="mt-4">
                                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm inline-flex items-center">
                                  <DollarSign className="h-4 w-4 mr-1" />
                                  Available for Purchase
                                </div>
                              </div>
                            </div>
                            <div className="w-full md:w-2/3">
                              <h3 className="text-xl font-semibold mb-2">{result.title}</h3>
                              <p className="text-gray-600 mb-4">{result.patentDetails.description}</p>
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                  <p className="text-sm text-gray-600">Company</p>
                                  <p className="font-medium">{result.companyName}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">Similarity Score</p>
                                  <p className="font-medium">{(result.similarityScore * 100).toFixed(1)}%</p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between mt-4">
                                <div>
                                  <p className="text-sm text-gray-600">Purchase Price</p>
                                  <p className="text-2xl font-bold text-green-600">
                                    ₹{result.patentDetails.purchasePrice.toLocaleString()}
                                  </p>
                                </div>
                                <button
                                  onClick={() => toast.success('Redirecting to purchase flow...')}
                                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                  Purchase Rights
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      searchResults.map((result) => (
                        <div key={result.id} className="border rounded-lg p-6">
                          <h3 className="text-xl font-semibold mb-2">{result.title}</h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">Patent Number</p>
                              <p className="font-medium">{result.number}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Filing Date</p>
                              <p className="font-medium">{result.date}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Status</p>
                              <p className="font-medium">{result.status}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}