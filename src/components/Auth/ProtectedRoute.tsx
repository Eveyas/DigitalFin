import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../context/AuthContext';
import { Box, Typography, Button } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactElement;
  requiredRole?: UserRole;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && !auth.hasPermission(requiredRole)) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '60vh',
        flexDirection: 'column',
        textAlign: 'center'
      }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Acceso denegado
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          No tienes permiso para acceder a esta sección.
        </Typography>
        <Button variant="contained" onClick={() => window.history.back()}>
          Volver
        </Button>
      </Box>
    );
  }

  return children;
};

export default ProtectedRoute;