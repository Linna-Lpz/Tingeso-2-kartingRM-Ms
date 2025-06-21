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
      if (error.response && error.response.data) {
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
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Registrar Cliente
        </Typography>
        <Divider sx={{ mb: 4 }} />

        {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {successMessage}
          </Alert>
        )}

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMessage}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom align="center">
              Información del Cliente
            </Typography>
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="RUT"
                  placeholder="Ej: 12345678-9"
                  value={clientRUT}
                  onChange={(e) => setClientRut(e.target.value)}
                  required
                  error={!!rutError}
                  helperText={rutError}
                  InputProps={{
                    inputProps: { maxLength: 10 }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth 
                  label="Nombre"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                  error={!!nameError}
                  helperText={nameError}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  required
                  error={!!emailError}
                  helperText={emailError}
                />
              </Grid>
              
              {/* Campos de fecha separados */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Fecha de Nacimiento
                </Typography>
                {birthdayError && (
                  <Alert severity="error" sx={{ mt: 1, mb: 2 }}>
                    {birthdayError}
                  </Alert>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  fullWidth
                  label="Día"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  required
                  error={!!birthdayError}
                >
                  <MenuItem value="">Seleccionar día</MenuItem>
                  {days.map((d) => (
                    <MenuItem key={d} value={d}>
                      {d}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  fullWidth
                  label="Mes"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  required
                  error={!!birthdayError}
                >
                  <MenuItem value="">Seleccionar mes</MenuItem>
                  {months.map((m) => (
                    <MenuItem key={m.value} value={m.value}>
                      {m.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  fullWidth
                  label="Año"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                  error={!!birthdayError}
                >
                  <MenuItem value="">Seleccionar año</MenuItem>
                  {years.map((y) => (
                    <MenuItem key={y} value={y}>
                      {y}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              size="large"
              disabled={loading}
              sx={{ 
                backgroundColor: "#FFA500",
                '&:hover': {
                  backgroundColor: "#FF8C00"
                }
              }}
            >
              {loading ? 'Registrando...' : 'Registrar Usuario'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default ClientRegister;
