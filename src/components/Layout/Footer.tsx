import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <Utensils className="w-6 h-6 mr-2" />
              <span className="text-xl font-serif font-bold">Diné</span>
            </Link>
            <p className="text-stone-300 mb-4">
              Making fine dining reservations simple, fast, and enjoyable.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-stone-300 hover:text-accent-500 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="#" 
                className="text-stone-300 hover:text-accent-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="#" 
                className="text-stone-300 hover:text-accent-500 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-stone-300 hover:text-accent-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/restaurants" className="text-stone-300 hover:text-accent-500 transition-colors">
                  Restaurants
                </Link>
              </li>
              <li>
                <Link to="/my-reservations" className="text-stone-300 hover:text-accent-500 transition-colors">
                  My Reservations
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-stone-300 hover:text-accent-500 transition-colors">
                  Profile
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Resources */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-stone-300 hover:text-accent-500 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-stone-300 hover:text-accent-500 transition-colors">
                  For Restaurants
                </a>
              </li>
              <li>
                <a href="#" className="text-stone-300 hover:text-accent-500 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-stone-300 hover:text-accent-500 transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-stone-300 mb-4">
              Subscribe to our newsletter for special offers and restaurant updates.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="bg-stone-800 text-white rounded-l px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-accent-500"
              />
              <button
                type="submit"
                className="bg-accent-500 hover:bg-accent-600 text-white rounded-r px-4 py-2 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-stone-700 mt-8 pt-6 text-center text-stone-400">
          <p>&copy; {new Date().getFullYear()} Diné Reservations. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;