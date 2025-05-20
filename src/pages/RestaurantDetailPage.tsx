import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { MapPin, Phone, Clock, Star, Users, Calendar } from 'lucide-react';
import { useRestaurantStore } from '../lib/store';

const timeSlots = [
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'
];

const RestaurantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentRestaurant, getRestaurant, isLoading, error } = useRestaurantStore();
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedPartySize, setSelectedPartySize] = useState<number>(2);
  
  useEffect(() => {
    if (id) {
      getRestaurant(parseInt(id));
    }
  }, [id, getRestaurant]);

  if (isLoading) {
    return (
      <div className="pt-20 flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-32 bg-stone-200 rounded mb-4"></div>
          <div className="h-4 w-48 bg-stone-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !currentRestaurant) {
    return (
      <div className="pt-20 container mx-auto px-4 py-10 text-center">
        <h2 className="text-2xl font-semibold mb-4">Restaurant Not Found</h2>
        <p className="text-stone-600 mb-6">
          We couldn't find the restaurant you're looking for.
        </p>
        <Link 
          to="/restaurants" 
          className="inline-block bg-primary-700 text-white px-6 py-2 rounded hover:bg-primary-800 transition-colors"
        >
          Browse Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-16">
      {/* Header Image */}
      <div 
        className="h-[40vh] md:h-[50vh] w-full bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${currentRestaurant.image_url})`,
        }}
      >
        <div className="h-full w-full bg-black bg-opacity-40 flex items-end">
          <div className="container mx-auto px-4 pb-8">
            <div className="inline-block bg-accent-500 text-white px-3 py-1 rounded text-sm mb-3">
              {currentRestaurant.cuisine}
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2">
              {currentRestaurant.name}
            </h1>
            <div className="flex flex-wrap gap-4 text-white">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{currentRestaurant.address}</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-1" />
                <span>{currentRestaurant.phone}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{currentRestaurant.opening_hour}:00 - {currentRestaurant.closing_hour}:00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Restaurant info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-card p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4 font-serif">About</h2>
              <p className="text-stone-700 mb-6 leading-relaxed">
                {currentRestaurant.description}
              </p>
              
              <h3 className="text-xl font-semibold mb-3 font-serif">Cuisine</h3>
              <div className="flex gap-2 mb-6">
                <span className="bg-stone-100 text-stone-700 px-3 py-1 rounded-full text-sm">
                  {currentRestaurant.cuisine}
                </span>
              </div>
              
              <h3 className="text-xl font-semibold mb-3 font-serif">Hours</h3>
              <div className="grid grid-cols-2 gap-4">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                  <div key={day} className="flex justify-between">
                    <span className="text-stone-600">{day}</span>
                    <span className="text-stone-800 font-medium">
                      {currentRestaurant.opening_hour}:00 - {currentRestaurant.closing_hour}:00
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Reviews section (Placeholder for now) */}
            <div className="bg-white rounded-lg shadow-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold font-serif">Reviews</h2>
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-accent-500 fill-accent-500 mr-1" />
                  <span className="font-medium text-lg">4.8</span>
                  <span className="text-stone-500 ml-1">(124)</span>
                </div>
              </div>
              
              {/* Placeholder reviews */}
              <div className="space-y-6">
                {[1, 2, 3].map((index) => (
                  <div key={index} className="border-b border-stone-200 pb-6 last:border-0">
                    <div className="flex justify-between mb-2">
                      <div className="font-medium">John D.</div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-accent-500 fill-accent-500" />
                        <Star className="w-4 h-4 text-accent-500 fill-accent-500" />
                        <Star className="w-4 h-4 text-accent-500 fill-accent-500" />
                        <Star className="w-4 h-4 text-accent-500 fill-accent-500" />
                        <Star className="w-4 h-4 text-accent-500 fill-accent-500" />
                      </div>
                    </div>
                    <p className="text-stone-600 text-sm mb-1">Visited on June 12, 2023</p>
                    <p className="text-stone-800">
                      {index === 1 ? 'Amazing experience! The food was delicious and the service was top-notch.' : 
                       index === 2 ? 'Great ambiance and wonderful food. Will definitely be coming back.' :
                       'One of the best dining experiences I\'ve had in a while. Highly recommend the chef\'s special.'}
                    </p>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 border border-primary-700 text-primary-700 hover:bg-primary-50 font-medium py-2 rounded transition-colors">
                View all 124 reviews
              </button>
            </div>
          </div>
          
          {/* Right column - Reservation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-card p-6 sticky top-20">
              <h2 className="text-xl font-semibold mb-4 font-serif">Make a Reservation</h2>
              
              {/* Party Size */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Party Size
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Users className="w-5 h-5 text-stone-400" />
                  </div>
                  <select
                    value={selectedPartySize}
                    onChange={(e) => setSelectedPartySize(parseInt(e.target.value))}
                    className="bg-stone-50 border border-stone-300 text-stone-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((size) => (
                      <option key={size} value={size}>
                        {size} {size === 1 ? 'person' : 'people'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Date */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Calendar className="w-5 h-5 text-stone-400" />
                  </div>
                  <input
                    type="date"
                    value={format(selectedDate, 'yyyy-MM-dd')}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    className="bg-stone-50 border border-stone-300 text-stone-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5"
                  />
                </div>
              </div>
              
              {/* Time Slots */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Time
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      className="bg-stone-50 hover:bg-stone-100 text-stone-800 py-2 rounded border border-stone-300 transition-colors text-sm"
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
              
              <Link
                to={`/book/${currentRestaurant.id}?date=${format(selectedDate, 'yyyy-MM-dd')}&party=${selectedPartySize}`}
                className="w-full bg-primary-700 hover:bg-primary-800 text-white font-medium py-3 rounded-lg transition-colors text-center block"
              >
                Find a Table
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetailPage;