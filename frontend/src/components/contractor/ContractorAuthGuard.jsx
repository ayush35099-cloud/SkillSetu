import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { apiService } from '../../services/api';
import { Loader2 } from 'lucide-react';

export default function ContractorAuthGuard({ children }) {
  const [checking, setChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = apiService.getToken();
    const user = apiService.getStoredUser();

    if (!token || !user) {
      setIsAuthenticated(false);
      setChecking(false);
      return;
    }

    // Role check: must be contractor or admin
    if (user.role === 'contractor' || user.role === 'admin') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setChecking(false);
  }, []);

  if (checking) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-teal dark:text-ivory">
        <Loader2 className="w-8 h-8 animate-spin text-terracotta mb-3" />
        <p className="text-sm font-semibold">Validating contractor session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/contractor/login" state={{ from: location }} replace />;
  }

  return children;
}
