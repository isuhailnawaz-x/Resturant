import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format, parseISO, isBefore } from 'date-fns';
import { Calendar, Clock, Users, MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import { useReservationStore, useUserStore } from '../lib/store';

type ReservationStatus = 'upcoming' | 'past' | 'cancelled';

const MyReservationsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { userReservations, fetchUserReservations, cancelReservation, isLoading } = useReservationStore();
  
  const [activeTab, setActiveTab] = useState<ReservationStatus>('upcoming');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Handle success message from location state
  useEffect(() => {
    const state = location.state as any;
    if (state?.success) {
      setShowSuccessMessage(true);
      setSuccessMessage(state.message || 'Operation successful!');
      
      // Clear the location state
      navigate(location.pathname, { replace: true });
      
      // Hide the message after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [location, navigate]);
  
  // Fetch user reservations
  useEffect(() => {
    if (user) {
      fetchUserReservations(user.id);
    }
  }, [user, fetchUserReservations]);
  
  // Filter reservations based on active tab
  const filteredReservations = userReservations.filter((reservation) => {
    const reservationDate = parseISO(`${reservation.date}T${reservation.time}`);
    const isPast = isBefore(reservationDate, new Date());
    
    if (activeTab === 'upcoming') {
      return !isPast && reservation.status !== 'cancelled';
    } else if (activeTab === 'past') {
      return isPast && reservation.status !== 'cancelled';
    } else {
      return reservation.status === 'cancelled';
    }
  });
  
  const handleCancelReservation = async (id: number) => {
    if (confirm('Are you sure you want to cancel this reservation?')) {
      await cancelReservation(id);
      setShowSuccessMessage(true);
      setSuccessMessage('Reservation cancelled successfully!');
      
      // Hide the message after 5 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    }
  };
  
  const getStatusBadge = (status: string, isPast: boolean) => {
    if (status === 'cancelled') {
      return (
        <span className="px-2 py-1 bg-error-100 text-error-700 rounded-full text-xs font-medium">
          Cancelled
        </span>
      );
    } else if (isPast) {
      return (
        <span className="px-2 py-1 bg-stone-100 text-stone-700 rounded-full text-xs font-medium">
          Completed
        </span>
      );
    } else if (status === 'confirmed') {
      return (
        <span className="px-2 py-1 bg-success-100 text-success-700 rounded-full text-xs font-medium">
          Confirmed
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 bg-warning-100 text-warning-700 rounded-full text-xs font-medium">
          Pending
        </span>
      );
    }
  };
  
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-serif font-bold text-stone-900 mb-6">
          My Reservations
        </h1>
        
        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mb-6 bg-success-50 text-success-700 p-4 rounded-lg flex items-center animate-fade-in">
            <CheckCircle className="w-5 h-5 mr-2" />
            {successMessage}
          </div>
        )}
        
        {/* Tabs */}
        <div className="flex border-b border-stone-200 mb-6">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 font-medium text-sm mr-4 border-b-2 transition-colors ${
              activeTab === 'upcoming'
                ? 'border-primary-700 text-primary-700'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-4 py-2 font-medium text-sm mr-4 border-b-2 transition-colors ${
              activeTab === 'past'
                ? 'border-primary-700 text-primary-700'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            Past
          </button>
          <button
            onClick={() => setActiveTab('cancelled')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'cancelled'
                ? 'border-primary-700 text-primary-700'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            Cancelled
          </button>
        </div>
        
        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-10">
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-stone-100 rounded-lg max-w-3xl mx-auto"></div>
              <div className="h-12 bg-stone-100 rounded-lg max-w-3xl mx-auto"></div>
              <div className="h-12 bg-stone-100 rounded-lg max-w-3xl mx-auto"></div>
            </div>
          </div>
        ) : (
          <>
            {/* Reservations List */}
            {filteredReservations.length > 0 ? (
              <div className="space-y-4">
                {filteredReservations.map((reservation) => {
                  const reservationDate = parseISO(`${reservation.date}T${reservation.time}`);
                  const isPast = isBefore(reservationDate, new Date());
                  const restaurant = (reservation as any).restaurants;
                  
                  return (
                    <div 
                      key={reservation.id}
                      className="bg-white rounded-lg shadow-card overflow-hidden flex flex-col md:flex-row"
                    >
                      {/* Restaurant Image (only on md and up) */}
                      {restaurant && (
                        <div className="hidden md:block w-48 h-auto">
                          <img
                            src={restaurant.image_url}
                            alt={restaurant.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      {/* Content */}
                      <div className="flex-1 p-5">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-xl font-semibold mb-1 font-serif">
                              {restaurant ? restaurant.name : 'Restaurant'}
                            </h3>
                            
                            {restaurant && (
                              <div className="flex items-center text-stone-600 text-sm mb-3">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span>{restaurant.address}</span>
                              </div>
                            )}
                          </div>
                          
                          {getStatusBadge(reservation.status, isPast)}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 text-primary-700 mr-2" />
                            <span>{format(parseISO(reservation.date), 'MMM d, yyyy')}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 text-primary-700 mr-2" />
                            <span>{reservation.time}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 text-primary-700 mr-2" />
                            <span>{reservation.party_size} {reservation.party_size === 1 ? 'person' : 'people'}</span>
                          </div>
                        </div>
                        
                        {reservation.special_requests && (
                          <div className="bg-stone-50 p-3 rounded text-sm text-stone-700 mb-4">
                            <p className="font-medium mb-1">Special Requests:</p>
                            <p>{reservation.special_requests}</p>
                          </div>
                        )}
                        
                        {/* Actions */}
                        {activeTab === 'upcoming' && (
                          <div className="flex justify-end space-x-3">
                            <button
                              onClick={() => handleCancelReservation(reservation.id)}
                              className="px-4 py-2 text-error-700 hover:text-error-800 font-medium text-sm transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 bg-stone-50 rounded-lg">
                <div className="flex flex-col items-center">
                  <Calendar className="w-12 h-12 text-stone-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No {activeTab} reservations</h3>
                  <p className="text-stone-600 mb-6 max-w-md mx-auto">
                    {activeTab === 'upcoming' 
                      ? "You don't have any upcoming reservations. Browse restaurants to make a reservation."
                      : activeTab === 'past'
                        ? "You don't have any past reservations."
                        : "You don't have any cancelled reservations."}
                  </p>
                  {activeTab === 'upcoming' && (
                    <button
                      onClick={() => navigate('/restaurants')}
                      className="bg-primary-700 hover:bg-primary-800 text-white font-medium px-6 py-2 rounded transition-colors"
                    >
                      Browse Restaurants
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyReservationsPage;