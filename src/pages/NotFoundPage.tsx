import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50 px-4 py-16">
      <div className="text-center max-w-lg">
        <h1 className="text-6xl font-bold text-primary-700 mb-4 font-serif">404</h1>
        <h2 className="text-2xl font-semibold text-stone-800 mb-6">Page Not Found</h2>
        <p className="text-stone-600 mb-8">
          We couldn't find the page you're looking for. The page might have been removed, 
          renamed, or is temporarily unavailable.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center bg-primary-700 hover:bg-primary-800 text-white font-medium px-6 py-3 rounded-lg transition-colors"
        >
          <Home className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;