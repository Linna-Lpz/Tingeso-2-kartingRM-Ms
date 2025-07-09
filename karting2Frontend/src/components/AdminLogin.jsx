import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Alert,
  Grid,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import {
  AdminPanelSettings as AdminIcon,
  Login as LoginIcon,
  Assessment as ReportsIcon,
  ViewKanban as RackIcon,
  Security as SecurityIcon
} from '@mui/icons-material';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const ADMIN_EMAIL = 'admin@admin.cl';

  // Verificar si ya está logueado al cargar el componente
  React.useEffect(() => {
    const savedEmail = localStorage.getItem('adminEmail');
    if (savedEmail === ADMIN_EMAIL) {
      setEmail(savedEmail);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simular una pequeña demora para el efecto de carga
    setTimeout(() => {
      if (email.toLowerCase().trim() === ADMIN_EMAIL) {
        setIsLoggedIn(true);
        setError('');
        // Guardar en localStorage para mantener la sesión
        localStorage.setItem('adminEmail', email.toLowerCase().trim());
      } else {
        setError('Correo electrónico no autorizado. Solo para administradores admin@admin.cl');
      }
      setLoading(false);
    }, 1000);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError(''); // Limpiar error al escribir
  };

  const handleNavigation = (route) => {
    navigate(route);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail('');
    setError('');
    // Eliminar de localStorage
    localStorage.removeItem('adminEmail');
  };

  if (isLoggedIn) {
    return (
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          <Paper 
            elevation={8} 
            sx={{ 
              p: { sm: 4 },
              borderRadius: 3,
              background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
              border: '2px solid #5B21B6',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #5B21B6 0%, #1E3A8A 100%)'
              }
            }}
          >
            {/* Header */}
            <Box sx={{ textAlign: 'center'}}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #5B21B6 0%, #1E3A8A 100%)',
                  color: 'white',
                  mb: 3,
                  boxShadow: '0 8px 25px rgba(91, 33, 182, 0.3)'
                }}
              >
                <AdminIcon sx={{ fontSize: 40 }} />
              </Box>
              
              <Typography 
                variant="h4" 
                component="h1" 
                gutterBottom 
                sx={{ 
                  fontWeight: 'bold',
                  color: '#5B21B6',
                  mb: 1
                }}
              >
                Panel de Administración
              </Typography>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#64748B',
                  mb: 2
                }}
              >
                Bienvenido, {email}
              </Typography>

              <Alert 
                severity="success" 
                sx={{ 
                  mb: 3,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
                  border: '1px solid #10B981'
                }}
              >
                ✅ Acceso autorizado como administrador
              </Alert>
            </Box>

            <Divider sx={{ my: 4, backgroundColor: '#E2E8F0' }} />

            {/* Opciones de administración */}
            <Typography 
              variant="h5" 
              sx={{ 
                textAlign: 'center',
                color: '#5B21B6', 
                fontWeight: 'bold',
                mb: 4
              }}
            >
              Seleccione una opción
            </Typography>

            <Box sx={{ mb: 6 }}>            
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid>
                  <Card 
                    sx={{ 
                      height: '100%',
                      background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
                      border: '2px solid #3B82F6',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)'
                      }
                    }}
                    onClick={() => handleNavigation('/reports')}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 4 }}>
                      <ReportsIcon sx={{ fontSize: 50, color: '#3B82F6', mb: 2 }} />
                      <Typography variant="h6" sx={{ color: '#1E3A8A', fontWeight: 'bold', mb: 2 }}>
                        Reporte de Ventas
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#1E40AF', mb: 3 }}>
                        Visualizar estadísticas de ventas del karting
                      </Typography>
                      <Button
                        variant="contained"
                        sx={{
                          background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                          fontWeight: 'bold',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)'
                          }
                        }}
                      >
                        Ver Reportes
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid>
                  <Card 
                    sx={{ 
                      height: '100%',
                      background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
                      border: '2px solid #10B981',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)'
                      }
                    }}
                    onClick={() => handleNavigation('/rackWeekly')}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 4 }}>
                      <RackIcon sx={{ fontSize: 50, color: '#10B981', mb: 2 }} />
                      <Typography variant="h6" sx={{ color: '#065F46', fontWeight: 'bold', mb: 2 }}>
                        Rack Semanal
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#047857', mb: 3 }}>
                        Visualizar la ocupación semanal de los karts
                      </Typography>
                      <Button
                        variant="contained"
                        sx={{
                          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                          fontWeight: 'bold',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                          }
                        }}
                      >
                        Ver Rack
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 4, backgroundColor: '#E2E8F0' }} />

            {/* Botones de navegación */}
            <Box sx={{ display: 'flex', flexDirection: {sm: 'row' }, gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                onClick={handleBackToHome}
                sx={{
                  minWidth: 150,
                  py: 1.5,
                  borderColor: '#5B21B6',
                  color: '#5B21B6',
                  fontWeight: 'bold',
                  borderWidth: 2,
                  '&:hover': {
                    borderColor: '#2E1065',
                    color: '#2E1065',
                    backgroundColor: '#F3E8FF',
                    borderWidth: 2
                  }
                }}
              >
                Volver al Inicio
              </Button>

              <Button
                variant="contained"
                onClick={handleLogout}
                sx={{
                  minWidth: 150,
                  py: 1.5,
                  background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                  fontWeight: 'bold',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)'
                  }
                }}
              >
                Cerrar Sesión
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="sm">
        <Paper 
          elevation={8} 
          sx={{ 
            p: { sm: 4 },
            borderRadius: 3,
            background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
            border: '2px solid #E2E8F0',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #5B21B6 0%, #1E3A8A 100%)'
            }
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #5B21B6 0%, #1E3A8A 100%)',
                color: 'white',
                mb: 3,
                boxShadow: '0 8px 25px rgba(91, 33, 182, 0.3)'
              }}
            >
              <SecurityIcon sx={{ fontSize: 40 }} />
            </Box>
            
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                color: '#5B21B6',
                mb: 1
              }}
            >
              Acceso de Administrador
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#64748B',
                mb: 3
              }}
            >
              Ingrese sus credenciales para acceder al panel de administración
            </Typography>
          </Box>

          {/* Formulario de login */}
          <form onSubmit={handleLogin}>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Correo Electrónico de Administrador"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="admin@admin.cl"
                required
                error={!!error}
                sx={{ 
                  '& .MuiFormLabel-root.Mui-focused': { color: '#5B21B6' },
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#5B21B6',
                      borderWidth: 2
                    }
                  }
                }}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || !email.trim()}
              startIcon={loading ? null : <LoginIcon />}
              sx={{
                py: 1.5,
                background: 'linear-gradient(135deg, #5B21B6 0%, #1E3A8A 100%)',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                mb: 3,
                '&:hover': {
                  background: 'linear-gradient(135deg, #2E1065 0%, #1E40AF 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(91, 33, 182, 0.3)'
                },
                '&:disabled': {
                  background: '#E2E8F0',
                  color: '#94A3B8'
                },
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box 
                    component="span" 
                    sx={{ 
                      display: 'inline-block',
                      width: 20,
                      height: 20,
                      border: '2px solid #ffffff40',
                      borderTop: '2px solid #ffffff',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' }
                      }
                    }}
                  />
                  Verificando acceso...
                </Box>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={handleBackToHome}
              sx={{
                py: 1.5,
                borderColor: '#5B21B6',
                color: '#5B21B6',
                fontWeight: 'bold',
                borderWidth: 2,
                '&:hover': {
                  borderColor: '#2E1065',
                  color: '#2E1065',
                  backgroundColor: '#F3E8FF',
                  borderWidth: 2
                }
              }}
            >
              Volver al Inicio
            </Button>
          </form>

          {/* Información de seguridad */}
          <Box sx={{ 
            mt: 4, 
            textAlign: 'center', 
            p: 3, 
            bgcolor: '#FEF3C7', 
            borderRadius: 2, 
            border: '1px solid #F59E0B' 
          }}>
            <Typography variant="body2" sx={{ color: '#92400E', fontWeight: 500 }}>
              🔒 <strong>Acceso Restringido:</strong> Solo personal autorizado puede acceder a esta sección
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminLogin;
