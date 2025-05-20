import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Utensils } from 'lucide-react';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Brand/Image */}
      <div 
        className="w-full md:w-1/2 bg-primary-700 text-white flex flex-col justify-center items-center p-8 md:p-12"
        style={{
          backgroundImage: 'linear-gradient(rgba(125, 46, 70, 0.85), rgba(125, 46, 70, 0.95)), url(https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-md text-center">
          <Link 
            to="/" 
            className="inline-flex items-center mb-8 transition-transform hover:scale-105"
          >
            <Utensils size={32} />
            <span className="ml-2 text-3xl font-serif font-bold">Diné</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Fine dining at your fingertips
          </h1>
          <p className="text-lg opacity-90 mb-8">
            Discover and reserve tables at the finest restaurants in your area.
            No more waiting on hold or hoping for a callback.
          </p>
        </div>
      </div>
      
      {/* Right side - Auth forms */}
      <div className="w-full md:w-1/2 bg-white flex justify-center items-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;