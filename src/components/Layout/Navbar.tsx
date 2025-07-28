import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <AppBar position="static" color="default">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          Sistema Contable
        </Typography>
        <Button 
          color="inherit" 
          component={Link} 
          to="/"
          sx={{ fontWeight: isActive('/') ? 'bold' : 'normal' }}
        >
          Inicio
        </Button>
        <Button 
          color="inherit" 
          component={Link} 
          to="/budgets"
          sx={{ fontWeight: isActive('/budgets') ? 'bold' : 'normal' }}
        >
          Presupuestos
        </Button>
        <Button 
          color="inherit" 
          component={Link} 
          to="/transactions"
          sx={{ fontWeight: isActive('/transactions') ? 'bold' : 'normal' }}
        >
          Operaciones
        </Button>
        <Button 
          color="inherit" 
          component={Link} 
          to="/reports"
          sx={{ fontWeight: isActive('/reports') ? 'bold' : 'normal' }}
        >
          Reportes
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
