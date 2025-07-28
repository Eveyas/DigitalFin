import React from 'react';
import { Box, AppBar, Toolbar, Typography, Button, IconButton, Avatar } from '@mui/material';
import { Menu as MenuIcon, Logout as LogoutIcon, Dashboard as DashboardIcon, AccountBalanceWallet as BudgetsIcon, Receipt as TransactionsIcon,
  Assessment as ReportsIcon, People as UsersIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import DigitalLogo from '../../assets/DigitalLogo.png';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  
  const handleLogout = () => {
    auth.logout();
    navigate('/login');
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'contabilidad': return 'Contabilidad';
      case 'ventas': return 'Ventas';
      case 'gerente': return 'Gerente';
      case 'consulta': return 'Consulta';
      default: return role;
    }
  };

  const getMenuOptions = () => {
    const baseOptions = [
      { 
        path: '/', 
        label: 'Dashboard', 
        icon: <DashboardIcon sx={{ mr: 1 }} />,
        roles: ['admin', 'contabilidad', 'ventas', 'gerente', 'consulta'] 
      }
    ];

    const roleSpecificOptions = [
      { 
        path: '/budgets', 
        label: 'Presupuestos', 
        icon: <BudgetsIcon sx={{ mr: 1 }} />,
        roles: ['admin', 'contabilidad'] 
      },
      { 
        path: '/transactions', 
        label: 'Transacciones', 
        icon: <TransactionsIcon sx={{ mr: 1 }} />,
        roles: ['admin', 'contabilidad'] 
      },
      { 
        path: '/reports', 
        label: 'Reportes', 
        icon: <ReportsIcon sx={{ mr: 1 }} />,
        roles: ['admin', 'gerente'] 
      },
      { 
        path: '/users', 
        label: 'Usuarios', 
        icon: <UsersIcon sx={{ mr: 1 }} />,
        roles: ['admin'] 
      }
    ];

    return [...baseOptions, ...roleSpecificOptions].filter(option => 
      option.roles.includes(auth.user?.role || '')
    );
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Box 
        component="aside"
        sx={{ 
          width: '250px',
          bgcolor: '#2c3e50',
          color: 'white',
          flexShrink: 0,
          display: { xs: sidebarOpen ? 'block' : 'none', md: 'block' }
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <img 
            src={DigitalLogo} 
            alt="DigitalFin Logo" 
            style={{ width: '100%', maxWidth: '180px', height: 'auto' }} 
          />
        </Box>
        
        <Box sx={{ mt: 2 }}>
          {getMenuOptions().map((item) => (
            <Button
              key={item.path}
              fullWidth
              startIcon={item.icon}
              sx={{
                justifyContent: 'flex-start',
                px: 3,
                py: 1.5,
                color: 'white',
                textAlign: 'left',
                textTransform: 'none',
                fontSize: '0.9rem',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Contenido principal */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <AppBar 
          position="static" 
          color="default" 
          elevation={0}
          sx={{ 
            bgcolor: 'white', 
            borderBottom: '1px solid #e0e0e0',
            height: '64px',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            <Box sx={{ flexGrow: 1 }} />

            {auth.user && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: '#3498db', mr: 1 }}>
                  {auth.user.name.charAt(0)}
                </Avatar>
                <Box sx={{ textAlign: 'right', mr: 2 }}>
                  <Typography variant="subtitle2">{auth.user.name}</Typography>
                  <Typography variant="caption" sx={{ color: '#7f8c8d' }}>
                    {getRoleName(auth.user.role)}
                  </Typography>
                </Box>
                <IconButton onClick={handleLogout} color="inherit">
                  <LogoutIcon />
                </IconButton>
              </Box>
            )}
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
