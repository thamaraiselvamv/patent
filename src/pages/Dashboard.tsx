import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, Search, BookmarkCheck, Bell, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export function Dashboard() {
  const { user } = useAuth();
  const [recentSearches, setRecentSearches] = React.useState([]);
  const [watchlist, setWatchlist] = React.useState([]);

  React.useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const { data: searches } = await supabase
        .from('user_searches')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentSearches(searches || []);

      const { data: watchlistItems } = await supabase
        .from('watchlist')
        .select('*')
        .order('created_at', { ascending: false });

      setWatchlist(watchlistItems || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-8"
        >
          {/* Welcome Section */}
          <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.fullName}</h1>
            <p className="mt-2 text-gray-600">Manage your intellectual property portfolio</p>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/patent-search" className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <Search className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold">New Search</h3>
              <p className="text-gray-600 mt-2">Start a new patent or trademark search</p>
            </Link>

            <Link to="/watchlist" className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <BookmarkCheck className="h-8 w-8 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold">Watchlist</h3>
              <p className="text-gray-600 mt-2">Monitor your saved items</p>
            </Link>

            <Link to="/notifications" className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <Bell className="h-8 w-8 text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold">Notifications</h3>
              <p className="text-gray-600 mt-2">View updates and alerts</p>
            </Link>
          </motion.div>

          {/* Recent Searches */}
          <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Searches</h2>
              <Link to="/search-history" className="text-blue-600 hover:text-blue-700">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {recentSearches.map((search: any) => (
                <div key={search.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{search.query}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(search.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Link
                    to={`/${search.type}-search?q=${encodeURIComponent(search.query)}`}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Repeat Search
                  </Link>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Watchlist */}
          <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Watchlist</h2>
              <Link to="/watchlist" className="text-blue-600 hover:text-blue-700">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {watchlist.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.type} • {item.status}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}