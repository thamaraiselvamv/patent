import React from 'react';
import { Link } from 'react-router-dom';
import { FileSearch, Image, Users, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

export function Home() {
  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-fixed">
      <div className="min-h-screen bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
              Patent & Trademark Search
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-200 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Search patents and trademarks across Indian and global databases. Protect your intellectual property with ease.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-16"
          >
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Link to="/patent-search" className="block transform hover:scale-105 transition-transform">
                <div className="relative rounded-lg border border-gray-200 bg-white/90 backdrop-blur-sm p-6 shadow-lg hover:shadow-xl">
                  <div className="flex items-center">
                    <FileSearch className="h-8 w-8 text-blue-600" />
                    <h3 className="ml-3 text-xl font-semibold text-gray-900">Patent Search</h3>
                  </div>
                  <p className="mt-4 text-gray-600">
                    Search through millions of patents across global databases
                  </p>
                </div>
              </Link>

              <Link to="/image-search" className="block transform hover:scale-105 transition-transform">
                <div className="relative rounded-lg border border-gray-200 bg-white/90 backdrop-blur-sm p-6 shadow-lg hover:shadow-xl">
                  <div className="flex items-center">
                    <Image className="h-8 w-8 text-green-600" />
                    <h3 className="ml-3 text-xl font-semibold text-gray-900">Image Search</h3>
                  </div>
                  <p className="mt-4 text-gray-600">
                    Find similar patents using image recognition
                  </p>
                </div>
              </Link>

              <Link to="/orders" className="block transform hover:scale-105 transition-transform">
                <div className="relative rounded-lg border border-gray-200 bg-white/90 backdrop-blur-sm p-6 shadow-lg hover:shadow-xl">
                  <div className="flex items-center">
                    <ShoppingBag className="h-8 w-8 text-purple-600" />
                    <h3 className="ml-3 text-xl font-semibold text-gray-900">My Orders</h3>
                  </div>
                  <p className="mt-4 text-gray-600">
                    View your purchased patents and trademarks
                  </p>
                </div>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}