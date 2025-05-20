/*
  # Initial schema setup for restaurant reservation system

  1. New Tables
    - `restaurants`
      - `id` (integer, primary key)
      - `created_at` (timestamptz)
      - `name` (text)
      - `description` (text)
      - `cuisine` (text)
      - `address` (text)
      - `phone` (text)
      - `image_url` (text)
      - `opening_hour` (integer)
      - `closing_hour` (integer)
      - `owner_id` (uuid, references auth.users)

    - `reservations`
      - `id` (integer, primary key)
      - `created_at` (timestamptz)
      - `restaurant_id` (integer, references restaurants)
      - `user_id` (uuid, references auth.users)
      - `date` (date)
      - `time` (text)
      - `party_size` (integer)
      - `status` (enum: 'pending', 'confirmed', 'cancelled')
      - `special_requests` (text, nullable)

    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `full_name` (text)
      - `phone` (text)
      - `email` (text)
      - `role` (enum: 'customer', 'owner', 'admin')

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read and manage their own data
    - Add policies for restaurant owners to manage their restaurants and reservations
*/

-- Create restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  cuisine TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  image_url TEXT NOT NULL,
  opening_hour INTEGER NOT NULL,
  closing_hour INTEGER NOT NULL,
  owner_id UUID REFERENCES auth.users(id)
);

-- Create reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  restaurant_id INTEGER NOT NULL REFERENCES restaurants(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  date DATE NOT NULL,
  time TEXT NOT NULL,
  party_size INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled')) DEFAULT 'pending',
  special_requests TEXT
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('customer', 'owner', 'admin')) DEFAULT 'customer'
);

-- Enable Row Level Security
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for restaurants table
CREATE POLICY "Public restaurants are viewable by everyone"
  ON restaurants
  FOR SELECT
  USING (true);

CREATE POLICY "Restaurants can be created by owners and admins"
  ON restaurants
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IN (
    SELECT id FROM user_profiles WHERE role IN ('owner', 'admin')
  ));

CREATE POLICY "Restaurants can be updated by their owners or admins"
  ON restaurants
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = owner_id OR
    auth.uid() IN (SELECT id FROM user_profiles WHERE role = 'admin')
  );

-- Policies for reservations table
CREATE POLICY "Users can view their own reservations"
  ON reservations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Restaurant owners can view reservations for their restaurants"
  ON reservations
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT owner_id FROM restaurants WHERE id = restaurant_id
    )
  );

CREATE POLICY "Users can create their own reservations"
  ON reservations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reservations"
  ON reservations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for user_profiles table
CREATE POLICY "Users can view their own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can create their own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Insert sample restaurants
INSERT INTO restaurants (name, description, cuisine, address, phone, image_url, opening_hour, closing_hour)
VALUES
  (
    'Bella Cucina',
    'An authentic Italian restaurant offering a warm atmosphere and traditional recipes passed down through generations. Known for handmade pasta and wood-fired pizzas using imported ingredients.',
    'Italian',
    '123 Main St, Cityville',
    '(555) 123-4567',
    'https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    11,
    22
  ),
  (
    'Sakura Sushi',
    'A premier Japanese dining experience featuring the freshest seafood and traditional preparation methods. Our master chefs create artistic presentations that delight both the eye and palate.',
    'Japanese',
    '456 Oak Ave, Townsville',
    '(555) 234-5678',
    'https://images.pexels.com/photos/2323398/pexels-photo-2323398.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    12,
    23
  ),
  (
    'Le Bistro',
    'A charming French bistro offering classic cuisine in an intimate setting. Our menu changes seasonally to showcase the finest ingredients, accompanied by an extensive wine selection.',
    'French',
    '789 Elm Blvd, Villageton',
    '(555) 345-6789',
    'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    17,
    23
  ),
  (
    'El Mariachi',
    'Vibrant Mexican restaurant serving authentic regional specialties. From street-style tacos to complex mole dishes, our recipes honor traditional cooking techniques with a modern twist.',
    'Mexican',
    '101 Pine Rd, Hamletville',
    '(555) 456-7890',
    'https://images.pexels.com/photos/2092897/pexels-photo-2092897.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    11,
    22
  ),
  (
    'Spice Route',
    'An elegant Indian restaurant offering a culinary journey through regional specialties. Our dishes feature carefully balanced spices and traditional cooking methods for authentic flavors.',
    'Indian',
    '202 Cedar St, Boroughton',
    '(555) 567-8901',
    'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    12,
    22
  ),
  (
    'Golden Dragon',
    'Upscale Chinese restaurant specializing in both traditional and contemporary cuisine. From dim sum to perfectly prepared Peking duck, we offer an authentic taste of China.',
    'Chinese',
    '303 Maple Ave, Districtville',
    '(555) 678-9012',
    'https://images.pexels.com/photos/955137/pexels-photo-955137.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    11,
    23
  );