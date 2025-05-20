export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      restaurants: {
        Row: {
          id: number
          created_at: string
          name: string
          description: string
          cuisine: string
          address: string
          phone: string
          image_url: string
          opening_hour: number
          closing_hour: number
          owner_id: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          name: string
          description: string
          cuisine: string
          address: string
          phone: string
          image_url: string
          opening_hour: number
          closing_hour: number
          owner_id?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          name?: string
          description?: string
          cuisine?: string
          address?: string
          phone?: string
          image_url?: string
          opening_hour?: number
          closing_hour?: number
          owner_id?: string | null
        }
      }
      reservations: {
        Row: {
          id: number
          created_at: string
          restaurant_id: number
          user_id: string
          date: string
          time: string
          party_size: number
          status: 'pending' | 'confirmed' | 'cancelled'
          special_requests: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          restaurant_id: number
          user_id: string
          date: string
          time: string
          party_size: number
          status?: 'pending' | 'confirmed' | 'cancelled'
          special_requests?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          restaurant_id?: number
          user_id?: string
          date?: string
          time?: string
          party_size?: number
          status?: 'pending' | 'confirmed' | 'cancelled'
          special_requests?: string | null
        }
      }
      user_profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          full_name: string
          phone: string
          email: string
          role: 'customer' | 'owner' | 'admin'
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          full_name: string
          phone: string
          email: string
          role?: 'customer' | 'owner' | 'admin'
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          full_name?: string
          phone?: string
          email?: string
          role?: 'customer' | 'owner' | 'admin'
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}