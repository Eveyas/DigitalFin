import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper, LinearProgress } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import DigitalLogo from '../../assets/DigitalLogo.png';
import LoginVideo from '../../assets/login.mp4';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, []);

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
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      overflow: 'hidden'
    }}>

      <Box
        component="video"
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        onLoadedData={() => setIsVideoLoaded(true)}
        onError={() => console.error("Error al cargar el video")}
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          filter: 'brightness(0.5)',
          display: isVideoLoaded ? 'block' : 'none'
        }}
      >
        <source src={LoginVideo} type="video/mp4" />
        Tu navegador no soporta videos HTML5.
      </Box>
      
      {!isVideoLoaded && (
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: '#2c3e50',
            zIndex: 0
          }}
        />
      )}
      
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          zIndex: 1
        }}
      />
      
      {/* Contenido del login */}
      <Paper elevation={3} sx={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        maxWidth: '450px',
        padding: 4,
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)'
      }}>
        <Box textAlign="center" mb={4}>
          <Box
            component="img"
            src={DigitalLogo}
            alt="DigitalFin Logo"
            sx={{
              height: '80px',
              mb: 2,
              objectFit: 'contain'
            }}
          />
          <Typography variant="body1" sx={{ 
            color: '#7f8c8d',
            fontSize: '1.1rem',
            fontWeight: 500
          }}>
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
        
        {/* <Box mt={3} textAlign="center">
          <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
            Usuarios de prueba:
          </Typography>
          <Typography variant="body2" sx={{ color: '#7f8c8d', mt: 1 }}>

            <strong>adminventas</strong> / adminventas (Ventas)<br />
            <strong>admincontabilidad</strong> / admincontabilidad (Contabilidad)<br />
            <strong>gerente</strong> / gerente (Gerente)<br />
            <strong>admin</strong> / admin (Administrador)

          </Typography>
        </Box> */}

      </Paper>
    </Box>
  );
};

export default Login;
