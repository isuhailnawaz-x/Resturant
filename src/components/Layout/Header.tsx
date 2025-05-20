import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Utensils, User, Calendar, LogOut, Menu, X } from 'lucide-react';
import { useUserStore } from '../../lib/store';

const Header: React.FC = () => {
  const { user, signOut } = useUserStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Detect scroll position for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when navigating
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-md py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            to="/" 
            className={`flex items-center transition-colors ${
              isScrolled ? 'text-primary-700' : 'text-white'
            }`}
          >
            <Utensils className="w-6 h-6 mr-2" />
            <span className="text-xl font-serif font-bold">Diné</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/restaurants" 
              className={`font-medium transition-colors ${
                isScrolled ? 'text-stone-800 hover:text-primary-700' : 'text-white hover:text-accent-300'
              }`}
            >
              Restaurants
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-6">
                <Link 
                  to="/my-reservations" 
                  className={`font-medium transition-colors flex items-center ${
                    isScrolled ? 'text-stone-800 hover:text-primary-700' : 'text-white hover:text-accent-300'
                  }`}
                >
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>My Reservations</span>
                </Link>
                
                <Link 
                  to="/profile" 
                  className={`font-medium transition-colors flex items-center ${
                    isScrolled ? 'text-stone-800 hover:text-primary-700' : 'text-white hover:text-accent-300'
                  }`}
                >
                  <User className="w-4 h-4 mr-1" />
                  <span>Profile</span>
                </Link>
                
                <button 
                  onClick={handleSignOut}
                  className={`font-medium transition-colors flex items-center ${
                    isScrolled ? 'text-stone-800 hover:text-primary-700' : 'text-white hover:text-accent-300'
                  }`}
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className={`font-medium transition-colors ${
                    isScrolled ? 'text-stone-800 hover:text-primary-700' : 'text-white hover:text-accent-300'
                  }`}
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="font-medium bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? (
              <X className={isScrolled ? 'text-stone-800' : 'text-white'} />
            ) : (
              <Menu className={isScrolled ? 'text-stone-800' : 'text-white'} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg animate-slide-up">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/restaurants" 
                className="font-medium text-stone-800 hover:text-primary-700 py-2"
              >
                Restaurants
              </Link>
              
              {user ? (
                <>
                  <Link 
                    to="/my-reservations" 
                    className="font-medium text-stone-800 hover:text-primary-700 py-2 flex items-center"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>My Reservations</span>
                  </Link>
                  
                  <Link 
                    to="/profile" 
                    className="font-medium text-stone-800 hover:text-primary-700 py-2 flex items-center"
                  >
                    <User className="w-4 h-4 mr-2" />
                    <span>Profile</span>
                  </Link>
                  
                  <button 
                    onClick={handleSignOut}
                    className="font-medium text-stone-800 hover:text-primary-700 py-2 flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-3">
                  <Link 
                    to="/login" 
                    className="font-medium text-stone-800 hover:text-primary-700 py-2"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/register" 
                    className="font-medium bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded text-center"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;