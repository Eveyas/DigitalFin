import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, LinearProgress } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const success = await auth.login(username, password);
      if (success) {
        navigate('/');
      } else {
        setError('Credenciales incorrectas');
      }
    } catch (err) {
      setError('Error en la autenticación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f7fa',
      backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      <Paper elevation={3} sx={{
        width: '100%',
        maxWidth: '450px',
        padding: 4,
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
      }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" component="h1" sx={{ 
            fontWeight: 700,
            color: '#2c3e50',
            mb: 1
          }}>
            DigitalFin
          </Typography>
          <Typography variant="body1" sx={{ color: '#7f8c8d' }}>
            Sistema de Gestión Financiera
          </Typography>
        </Box>
        
        {loading && <LinearProgress sx={{ mb: 3 }} />}
        
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Usuario"
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            label="Contraseña"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ mb: 3 }}
          />
          
          {error && (
            <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
              {error}
            </Typography>
          )}
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{
              py: 1.5,
              borderRadius: '8px',
              fontWeight: '600',
              background: 'linear-gradient(135deg, #3498db, #2980b9)',
              '&:hover': {
                background: 'linear-gradient(135deg, #2980b9, #3498db)'
              }
            }}
          >
            Iniciar Sesión
          </Button>
        </form>
        
        <Box mt={3} textAlign="center">
          <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
            Usuarios de prueba:
          </Typography>
          <Typography variant="body2" sx={{ color: '#7f8c8d', mt: 1 }}>
            <strong>adminventas</strong> / adminventas (Ventas)<br />
            <strong>admincontabilidad</strong> / admincontabilidad (Contabilidad)<br />
            <strong>gerente</strong> / gerente (Gerente)<br />
            <strong>admin</strong> / admin (Administrador)
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;