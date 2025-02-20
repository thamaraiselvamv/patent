import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileSearch, ChevronLeft, UserCircle, Moon, Sun, History } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 rounded-full hover:bg-gray-100"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            
            <Link to="/" className="flex items-center">
              <FileSearch className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold">PatentSearch</span>
            </Link>
            
            <div className="ml-10 flex items-center space-x-4">
              <Link to="/patent-search" className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600">
                <FileSearch className="h-5 w-5 mr-1" />
                Patent Search
              </Link>
              <Link to="/dashboard" className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600">
                <History className="h-5 w-5 mr-1" />
                Search History
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-gray-600" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
                >
                  <UserCircle className="h-8 w-8 text-gray-600" />
                  <span className="text-gray-700">{user.fullName}</span>
                </button>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1">
                    <Link to="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Dashboard
                    </Link>
                    <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Profile Settings
                    </Link>
                    <Link to="/search-history" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Search History
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-blue-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}