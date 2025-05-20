import { create } from 'zustand';
import { supabase } from './supabase';
import { Database } from './database.types';

type Restaurant = Database['public']['Tables']['restaurants']['Row'];
type Reservation = Database['public']['Tables']['reservations']['Row'];
type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

interface UserState {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  session: any | null;
  setUser: (user: UserProfile | null) => void;
  setSession: (session: any | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  signOut: () => Promise<void>;
  getUserProfile: () => Promise<void>;
}

interface RestaurantState {
  restaurants: Restaurant[];
  filteredRestaurants: Restaurant[];
  currentRestaurant: Restaurant | null;
  isLoading: boolean;
  error: string | null;
  fetchRestaurants: () => Promise<void>;
  getRestaurant: (id: number) => Promise<void>;
  searchRestaurants: (query: string, cuisine?: string) => void;
}

interface ReservationState {
  userReservations: Reservation[];
  isLoading: boolean;
  error: string | null;
  createReservation: (reservation: Omit<Reservation, 'id' | 'created_at' | 'status'>) => Promise<void>;
  fetchUserReservations: (userId: string) => Promise<void>;
  cancelReservation: (id: number) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  session: null,
  
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  
  signIn: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      set({ session: data.session });
      await get().getUserProfile();
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
  
  signUp: async (email, password, userData) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (authError) throw authError;
      
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: authData.user.id,
            full_name: userData.full_name,
            phone: userData.phone,
            email: userData.email,
            role: userData.role || 'customer',
          });
        
        if (profileError) throw profileError;
        
        set({ session: authData.session });
        await get().getUserProfile();
      }
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
  
  signOut: async () => {
    try {
      set({ isLoading: true, error: null });
      await supabase.auth.signOut();
      set({ user: null, session: null });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
  
  getUserProfile: async () => {
    const { session } = get();
    if (!session?.user?.id) return;
    
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (error) throw error;
      
      set({ user: data });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  }
}));

export const useRestaurantStore = create<RestaurantState>((set) => ({
  restaurants: [],
  filteredRestaurants: [],
  currentRestaurant: null,
  isLoading: false,
  error: null,
  
  fetchRestaurants: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      set({ restaurants: data, filteredRestaurants: data });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
  
  getRestaurant: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      set({ currentRestaurant: data });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
  
  searchRestaurants: (query, cuisine) => {
    set((state) => {
      const filtered = state.restaurants.filter((restaurant) => {
        const matchesQuery = query
          ? restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
            restaurant.description.toLowerCase().includes(query.toLowerCase())
          : true;
        
        const matchesCuisine = cuisine
          ? restaurant.cuisine === cuisine
          : true;
        
        return matchesQuery && matchesCuisine;
      });
      
      return { filteredRestaurants: filtered };
    });
  }
}));

export const useReservationStore = create<ReservationState>((set) => ({
  userReservations: [],
  isLoading: false,
  error: null,
  
  createReservation: async (reservation) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('reservations')
        .insert({
          ...reservation,
          status: 'pending',
        });
      
      if (error) throw error;
      
      if (reservation.user_id) {
        await set.getState().fetchUserReservations(reservation.user_id);
      }
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
  
  fetchUserReservations: async (userId) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          restaurants:restaurant_id (
            id,
            name,
            address,
            image_url
          )
        `)
        .eq('user_id', userId)
        .order('date', { ascending: true });
      
      if (error) throw error;
      
      set({ userReservations: data });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
  
  cancelReservation: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('reservations')
        .update({ status: 'cancelled' })
        .eq('id', id);
      
      if (error) throw error;
      
      set((state) => ({
        userReservations: state.userReservations.map((reservation) =>
          reservation.id === id 
            ? { ...reservation, status: 'cancelled' } 
            : reservation
        ),
      }));
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));