import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useUserStore } from '../../lib/store';

const ProtectedRoute: React.FC = () => {
  const { user, session } = useUserStore();
  const location = useLocation();

  // If there's no user or session, redirect to login
  if (!user && !session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Otherwise, render the protected content
  return <Outlet />;
};

export default ProtectedRoute;