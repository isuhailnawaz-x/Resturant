import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users } from 'lucide-react';

const SearchBar: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [partySize, setPartySize] = useState('2');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    if (query) params.set('search', query);
    if (location) params.set('location', location);
    if (date) params.set('date', date);
    if (partySize) params.set('party', partySize);
    
    navigate(`/restaurants?${params.toString()}`);
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-lg p-2 sm:p-4"
    >
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search query */}
        <div className="flex items-center flex-1 bg-stone-50 rounded-md px-3 py-2">
          <Search className="text-stone-400 w-5 h-5 mr-2" />
          <input
            type="text"
            placeholder="Restaurant or cuisine"
            className="bg-transparent w-full focus:outline-none text-stone-800"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        
        {/* Location */}
        <div className="flex items-center flex-1 bg-stone-50 rounded-md px-3 py-2">
          <MapPin className="text-stone-400 w-5 h-5 mr-2" />
          <input
            type="text"
            placeholder="Location"
            className="bg-transparent w-full focus:outline-none text-stone-800"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        
        {/* Date */}
        <div className="flex items-center flex-1 bg-stone-50 rounded-md px-3 py-2">
          <Calendar className="text-stone-400 w-5 h-5 mr-2" />
          <input
            type="date"
            className="bg-transparent w-full focus:outline-none text-stone-800"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        
        {/* Party size */}
        <div className="flex items-center bg-stone-50 rounded-md px-3 py-2 sm:w-24">
          <Users className="text-stone-400 w-5 h-5 mr-2" />
          <select
            className="bg-transparent w-full focus:outline-none text-stone-800 appearance-none"
            value={partySize}
            onChange={(e) => setPartySize(e.target.value)}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
        
        <button
          type="submit"
          className="bg-primary-700 hover:bg-primary-800 text-white font-medium px-4 py-2 rounded-md transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;