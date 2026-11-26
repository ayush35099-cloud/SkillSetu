import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { apiService } from '../../services/api';

export default function AssessorAuthGuard({ children }) {
  const location = useLocation();
  const token = apiService.getToken();

  if (!token) {
    return <Navigate to="/assessor/login" state={{ from: location }} replace />;
  }

  return children;
}
