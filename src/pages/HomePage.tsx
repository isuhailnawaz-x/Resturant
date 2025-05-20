import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Clock, Users, ArrowRight, Star, Coffee, UtensilsCrossed } from 'lucide-react';
import RestaurantCard from '../components/Restaurant/RestaurantCard';
import SearchBar from '../components/Restaurant/SearchBar';

// Sample restaurant data (would typically come from Supabase)
const featuredRestaurants = [
  {
    id: 1,
    name: 'Bella Cucina',
    cuisine: 'Italian',
    address: '123 Main St, Cityville',
    rating: 4.7,
    image_url: 'https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 2,
    name: 'Sakura Sushi',
    cuisine: 'Japanese',
    address: '456 Oak Ave, Townsville',
    rating: 4.9,
    image_url: 'https://images.pexels.com/photos/2323398/pexels-photo-2323398.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 3,
    name: 'Le Bistro',
    cuisine: 'French',
    address: '789 Elm Blvd, Villageton',
    rating: 4.5,
    image_url: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
];

const cuisineTypes = [
  { name: 'Italian', icon: <UtensilsCrossed size={24} /> },
  { name: 'Japanese', icon: <Coffee size={24} /> },
  { name: 'French', icon: <UtensilsCrossed size={24} /> },
  { name: 'Mexican', icon: <UtensilsCrossed size={24} /> },
  { name: 'Indian', icon: <UtensilsCrossed size={24} /> },
  { name: 'Chinese', icon: <UtensilsCrossed size={24} /> },
];

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section 
        className="relative pt-32 pb-20 md:pt-48 md:pb-24 px-4"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(https://images.pexels.com/photos/372882/pexels-photo-372882.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 animate-fade-in">
            Discover and Reserve <br className="hidden md:block" />
            <span className="text-accent-400">Extraordinary Dining</span>
          </h1>
          <p className="text-xl text-white opacity-90 mb-8 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Find and book tables at the finest restaurants near you. 
            No phone calls, no waiting - just perfect dining experiences.
          </p>
          
          <div className="max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <SearchBar />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-stone-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-stone-900 text-center mb-12">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-2xl shadow-card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-primary-700" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Search</h3>
              <p className="text-stone-600">
                Find restaurants by cuisine, location, or availability. 
                Browse menus and read reviews from other diners.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="bg-white p-6 rounded-2xl shadow-card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-primary-700" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Reserve</h3>
              <p className="text-stone-600">
                Select your date, time, and party size. 
                Book instantly with real-time availability.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="bg-white p-6 rounded-2xl shadow-card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UtensilsCrossed className="w-8 h-8 text-primary-700" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Dine</h3>
              <p className="text-stone-600">
                Arrive and enjoy your meal knowing your table is ready. 
                No waiting, no hassle. Just great dining.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-serif font-bold text-stone-900">
              Featured Restaurants
            </h2>
            <Link 
              to="/restaurants" 
              className="text-primary-700 hover:text-primary-800 font-medium flex items-center transition-colors"
            >
              View all <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRestaurants.map((restaurant) => (
              <RestaurantCard 
                key={restaurant.id}
                restaurant={restaurant}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Cuisine Types */}
      <section className="py-16 bg-stone-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-stone-900 text-center mb-12">
            Explore by Cuisine
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {cuisineTypes.map((cuisine, index) => (
              <Link 
                key={index}
                to={`/restaurants?cuisine=${cuisine.name}`}
                className="bg-white rounded-xl p-6 flex flex-col items-center justify-center shadow-subtle hover:shadow-card transition-all transform hover:-translate-y-1"
              >
                <div className="text-primary-700 mb-3">
                  {cuisine.icon}
                </div>
                <span className="font-medium">{cuisine.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="py-16 px-4 text-center"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container mx-auto max-w-3xl">
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
              Perfect Dining Awaits
            </h2>
            <p className="text-lg text-white opacity-90 mb-8">
              Join thousands of food lovers who have discovered their new favorite restaurants through Diné.
            </p>
            <Link 
              to="/register"
              className="inline-block bg-accent-500 hover:bg-accent-600 text-white font-medium px-8 py-3 rounded-lg transition-colors"
            >
              Sign Up Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;