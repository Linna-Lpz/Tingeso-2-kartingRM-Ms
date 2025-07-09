import React, { useState } from 'react';
import {
  Container, Typography, TextField, Button, Paper,
  Grid, Box, Divider, MenuItem, Alert
} from '@mui/material';
import clientService from '../services/services.management';

const ClientRegister = () => {
  const [clientRUT, setClientRUT] = useState('');
  const [clientFirstName, setClientFirstName] = useState('');
  const [clientLastName, setClientLastName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [visitsPerMonth, setVisitsPerMonth] = useState(0);
  
  // Estados para manejo de mensajes
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Estados para errores específicos de cada campo
  const [rutError, setRutError] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [birthdayError, setBirthdayError] = useState('');

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

  // Función para validar RUT en tiempo real
  const validateRUTRealTime = (rut) => {
    if (!rut) return '';
    
    // Eliminar espacios y convertir a mayúsculas
    let cleanRut = rut.replace(/\s/g, '').replace(/\./g, '').toUpperCase();
    
    // Si está escribiendo y no tiene suficientes caracteres, no mostrar error
    if (cleanRut.length < 9) { // Incluyendo el guión
      return '';
    }
    
    // Si no tiene guión, agregarlo automáticamente para la validación
    if (!cleanRut.includes('-') && cleanRut.length >= 8) {
      cleanRut = cleanRut.slice(0, -1) + '-' + cleanRut.slice(-1);
    }
    
    // Verificar formato básico - acepta tanto 7 como 8 dígitos antes del guión
    const rutRegex = /^\d{7,8}-[\dK]$/;
    if (!rutRegex.test(cleanRut)) {
      return 'Formato: 12345678-9';
    }
    
    // Validar dígito verificador solo si el formato es correcto
    const rutParts = cleanRut.split('-');
    const rutNumber = rutParts[0];
    const dv = rutParts[1];
    
    let sum = 0;
    let multiplier = 2;
    
    for (let i = rutNumber.length - 1; i >= 0; i--) {
      sum += parseInt(rutNumber.charAt(i)) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }
    
    const remainder = sum % 11;
    let calculatedDV;
    if (remainder === 0) {
      calculatedDV = '0';
    } else if (remainder === 1) {
      calculatedDV = 'K';
    } else {
      calculatedDV = (11 - remainder).toString();
    }
    
    if (dv.toUpperCase() !== calculatedDV) {
      return 'RUT no es válido';
    }
    
    return '';
  };

  // Función para validar nombre en tiempo real
  const validateNameRealTime = (name) => {
    if (!name) return '';
    
    if (name.trim().length > 0 && name.trim().length < 2) {
      return 'Mínimo 2 caracteres';
    }
    
    // Verificar caracteres no válidos
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
    if (!nameRegex.test(name)) {
      return 'Solo se permiten letras';
    }
    
    return '';
  };

  // Función para validar email en tiempo real
  const validateEmailRealTime = (email) => {
    if (!email) return '';
    
    // Solo validar formato si tiene @ y algún contenido después
    if (email.includes('@')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return 'Formato: usuario@ejemplo.com';
      }
    }
    
    return '';
  };

  // Manejadores de cambio con validación en tiempo real
  const handleRutChange = (e) => {
    const formattedRut = formatRUT(e.target.value);
    setClientRUT(formattedRut);
  };

  const handleFirstNameChange = (e) => {
    // Solo permitir letras, espacios y caracteres especiales del español
    const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    setClientFirstName(value);
  };

  const handleLastNameChange = (e) => {
    // Solo permitir letras, espacios y caracteres especiales del español
    const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    setClientLastName(value);
  };

  const handleEmailChange = (e) => {
    setClientEmail(e.target.value);
  };

  // Obtener errores en tiempo real
  const realtimeRutError = validateRUTRealTime(clientRUT);
  const realtimeFirstNameError = validateNameRealTime(clientFirstName);
  const realtimeLastNameError = validateNameRealTime(clientLastName);
  const realtimeEmailError = validateEmailRealTime(clientEmail);

  // Usar el error del backend si existe, sino usar el error en tiempo real
  const displayRutError = rutError || realtimeRutError;
  const displayFirstNameError = firstNameError || realtimeFirstNameError;
  const displayLastNameError = lastNameError || realtimeLastNameError;
  const displayEmailError = emailError || realtimeEmailError;

  // Función para limpiar todos los errores
  const clearErrors = () => {
    setErrorMessage('');
    setRutError('');
    setFirstNameError('');
    setLastNameError('');
    setEmailError('');
    setBirthdayError('');
  };

  // Función para manejar errores específicos del backend
  const handleValidationError = (errorMsg) => {
    clearErrors();
    
    if (errorMsg.includes('RUT')) {
      setRutError(errorMsg);
    } else if (errorMsg.includes('nombre')) {
      setFirstNameError(errorMsg);
    } else if (errorMsg.includes('apellido')) {
      setLastNameError(errorMsg);
    } else if (errorMsg.includes('email')) {
      setEmailError(errorMsg);
    } else if (errorMsg.includes('fecha') || errorMsg.includes('edad')) {
      setBirthdayError(errorMsg);
    } else {
      setErrorMessage(errorMsg);
    }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    clearErrors();
    
    // Construir la fecha en formato YYYY-MM-DD
    const clientBirthday = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    // Combinar nombre y apellido
    const clientName = `${clientFirstName.trim()} ${clientLastName.trim()}`.trim();
    
    const newClient = {
      clientRUT,
      clientName, // Se envía como nombre completo
      clientEmail,
      clientBirthday,
      visitsPerMonth
    };

    try {
      const response = await clientService.saveClient(newClient);
      
      // Limpiar los campos del formulario después de enviar
      setClientRUT('');
      setClientFirstName('');
      setClientLastName('');
      setClientEmail('');
      setDay('');
      setMonth('');
      setYear('');
      setVisitsPerMonth(0);
      
      setSuccessMessage('Cliente creado con éxito!');
      console.log('Cliente creado:', response.data);

      // Desplazar hacia arriba para mostrar el mensaje de éxito
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

    } catch (error) {
      console.error('Error al crear el cliente:', error);
      
      // Mostrar el mensaje de error del backend
      if (error.response?.data) {
        // Si el backend devuelve un mensaje de error específico
        const errorMsg = typeof error.response.data === 'string' 
          ? error.response.data 
          : error.response.data.message || 'Error en la validación';
        handleValidationError(errorMsg);
      } else if (error.message) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Error de conexión. Por favor, intente nuevamente.');
      }

      // También desplazar hacia arriba en caso de error
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } finally {
      setLoading(false);
    }
  };

  // Generar arrays para los selectores
  const days = Array.from({length: 31}, (_, i) => i + 1);
  const months = [
    { value: '1', label: 'Enero' },
    { value: '2', label: 'Febrero' },
    { value: '3', label: 'Marzo' },
    { value: '4', label: 'Abril' },
    { value: '5', label: 'Mayo' },
    { value: '6', label: 'Junio' },
    { value: '7', label: 'Julio' },
    { value: '8', label: 'Agosto' },
    { value: '9', label: 'Septiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' }
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({length: 100}, (_, i) => currentYear - i);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #2E1065 0%, #5B21B6 50%, #1E3A8A 100%)',
          color: 'white',
          py: 4,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              mb: 2,
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}
          >
            Registro de Cliente
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 2,
              opacity: 0.9,
              fontSize: { xs: '1rem', md: '1.2rem' }
            }}
          >
            Complete todos los campos para crear su cuenta en el sistema de karting
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: 6 }}>
        <Paper 
          elevation={8} 
          sx={{ 
            p: { xs: 3, sm: 4, md: 5 },
            borderRadius: 3,
            border: '2px solid',
            borderColor: '#A78BFA'
          }}
        >

        {/* Mensajes de estado */}
        {successMessage && (
          <Box sx={{ mb: 3 }}>
            <Alert 
              severity="success" 
              sx={{ 
                mb: 2,
                '& .MuiAlert-icon': {
                  fontSize: '1.5rem'
                },
                fontWeight: 'medium',
                borderRadius: 2,
                background: 'linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 100%)',
                border: '1px solid #16A34A'
              }}
            >
              ✅ {successMessage}
            </Alert>
            
            {/* Botón de reserva */}
            <Box sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => window.location.href = '/kartBookingForm'}
                sx={{
                  background: 'linear-gradient(135deg, #5B21B6 0%, #1E3A8A 100%)',
                  color: 'white',
                  fontWeight: 'bold',
                  py: 1.5,
                  px: 4,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  minWidth: 200,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #2E1065 0%, #1E40AF 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 16px rgba(91, 33, 182, 0.3)'
                  },
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(91, 33, 182, 0.2)'
                }}
              >
                Reservar Ahora
              </Button>
            </Box>
          </Box>
        )}

        {errorMessage && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              '& .MuiAlert-icon': {
                fontSize: '1.5rem'
              },
              fontWeight: 'medium',
              borderRadius: 2,
              background: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)',
              border: '1px solid #DC2626'
            }}
          >
            ❌ {errorMessage}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {/* Sección 1: Información Personal */}
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                color: '#5B21B6', 
                fontWeight: 'bold',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                '&::before': {
                  content: '"1"',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: '#5B21B6',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  mr: 2
                }
              }}
            >
              Información Personal
            </Typography>
            <Divider sx={{ mb: 3, backgroundColor: '#A78BFA', height: 2 }} />
            
            <Grid container spacing={3}>
              {/* RUT - Campo principal de identificación */}
              <Grid>
                <TextField
                  fullWidth
                  label="RUT"
                  placeholder="Ej: 12345678-9"
                  value={clientRUT}
                  onChange={handleRutChange}
                  required
                  error={!!displayRutError}
                  helperText={displayRutError}
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
              </Grid>
              
              {/* Nombre */}
              <Grid>
                <TextField
                  fullWidth 
                  label="Nombre(s)"
                  placeholder="Ej: Juan Carlos"
                  value={clientFirstName}
                  onChange={handleFirstNameChange}
                  required
                  error={!!displayFirstNameError}
                  helperText={displayFirstNameError}
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
              </Grid>

              {/* Apellido */}
              <Grid>
                <TextField
                  fullWidth 
                  label="Apellido(s)"
                  placeholder="Ej: Pérez González"
                  value={clientLastName}
                  onChange={handleLastNameChange}
                  required
                  error={!!displayLastNameError}
                  helperText={displayLastNameError}
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
              </Grid>
            </Grid>
          </Box>

          {/* Sección 2: Información de Contacto */}
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                color: '#5B21B6', 
                fontWeight: 'bold',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                '&::before': {
                  content: '"2"',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: '#5B21B6',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  mr: 2
                }
              }}
            >
              Información de Contacto
            </Typography>
            <Divider sx={{ mb: 3, backgroundColor: '#A78BFA', height: 2 }} />
            
            <Grid container spacing={3} justifyContent="center">
              <Grid>
                <TextField
                  fullWidth
                  label="Correo Electrónico"
                  type="email"
                  placeholder="ejemplo@correo.com"
                  value={clientEmail}
                  onChange={handleEmailChange}
                  required
                  error={!!displayEmailError}
                  helperText={displayEmailError || "Será usado para enviar su comprobante de compra"}
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
              </Grid>
            </Grid>
          </Box>

          {/* Sección 3: Fecha de Nacimiento */}
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                color: '#5B21B6', 
                fontWeight: 'bold',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                '&::before': {
                  content: '"3"',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: '#5B21B6',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  mr: 2
                }
              }}
            >
              Fecha de Nacimiento
            </Typography>
            <Divider sx={{ mb: 3, backgroundColor: '#A78BFA', height: 2 }} />
            
            {birthdayError && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)',
                  border: '1px solid #DC2626'
                }}
              >
                {birthdayError}
              </Alert>
            )}
            
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3, textAlign: 'center' }}>
              Seleccione su fecha de nacimiento
            </Typography>
            
            <Grid justifyContent="center" >
              {/* Día */}
              <Grid>
                <TextField
                  select
                  fullWidth
                  label="Día"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  required
                  error={!!birthdayError}
                  sx={{ 
                    '& .MuiFormLabel-root.Mui-focused': { color: '#5B21B6' },
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#5B21B6',
                        borderWidth: 2
                      }
                    }
                  }}
                >
                  <MenuItem value="">Día</MenuItem>
                  {days.map((d) => (
                    <MenuItem key={d} value={d}>
                      {String(d).padStart(2, '0')}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              {/* Mes */}
              <Grid>
                <TextField
                  select
                  fullWidth
                  label="Mes"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  required
                  error={!!birthdayError}
                  sx={{ 
                    '& .MuiFormLabel-root.Mui-focused': { color: '#5B21B6' },
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#5B21B6',
                        borderWidth: 2
                      }
                    }
                  }}
                >
                  <MenuItem value="">Mes</MenuItem>
                  {months.map((m) => (
                    <MenuItem key={m.value} value={m.value}>
                      {m.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              {/* Año */}
              <Grid>
                <TextField
                  select
                  fullWidth
                  label="Año"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                  error={!!birthdayError}
                  sx={{ 
                    '& .MuiFormLabel-root.Mui-focused': { color: '#5B21B6' },
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#5B21B6',
                        borderWidth: 2
                      }
                    }
                  }}
                >
                  <MenuItem value="">Año</MenuItem>
                  {years.map((y) => (
                    <MenuItem key={y} value={y}>
                      {y}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Box>

          {/* Sección de Envío */}
          <Box sx={{ mt: 6, pt: 4, borderTop: '2px solid', borderColor: '#A78BFA' }}>
            <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3 }}>
              * Campos obligatorios
            </Typography>
            
            <Box sx={{ textAlign: 'center' }}>
              <Button 
                type="submit" 
                variant="contained" 
                size="large"
                disabled={loading}
                sx={{ 
                  background: ' #5B21B6',
                  '&:disabled': {
                    background: 'linear-gradient(135deg, #E9D5FF 0%, #DDD6FE 100%)',
                    color: '#9CA3AF'
                  },
                  minWidth: 250,
                  py: 1.5,
                  px: 4,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  color: 'white',
                  transition: 'all 0.3s ease'
                }}
              >
                {loading ? (
                  <>
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
                        mr: 2,
                        '@keyframes spin': {
                          '0%': { transform: 'rotate(0deg)' },
                          '100%': { transform: 'rotate(360deg)' }
                        }
                      }}
                    />
                    Registrando Cliente...
                  </>
                ) : (
                  'Registrar Cliente'
                )}
              </Button>
            </Box>
            
            <Typography variant="caption" display="block" color="textSecondary" align="center" sx={{ mt: 3 }}>
              Al registrarse, acepta nuestros términos y condiciones de uso del karting
            </Typography>
          </Box>
        </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default ClientRegister;
