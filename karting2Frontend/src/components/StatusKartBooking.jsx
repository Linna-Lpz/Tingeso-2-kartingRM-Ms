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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Paper,
  Snackbar
} from '@mui/material';
import {
  Search as SearchIcon,
  Payment as PaymentIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Schedule as ScheduleIcon,
  Group as GroupIcon,
  CalendarToday as CalendarIcon,
  SportsMotorsports as SportsMotorsportsIcon
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
  const [confirmDialog, setConfirmDialog] = useState({ open: false, booking: null, action: null });
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
      const response = await bookingService.getBookingByUserRut(rut);
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

  // Función para confirmar la reserva (Nielsen: Control y libertad del usuario)
  const handleConfirmBooking = async (bookingId) => {
    setIsLoading(true);
    try {
      await bookingService.confirmBooking(bookingId);
      await bookingService.sendVoucherByEmail(bookingId);
      
      setSuccessMessage('Reserva pagada con éxito. Voucher enviado al correo electrónico.');
      setSnackbarOpen(true);
      setRefresh((prev) => !prev);
    } catch (err) {
      console.error('Error al pagar la reserva:', err);
      // Usar el mensaje del backend
      setError(extractErrorMessage(err));
    } finally {
      setIsLoading(false);
      setConfirmDialog({ open: false, booking: null, action: null });
    }
  };

  // Función para mostrar diálogo de confirmación (Nielsen: Prevención de errores)
  const showConfirmDialog = (booking, action) => {
    setConfirmDialog({ open: true, booking, action });
  };

  // Función para cerrar diálogo
  const handleCloseDialog = () => {
    setConfirmDialog({ open: false, booking: null, action: null });
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
    // Eliminar todo excepto números y K
    let clean = value.replace(/[^0-9K]/g, '');
    
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

  const getDialogActionLabel = () => {
    if (isLoading) return 'Procesando...';
    if (confirmDialog.action === 'confirm') return 'Confirmar Pago';
    return 'Cancelar Reserva';
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
              fontSize: { xs: '1.8rem', md: '2.5rem' }
            }}
          >
            Estado de Reservas
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 2,
              opacity: 0.9,
              fontSize: { xs: '1rem', md: '1.2rem' }
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
            inputProps={{ maxLength: 10 }}
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

      {/* Mensajes de error mejorados */}
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

      {/* Grid de reservas mejorado */}
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
              <Grid item xs={12} sm={6} md={4} key={booking.id}>
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
                    '&:hover': {
                      boxShadow: '0 12px 24px rgba(91, 33, 182, 0.15)',
                      transform: 'translateY(-4px)',
                      borderColor: '#5B21B6'
                    },
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
                    {/* Información principal con iconos mejorados */}
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

                  {/* Acciones contextuales mejoradas */}
                  <CardActions sx={{ p: 3, pt: 0 }}>
                    {booking.bookingStatus !== 'confirmada' && booking.bookingStatus !== 'cancelada' && (
                      <Button
                        variant="contained"
                        color="success"
                        size="medium"
                        startIcon={<PaymentIcon />}
                        onClick={() => showConfirmDialog(booking, 'confirm')}
                        disabled={isLoading}
                        fullWidth
                        sx={{
                          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                          fontWeight: 'bold',
                          py: 1.5,
                          '&:hover': {
                            background: 'linear-gradient(135deg, #047857 0%, #065F46 100%)',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                          },
                          '&:disabled': {
                            background: '#E2E8F0',
                            color: '#94A3B8'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Pagar Reserva
                      </Button>
                    )}

                    {booking.bookingStatus === 'confirmada' && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="medium"
                        startIcon={<CancelIcon />}
                        onClick={() => showConfirmDialog(booking, 'cancel')}
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
                        Cancelar Reserva
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

      {/* Diálogo de confirmación mejorado */}
      <Dialog
        open={confirmDialog.open}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          color: '#5B21B6', 
          fontWeight: 'bold', 
          fontSize: '1.5rem',
          borderBottom: '2px solid #E2E8F0',
          pb: 2
        }}>
          {confirmDialog.action === 'confirm' ? 'Confirmar Pago' : 'Cancelar Reserva'}
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3 }}>
          {confirmDialog.booking && (
            <Box>
              <Alert 
                severity={confirmDialog.action === 'confirm' ? 'info' : 'warning'} 
                sx={{ 
                  mb: 3,
                  borderRadius: 2,
                  border: '2px solid',
                  borderColor: confirmDialog.action === 'confirm' ? '#3B82F6' : '#F59E0B',
                  background: confirmDialog.action === 'confirm' 
                    ? 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)'
                    : 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
                  '& .MuiAlert-icon': {
                    color: confirmDialog.action === 'confirm' ? '#3B82F6' : '#F59E0B'
                  },
                  '& .MuiAlert-message': {
                    color: confirmDialog.action === 'confirm' ? '#1E3A8A' : '#92400E',
                    fontWeight: 500
                  }
                }}
              >
                {confirmDialog.action === 'confirm' 
                  ? 'Al confirmar el pago, se procesará su reserva y se enviará a cada integrante, un comprobante por email. Este debe ser presentado al momento de la visita.'
                  : 'Esta acción no se puede deshacer. ¿Está seguro de que desea cancelar esta reserva?'
                }
              </Alert>
              
              <Typography variant="h6" gutterBottom sx={{ color: '#5B21B6', fontWeight: 'bold' }}>
                Detalles de la reserva:
              </Typography>
              
              <Box sx={{ 
                ml: 2, 
                p: 3, 
                bgcolor: '#F8FAFC', 
                borderRadius: 2, 
                border: '1px solid #E2E8F0' 
              }}>
                <Typography variant="body1" sx={{ mb: 1, color: '#1E293B' }}>• <strong>Fecha:</strong> {confirmDialog.booking.bookingDate}</Typography>
                <Typography variant="body1" sx={{ mb: 1, color: '#1E293B' }}>• <strong>Hora:</strong> {confirmDialog.booking.bookingTime}</Typography>
                <Typography variant="body1" sx={{ mb: 1, color: '#1E293B' }}>• <strong>Personas:</strong> {confirmDialog.booking.numOfPeople}</Typography>
                <Typography variant="body1" sx={{ color: '#1E293B' }}>• <strong>Total:</strong> <span style={{ color: '#0369A1', fontWeight: 'bold' }}>${confirmDialog.booking.totalAmount?.toLocaleString()}</span></Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button 
            onClick={handleCloseDialog} 
            disabled={isLoading}
            sx={{
              borderColor: '#64748B',
              color: '#64748B',
              fontWeight: 'bold',
              '&:hover': {
                borderColor: '#475569',
                color: '#475569',
                backgroundColor: '#F8FAFC'
              }
            }}
            variant="outlined"
          >
            Cerrar
          </Button>
          <Button
              onClick={() => {
                if (confirmDialog.action === 'confirm') {
                  handleConfirmBooking(confirmDialog.booking.id);
                } else {
                  handleCancelBooking(confirmDialog.booking.id);
                }
              }}
              variant="contained"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : null}
              sx={{
                background: confirmDialog.action === 'confirm' 
                  ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                  : 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                fontWeight: 'bold',
                minWidth: 160,
                '&:hover': {
                  background: confirmDialog.action === 'confirm'
                    ? 'linear-gradient(135deg, #047857 0%, #065F46 100%)'
                    : 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: confirmDialog.action === 'confirm'
                    ? '0 4px 12px rgba(16, 185, 129, 0.3)'
                    : '0 4px 12px rgba(239, 68, 68, 0.3)'
                },
                '&:disabled': {
                  background: '#E2E8F0',
                  color: '#94A3B8'
                },
                transition: 'all 0.3s ease'
              }}
          >
            {getDialogActionLabel()}
          </Button>
        </DialogActions>
      </Dialog>

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
        <Typography variant="h6" gutterBottom sx={{ color: '#5B21B6', fontWeight: 'bold' }}>
          ¿Necesitas ayuda?
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748B' }}>
          Contacta con nosotros: 📞 +56 9 72618375 | 📧 unique.bussiness@gmail.com
        </Typography>
      </Box>
    </Container>
  </Box>
  );
};

export default StatusKartBooking;
