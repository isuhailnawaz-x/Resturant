import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, parse } from 'date-fns';
import { Calendar, Clock, Users, Info, ArrowLeft } from 'lucide-react';
import { useRestaurantStore, useReservationStore, useUserStore } from '../lib/store';

const timeSlots = [
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'
];

const reservationSchema = z.object({
  time: z.string().min(1, 'Please select a time'),
  specialRequests: z.string().optional(),
});

type ReservationFormValues = z.infer<typeof reservationSchema>;

const ReservationPage: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentRestaurant, getRestaurant } = useRestaurantStore();
  const { createReservation, isLoading: isReservationLoading } = useReservationStore();
  const { user } = useUserStore();
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedPartySize, setSelectedPartySize] = useState<number>(2);
  const [selectedTime, setSelectedTime] = useState<string>('');
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
  });
  
  // Parse URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    const dateParam = params.get('date');
    if (dateParam) {
      setSelectedDate(parse(dateParam, 'yyyy-MM-dd', new Date()));
    }
    
    const partyParam = params.get('party');
    if (partyParam) {
      setSelectedPartySize(parseInt(partyParam));
    }
    
    // Get restaurant data
    if (restaurantId) {
      getRestaurant(parseInt(restaurantId));
    }
  }, [location.search, restaurantId, getRestaurant]);
  
  // Set form value when time is selected
  useEffect(() => {
    if (selectedTime) {
      setValue('time', selectedTime);
    }
  }, [selectedTime, setValue]);
  
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };
  
  const onSubmit = async (data: ReservationFormValues) => {
    if (!user || !currentRestaurant || !restaurantId) return;
    
    try {
      await createReservation({
        restaurant_id: parseInt(restaurantId),
        user_id: user.id,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: data.time,
        party_size: selectedPartySize,
        special_requests: data.specialRequests || null,
      });
      
      navigate('/my-reservations', { 
        state: { success: true, message: 'Reservation created successfully!' } 
      });
    } catch (error) {
      console.error('Error creating reservation:', error);
    }
  };
  
  if (!currentRestaurant) {
    return (
      <div className="pt-24 container mx-auto px-4 py-10 text-center">
        <h2 className="text-2xl font-semibold mb-4">Restaurant Not Found</h2>
        <p className="text-stone-600 mb-6">
          We couldn't find the restaurant you're looking for.
        </p>
        <button 
          onClick={() => navigate(-1)}
          className="inline-block bg-primary-700 text-white px-6 py-2 rounded hover:bg-primary-800 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }
  
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-primary-700 hover:text-primary-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to restaurant
        </button>
        
        <div className="bg-white rounded-lg shadow-card overflow-hidden">
          {/* Reservation header */}
          <div 
            className="h-48 bg-cover bg-center relative"
            style={{ 
              backgroundImage: `url(${currentRestaurant.image_url})`,
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center">
              <div className="px-6 py-4">
                <h1 className="text-3xl font-serif font-bold text-white mb-2">
                  Reserve a table at {currentRestaurant.name}
                </h1>
                <p className="text-white opacity-90">
                  Complete your reservation details below
                </p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left column - Reservation details */}
              <div>
                <h2 className="text-xl font-semibold mb-6 font-serif">Reservation Details</h2>
                
                <div className="space-y-6">
                  {/* Party Size */}
                  <div>
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
                        className="bg-white border border-stone-300 text-stone-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5"
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
                  <div>
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
                        min={format(new Date(), 'yyyy-MM-dd')}
                        className="bg-white border border-stone-300 text-stone-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5"
                      />
                    </div>
                  </div>
                  
                  {/* Time */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Time
                    </label>
                    <div className="relative mb-2">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Clock className="w-5 h-5 text-stone-400" />
                      </div>
                      <input
                        type="text"
                        readOnly
                        value={selectedTime}
                        placeholder="Select a time below"
                        className="bg-white border border-stone-300 text-stone-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5"
                        {...register('time')}
                      />
                    </div>
                    {errors.time && (
                      <p className="text-error-600 text-sm mb-2">{errors.time.message}</p>
                    )}
                    
                    <div className="grid grid-cols-4 gap-2">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => handleTimeSelect(time)}
                          className={`text-sm py-2 rounded transition-colors ${
                            selectedTime === time
                              ? 'bg-primary-600 text-white'
                              : 'bg-stone-100 text-stone-800 hover:bg-stone-200'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Special Requests */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Special Requests (optional)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Any dietary restrictions or special occasions?"
                      className="bg-white border border-stone-300 text-stone-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                      {...register('specialRequests')}
                    ></textarea>
                  </div>
                </div>
              </div>
              
              {/* Right column - Summary and submit */}
              <div>
                <h2 className="text-xl font-semibold mb-6 font-serif">Reservation Summary</h2>
                
                <div className="bg-stone-50 rounded-lg p-6 mb-6">
                  <div className="flex items-start mb-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden mr-4">
                      <img 
                        src={currentRestaurant.image_url} 
                        alt={currentRestaurant.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{currentRestaurant.name}</h3>
                      <p className="text-stone-600 text-sm">{currentRestaurant.address}</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-stone-200 pt-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-stone-600">Date:</span>
                      <span className="font-medium">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-600">Time:</span>
                      <span className="font-medium">{selectedTime || 'Not selected'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-600">Party Size:</span>
                      <span className="font-medium">{selectedPartySize} {selectedPartySize === 1 ? 'person' : 'people'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6 flex">
                  <Info className="text-primary-700 w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-primary-800 text-sm">
                      You can modify or cancel your reservation up to 2 hours before the scheduled time. Please arrive on time to ensure your table is held.
                    </p>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isReservationLoading}
                  className="w-full bg-primary-700 hover:bg-primary-800 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-70"
                >
                  {isReservationLoading ? 'Processing...' : 'Confirm Reservation'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReservationPage;