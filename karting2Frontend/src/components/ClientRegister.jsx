import React, { useState } from 'react';
import {
  Container, Typography, TextField, Button, Paper,
  Grid, Box, Divider, MenuItem, Alert
} from '@mui/material';
import clientService from '../services/services.management';

const ClientRegister = () => {
  const [clientRUT, setClientRut] = useState('');
  const [clientName, setClientName] = useState('');
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
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [birthdayError, setBirthdayError] = useState('');

  // Función para limpiar todos los errores
  const clearErrors = () => {
    setErrorMessage('');
    setRutError('');
    setNameError('');
    setEmailError('');
    setBirthdayError('');
  };

  // Función para manejar errores específicos del backend
  const handleValidationError = (errorMsg) => {
    clearErrors();
    
    if (errorMsg.includes('RUT')) {
      setRutError(errorMsg);
    } else if (errorMsg.includes('nombre')) {
      setNameError(errorMsg);
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
    
    const newClient = {
      clientRUT,
      clientName,
      clientEmail,
      clientBirthday,
      visitsPerMonth
    };
  
    try {
      const response = await clientService.saveClient(newClient);
      
      // Limpiar los campos del formulario después de enviar
      setClientRut('');
      setClientName('');
      setClientEmail('');
      setDay('');
      setMonth('');
      setYear('');
      setVisitsPerMonth(0);
      
      setSuccessMessage('Cliente creado con éxito!');
      console.log('Cliente creado:', response.data);

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

        {/* Mensajes de estado con mejor visibilidad */}
        {successMessage && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 3,
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
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="RUT"
                  placeholder="Ej: 12345678-9"
                  value={clientRUT}
                  onChange={(e) => {
                    const value = e.target.value.slice(0, 10);
                    setClientRut(value);
                  }}
                  required
                  error={!!rutError}
                  helperText={rutError || "Ingrese el RUT sin puntos y con guión"}
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
              
              {/* Nombre completo */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth 
                  label="Nombre y Apellido"
                  placeholder="Ej: Juan Pérez"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                  error={!!nameError}
                  helperText={nameError || "Ingrese nombre y apellido"}
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
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  label="Correo Electrónico"
                  type="email"
                  placeholder="ejemplo@correo.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  required
                  error={!!emailError}
                  helperText={emailError || "Será usado para enviar su comprobante de compra"}
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
            
            <Grid container spacing={3} justifyContent="center">
              {/* Día */}
              <Grid item xs={12} sm={4}>
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
              <Grid item xs={12} sm={4}>
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
              <Grid item xs={12} sm={4}>
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
