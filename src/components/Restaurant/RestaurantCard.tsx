import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

interface RestaurantCardProps {
  restaurant: {
    id: number;
    name: string;
    cuisine: string;
    address: string;
    rating?: number;
    image_url: string;
  };
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  return (
    <Link 
      to={`/restaurants/${restaurant.id}`} 
      className="block bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-lg transition-shadow group"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={restaurant.image_url} 
          alt={restaurant.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {restaurant.rating && (
          <div className="absolute top-4 right-4 bg-white text-primary-700 font-medium rounded-full px-2 py-1 text-sm flex items-center">
            <Star className="w-4 h-4 text-accent-500 mr-1 fill-accent-500" />
            {restaurant.rating}
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-stone-800 font-serif">{restaurant.name}</h3>
          <span className="text-sm px-2 py-1 bg-stone-100 text-stone-600 rounded">
            {restaurant.cuisine}
          </span>
        </div>
        <p className="text-stone-500 text-sm">{restaurant.address}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-primary-700 text-sm font-medium">
            View details
          </span>
          <span className="text-accent-500 font-medium">Book now</span>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;