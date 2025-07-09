import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Alert,
  Box,
  Chip,
  CircularProgress,
  Paper,
  Snackbar
} from '@mui/material';
import {
  Search as SearchIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Schedule as ScheduleIcon,
  Group as GroupIcon,
  CalendarToday as CalendarIcon,
  SportsMotorsports as SportsMotorsportsIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import bookingService from '../services/services.management';

const StatusKartBooking = () => {
  const [rut, setRut] = useState('');
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [cancelBookingId, setCancelBookingId] = useState(null);
  const [refresh, setRefresh] = useState(false);
  
  // Estados para mejorar UX (Nielsen: Visibilidad del estado del sistema)
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Función para validar RUT (Nielsen: Prevención de errores)
  const validateRut = (rut) => {
    const rutRegex = /^\d{7,8}-[\dkK]$/; // Formato: 12345678-9 o 1234567-K
    return rutRegex.test(rut.trim());
  };

  // Función para obtener el color del estado (Nielsen: Reconocimiento antes que recuerdo)
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmada':
        return 'success';
      case 'pendiente':
        return 'warning';
      case 'cancelada':
        return 'error';
      default:
        return 'default';
    }
  };

  // Función para obtener el ícono del estado (Nielsen: Reconocimiento antes que recuerdo)
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmada':
        return <CheckCircleIcon />;
      case 'pendiente':
        return <ScheduleIcon />;
      case 'cancelada':
        return <CancelIcon />;
      default:
        return <InfoIcon />;
    }
  };

  // Función para extraer mensaje de error del backend
  const extractErrorMessage = (error) => {
    if (error.response?.data) {
      // Si el backend retorna un string directamente
      if (typeof error.response.data === 'string') {
        return error.response.data;
      }
      // Si el backend retorna un objeto con mensaje
      if (error.response.data.message) {
        return error.response.data.message;
      }
      // Si el backend retorna un objeto con error
      if (error.response.data.error) {
        return error.response.data.error;
      }
      // Si hay otros campos comunes de error
      if (error.response.data.details) {
        return error.response.data.details;
      }
    }
    
    // Si es un error de red
    if (error.message) {
      if (error.message.includes('Network Error') || error.message.includes('ERR_NETWORK')) {
        return 'Error de conexión. Verifique su conexión a internet e intente nuevamente.';
      }
      return error.message;
    }
    
    // Mensaje genérico como último recurso
    return 'Ha ocurrido un error inesperado. Por favor, intente nuevamente.';
  };

  // Función para cargar las reservas (Nielsen: Visibilidad del estado del sistema)
  const fetchBookings = async () => {
    if (!rut.trim()) {
      setError('Debes ingresar un RUT válido.');
      return;
    }

    if (!validateRut(rut)) {
      setError('El formato del RUT no es válido. Debe ser: 12345678-9');
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      // Convertir dígito verificador a mayúsculas antes de buscar
      const normalizedRut = rut.toUpperCase();
      const response = await bookingService.getBookingByUserRut(normalizedRut);
      setBookings(response.data);
      
      if (response.data.length === 0) {
        // Mensaje cuando no hay resultados (puede venir del backend o ser local)
        setError('No se encontraron reservas para este RUT.');
      }
    } catch (err) {
      console.error('Error al obtener las reservas:', err);
      // Usar el mensaje del backend
      setError(extractErrorMessage(err));
    } finally {
      setIsSearching(false);
    }
  };

  // useEffect para manejar la cancelación de reservas (Nielsen: Visibilidad del estado del sistema)
  useEffect(() => {
    const cancelBooking = async () => {
      if (!cancelBookingId) return;

      setIsLoading(true);
      try {
        await bookingService.cancelBooking(cancelBookingId);
        setSuccessMessage('Reserva cancelada con éxito.');
        setSnackbarOpen(true);
        setCancelBookingId(null);
        setRefresh((prev) => !prev);
      } catch (err) {
        console.error('Error al cancelar la reserva:', err);
        // Usar el mensaje del backend
        setError(extractErrorMessage(err));
        setCancelBookingId(null);
      } finally {
        setIsLoading(false);
      }
    };

    cancelBooking();
  }, [cancelBookingId]);

  // useEffect para recargar las reservas cuando cambie el estado `refresh`
  useEffect(() => {
    if (rut.trim() && validateRut(rut)) {
      fetchBookings();
    }
  }, [refresh]);

  // Función para establecer el bookingId a cancelar (Nielsen: Control y libertad del usuario)
  const handleCancelBooking = (bookingId) => {
    setCancelBookingId(bookingId);
  };

  // Función para enviar comprobante por correo
  const handleSendVoucher = async (bookingId) => {
    setIsLoading(true);
    try {
      await bookingService.sendVoucherByEmail(bookingId);
      setSuccessMessage('Comprobante enviado exitosamente al correo electrónico.');
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Error al enviar el comprobante:', err);
      setError(extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Función para manejar el Enter en el campo de búsqueda (Nielsen: Flexibilidad y eficiencia de uso)
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      fetchBookings();
    }
  };

  // Función para limpiar errores (Nielsen: Control y libertad del usuario)
  const clearError = () => {
    setError(null);
  };

  // Función para formatear RUT automáticamente
  const formatRUT = (value) => {
    let clean = value.replace(/[^0-9Kk]/g, '');
    
    // Limitar a máximo 9 caracteres (8 dígitos + 1 dígito verificador)
    if (clean.length > 9) {
      clean = clean.slice(0, 9);
    }
    
    // Agregar guión automáticamente cuando tenga al menos 8 caracteres
    if (clean.length >= 8) {
      clean = clean.slice(0, -1) + '-' + clean.slice(-1);
    }
    
    return clean;
  };

  // Función mejorada para manejar cambios en el RUT
  const handleRutChange = (e) => {
    const formattedRut = formatRUT(e.target.value);
    setRut(formattedRut);
    if (error) clearError(); // Limpiar error al escribir
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #2E1065 0%, #5B21B6 50%, #1E3A8A 100%)',
          color: 'white',
          py: 3,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="lg">
          <SportsMotorsportsIcon sx={{ fontSize: 60, mb: 2, color: 'white' }} />
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              mb: 2,
              fontSize: { xs: '1.8rem' }
            }}
          >
            Estado de Reservas
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 2,
              opacity: 0.9,
              fontSize: { xs: '1rem' }
            }}
          >
            Consulte, confirme o cancele sus reservas de karting
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Formulario de búsqueda mejorado */}
      <Paper 
        elevation={8} 
        sx={{ 
          p: 4, 
          mb: 4,
          background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
          border: '2px solid',
          borderColor: '#E2E8F0',
          borderRadius: 3,
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
        <Typography 
          variant="h5" 
          gutterBottom 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            color: '#5B21B6',
            fontWeight: 'bold',
            mb: 3
          }}
        >
          <SearchIcon sx={{ fontSize: 30, color: '#5B21B6' }} />
          Buscar Reservas
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mt: 3 }}>
          <TextField
            fullWidth
            label="RUT del cliente"
            value={rut}
            onChange={handleRutChange}
            onKeyUp={handleKeyPress}
            placeholder="Ej: 12345678-9"
            error={!!error}
            helperText={error || "Ingrese su RUT para buscar sus reservas"}
            disabled={isSearching}
            sx={{ 
              maxWidth: 350,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#5B21B6'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#5B21B6'
                }
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#5B21B6'
              }
            }}
          />
          
          <Button
            variant="contained"
            onClick={fetchBookings}
            disabled={isSearching || !rut.trim()}
            startIcon={isSearching ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
            sx={{ 
              minWidth: 140, 
              height: 56,
              background: 'linear-gradient(135deg, #5B21B6 0%, #1E3A8A 100%)',
              fontWeight: 'bold',
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
            {isSearching ? 'Buscando...' : 'Buscar'}
          </Button>
        </Box>
      </Paper>

      {/* Mensajes de error */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            borderRadius: 2,
            border: '2px solid #EF4444',
            background: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)',
            '& .MuiAlert-icon': {
              color: '#EF4444'
            },
            '& .MuiAlert-message': {
              color: '#991B1B',
              fontWeight: 500
            }
          }}
          onClose={clearError}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={clearError}
              sx={{ 
                color: '#991B1B',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: 'rgba(153, 27, 27, 0.1)'
                }
              }}
            >
              Cerrar
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Grid de reservas */}
      {bookings.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              color: '#5B21B6',
              fontWeight: 'bold',
              mb: 3
            }}
          >
            <InfoIcon sx={{ fontSize: 30, color: '#5B21B6' }} />
            Sus Reservas ({bookings.length})
          </Typography>
          
          <Grid container spacing={3}>
            {bookings.map((booking) => (
              <Grid key={booking.id}>
                <Card 
                  elevation={6}
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
                    border: '2px solid',
                    borderColor: '#E2E8F0',
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: 'linear-gradient(90deg, #5B21B6 0%, #1E3A8A 100%)'
                    }
                  }}
                >
                  <Box sx={{ position: 'absolute', top: 5, right: 16 }}>
                    <Chip
                      icon={getStatusIcon(booking.bookingStatus)}
                      label={booking.bookingStatus?.toUpperCase()}
                      color={getStatusColor(booking.bookingStatus)}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                  {/* Tarjeta con información resumen de la reserva */}
                  <CardContent sx={{ flexGrow: 1, pt: 6, px: 3 }}>
                    {/* Información principal */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CalendarIcon sx={{ color: '#5B21B6', fontSize: 20 }} />
                        <Typography variant="body1" sx={{ color: '#1E293B', fontWeight: 500 }}>
                          <strong>Fecha:</strong> {booking.bookingDate}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <ScheduleIcon sx={{ color: '#5B21B6', fontSize: 20 }} />
                        <Typography variant="body1" sx={{ color: '#1E293B', fontWeight: 500 }}>
                          <strong>Hora:</strong> {booking.bookingTime}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <GroupIcon sx={{ color: '#5B21B6', fontSize: 20 }} />
                        <Typography variant="body1" sx={{ color: '#1E293B', fontWeight: 500 }}>
                          <strong>Personas:</strong> {booking.numOfPeople}
                        </Typography>
                      </Box>
                      
                      <Typography variant="body1" sx={{ color: '#1E293B', fontWeight: 500, ml: 5 }}>
                        <strong>Vueltas/Tiempo:</strong> {booking.lapsOrMaxTimeAllowed}
                      </Typography>
                      
                      <Box 
                        sx={{ 
                          mt: 2, 
                          p: 2, 
                          bgcolor: '#F0F9FF', 
                          borderRadius: 2, 
                          border: '1px solid #BAE6FD',
                          textAlign: 'center'
                        }}
                      >
                        <Typography variant="h6" sx={{ color: '#0369A1', fontWeight: 'bold' }}>
                          Total: ${booking.totalAmount?.toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>

                  {/* Acciones contextuales */}
                  <CardActions sx={{ p: 3, pt: 0 }}>
                    {/* Botón para enviar comprobante de reserva */}
                    {booking.bookingStatus === 'confirmada' && (
                      <Button
                        variant="outlined"
                        color="primary"
                        size="medium"
                        startIcon={<EmailIcon />}
                        onClick={() => handleSendVoucher(booking.id)}
                        disabled={isLoading}
                        fullWidth
                        sx={{
                          borderColor: '#5B21B6',
                          color: '#5B21B6',
                          backgroundColor: '#F8FAFC',
                          fontWeight: 'bold',
                          py: 1.5,
                          mb: 1,
                          borderWidth: 2,
                          '&:hover': {
                            borderColor: '#2E1065',
                            color: '#2E1065',
                            backgroundColor: '#EDE9FE',
                            borderWidth: 2
                          },
                          '&:disabled': {
                            borderColor: '#E2E8F0',
                            color: '#94A3B8',
                            backgroundColor: '#F8FAFC'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Enviar Comprobante
                      </Button>
                    )}

                    {/* Botón para anular reserva */}
                    {booking.bookingStatus === 'confirmada' && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="medium"
                        startIcon={<CancelIcon />}
                        onClick={() => handleCancelBooking(booking.id)}
                        disabled={isLoading}
                        fullWidth
                        sx={{
                          borderColor: '#EF4444',
                          color: '#EF4444',
                          fontWeight: 'bold',
                          py: 1.5,
                          borderWidth: 2,
                          '&:hover': {
                            borderColor: '#DC2626',
                            color: '#DC2626',
                            backgroundColor: '#FEF2F2',
                            borderWidth: 2
                          },
                          '&:disabled': {
                            borderColor: '#E2E8F0',
                            color: '#94A3B8'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Anular Reserva
                      </Button>
                    )}

                    {booking.bookingStatus === 'cancelada' && (
                      <Box sx={{ width: '100%', textAlign: 'center', py: 1.5 }}>
                        <Typography variant="body1" sx={{ color: '#64748B', fontWeight: 500 }}>
                          Reserva cancelada
                        </Typography>
                      </Box>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Estado vacío mejorado */}
      {bookings.length === 0 && !error && !isSearching && (
        <Paper 
          elevation={4} 
          sx={{ 
            p: 6, 
            textAlign: 'center', 
            background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
            border: '2px solid #E2E8F0',
            borderRadius: 3
          }}
        >
          <InfoIcon sx={{ fontSize: 64, color: '#94A3B8', mb: 3 }} />
          <Typography variant="h5" sx={{ color: '#5B21B6', fontWeight: 'bold', mb: 2 }}>
            No hay reservas para mostrar
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748B', maxWidth: 400, mx: 'auto' }}>
            Ingrese su RUT para buscar sus reservas de karting y gestionar sus experiencias
          </Typography>
        </Paper>
      )}

      {/* Snackbar para mensajes de éxito mejorado */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success" 
          sx={{ 
            width: '100%',
            borderRadius: 2,
            fontWeight: 'bold'
          }}
          variant="filled"
        >
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Help Section */}
      <Box sx={{ mt: 6, textAlign: 'center', p: 3, bgcolor: 'white', borderRadius: 2, border: '1px solid #E2E8F0' }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          ¿Preguntas? Contacta con nosotros: unique.bussiness@gmail.com
        </Typography>
      </Box>
    </Container>
  </Box>
  );
};

export default StatusKartBooking;
