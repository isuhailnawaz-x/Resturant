import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Filter, MapPin } from 'lucide-react';
import { useRestaurantStore } from '../lib/store';
import RestaurantCard from '../components/Restaurant/RestaurantCard';
import SearchBar from '../components/Restaurant/SearchBar';

const cuisineTypes = [
  'All',
  'Italian',
  'Japanese', 
  'French',
  'Mexican',
  'Indian',
  'Chinese',
];

const RestaurantsPage: React.FC = () => {
  const location = useLocation();
  const { restaurants, filteredRestaurants, fetchRestaurants, searchRestaurants } = useRestaurantStore();
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Get search parameters from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get('search') || '';
    const cuisineQuery = params.get('cuisine') || '';
    
    if (cuisineQuery && cuisineTypes.includes(cuisineQuery)) {
      setSelectedCuisine(cuisineQuery);
    }
    
    // Fetch restaurants on mount
    fetchRestaurants().then(() => {
      // Apply search filters after data is loaded
      searchRestaurants(searchQuery, cuisineQuery !== 'All' ? cuisineQuery : '');
    });
  }, [location.search, fetchRestaurants, searchRestaurants]);

  const handleCuisineChange = (cuisine: string) => {
    setSelectedCuisine(cuisine);
    searchRestaurants('', cuisine !== 'All' ? cuisine : '');
  };

  return (
    <div className="pt-20 pb-16">
      {/* Search Section */}
      <section className="bg-primary-800 py-10 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-serif font-bold text-white mb-6">
            Find Your Perfect Dining Experience
          </h1>
          <SearchBar />
        </div>
      </section>
      
      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-serif font-semibold text-stone-800">
              {filteredRestaurants.length} Restaurants
            </h2>
            
            <button 
              className="md:hidden flex items-center space-x-2 text-stone-700 border border-stone-300 rounded-full px-4 py-2"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter size={18} />
              <span>Filters</span>
            </button>
          </div>
          
          {/* Desktop filters */}
          <div className="hidden md:block">
            <div className="bg-white shadow-subtle rounded-lg p-4">
              <div className="flex flex-wrap gap-2">
                {cuisineTypes.map((cuisine) => (
                  <button
                    key={cuisine}
                    onClick={() => handleCuisineChange(cuisine)}
                    className={`px-4 py-2 rounded-full transition-colors ${
                      selectedCuisine === cuisine
                        ? 'bg-primary-700 text-white'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {cuisine}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Mobile filters (shows when isFilterOpen is true) */}
          {isFilterOpen && (
            <div className="md:hidden bg-white shadow-md rounded-lg p-4 mt-4">
              <h3 className="font-medium mb-3">Cuisine Type</h3>
              <div className="flex flex-wrap gap-2">
                {cuisineTypes.map((cuisine) => (
                  <button
                    key={cuisine}
                    onClick={() => {
                      handleCuisineChange(cuisine);
                      setIsFilterOpen(false);
                    }}
                    className={`px-4 py-2 rounded-full transition-colors ${
                      selectedCuisine === cuisine
                        ? 'bg-primary-700 text-white'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {cuisine}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Restaurant Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
            />
          ))}
        </div>
        
        {/* No results */}
        {filteredRestaurants.length === 0 && (
          <div className="text-center py-10">
            <p className="text-xl text-stone-600 mb-4">No restaurants found matching your criteria.</p>
            <p className="text-stone-500">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantsPage;