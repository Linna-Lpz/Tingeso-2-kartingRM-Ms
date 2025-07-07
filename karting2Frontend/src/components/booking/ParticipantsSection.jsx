import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Grid, TextField, IconButton, Paper, List, ListItem, ListItemText, Alert, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const ParticipantsSection = ({ 
  person, 
  people, 
  numOfPeople, 
  onPersonChange, 
  onAddPerson, 
  onRemovePerson,
  rutError,
  nameError,
  lastNameError,
  emailError
}) => {
  // Función para validar RUT en tiempo real
  const validateRUTRealTime = (rut) => {
    if (!rut) return '';
    
    // Eliminar espacios y convertir a mayúsculas
    let cleanRut = rut.replace(/\s/g, '').replace(/\./g, '').toUpperCase();
    
    // Si está escribiendo y no tiene suficientes caracteres, no mostrar error
    if (cleanRut.length < 8) {
      return '';
    }
    
    // Si no tiene guión, agregarlo automáticamente para la validación
    if (!cleanRut.includes('-') && cleanRut.length >= 8) {
      cleanRut = cleanRut.slice(0, -1) + '-' + cleanRut.slice(-1);
    }
    
    // Verificar formato básico
    const rutRegex = /^[0-9]{7,8}-[0-9K]$/;
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
    const calculatedDV = remainder === 0 ? '0' : remainder === 1 ? 'K' : (11 - remainder).toString();
    
    if (dv !== calculatedDV) {
      return 'RUT no es válido';
    }
    
    // Verificar duplicados
    if (people.some(p => p.rut === cleanRut)) {
      return 'Este RUT ya fue agregado';
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

  // Función para validar apellido en tiempo real
  const validateLastNameRealTime = (lastName) => {
    if (!lastName) return '';
    
    if (lastName.trim().length > 0 && lastName.trim().length < 2) {
      return 'Mínimo 2 caracteres';
    }
    
    // Verificar caracteres no válidos
    const lastNameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
    if (!lastNameRegex.test(lastName)) {
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

  // Función para formatear RUT automáticamente
  const formatRUT = (value) => {
    // Eliminar todo excepto números y K
    let clean = value.replace(/[^0-9K]/g, '');
    
    // Limitar a máximo 9 caracteres
    if (clean.length > 9) {
      clean = clean.slice(0, 9);
    }
    
    // Agregar guión automáticamente
    if (clean.length >= 2) {
      clean = clean.slice(0, -1) + '-' + clean.slice(-1);
    }
    
    return clean;
  };

  // Manejadores de cambio con validación en tiempo real
  const handleRutChange = (e) => {
    const formattedRut = formatRUT(e.target.value);
    onPersonChange({ ...person, rut: formattedRut });
  };

  const handleNameChange = (e) => {
    // Solo permitir letras, espacios y caracteres especiales del español
    const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    onPersonChange({ ...person, name: value });
  };

  const handleLastNameChange = (e) => {
    // Solo permitir letras, espacios y caracteres especiales del español
    const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    onPersonChange({ ...person, lastName: value });
  };

  const handleEmailChange = (e) => {
    onPersonChange({ ...person, email: e.target.value });
  };

  // Obtener errores en tiempo real
  const realtimeRutError = validateRUTRealTime(person.rut);
  const realtimeNameError = validateNameRealTime(person.name);
  const realtimeLastNameError = validateLastNameRealTime(person.lastName);
  const realtimeEmailError = validateEmailRealTime(person.email);

  // Usar el error del padre si existe, sino usar el error en tiempo real
  const displayRutError = rutError || realtimeRutError;
  const displayNameError = nameError || realtimeNameError;
  const displayLastNameError = lastNameError || realtimeLastNameError;
  const displayEmailError = emailError || realtimeEmailError;

  // Verificar si todos los campos son válidos para habilitar el botón
  const isFormValid = person.rut && person.name && person.lastName && person.email &&
                     !displayRutError && !displayNameError && !displayLastNameError && !displayEmailError;

  return (
    <>
      <Typography variant="h6" gutterBottom>Ingresa los datos de cada integrante</Typography>
      
      {rutError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {rutError}
        </Alert>
      )}
      
      {nameError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {nameError}
        </Alert>
      )}
      
      {lastNameError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {lastNameError}
        </Alert>
      )}
      
      {emailError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {emailError}
        </Alert>
      )}

      {/* Recuadro para mostrar participantes restantes */}
      <Paper sx={{ p: 2, mb: 2, bgcolor: people.length === numOfPeople ? '#f1f8e9' : '#f8f9fa', border: '1px solid #e0e0e0' }}>
        <Typography variant="subtitle1" sx={{ color: people.length === numOfPeople ? '#2e7d32' : '#666666', fontWeight: 'medium' }}>
          {people.length === numOfPeople ? (
            <>
              ✓ Todos los participantes han sido agregados ({people.length}/{numOfPeople})
            </>
          ) : (
            <>
              Participantes agregados: {people.length}/{numOfPeople}
            </>
          )}
        </Typography>
        {people.length < numOfPeople && (
          <Typography variant="body2" sx={{ color: '#757575', mt: 1 }}>
            {numOfPeople - people.length === 1 
              ? `Falta agregar 1 participante más` 
              : `Faltan agregar ${numOfPeople - people.length} participantes más`
            }
          </Typography>
        )}
      </Paper>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="RUT"
            placeholder="Formato 12345678-9"
            value={person.rut}
            onChange={handleRutChange}
            error={!!displayRutError}
            helperText={displayRutError || "Ej: 12345678-9"}
            inputProps={{ maxLength: 10 }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Nombre"
            placeholder="Ej: Juan"
            value={person.name}
            onChange={handleNameChange}
            error={!!displayNameError}
            helperText={displayNameError}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Apellido"
            placeholder="Ej: Pérez"
            value={person.lastName}
            onChange={handleLastNameChange}
            error={!!displayLastNameError}
            helperText={displayLastNameError}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            placeholder="correo@ejemplo.com"
            value={person.email}
            onChange={handleEmailChange}
            error={!!displayEmailError}
            helperText={displayEmailError || "usuario@ejemplo.com"}
          />
        </Grid>
        <Grid item xs={12} sm={3} sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            color="primary"
            variant="contained"
            onClick={onAddPerson}
            disabled={people.length >= numOfPeople || !isFormValid}
            fullWidth
            sx={{ 
              minHeight: '56px',
              fontSize: { xs: '0.8rem', sm: '0.875rem' }
            }}
          >
            {people.length >= numOfPeople ? 'Completo' : 'Agregar'}
          </Button>
        </Grid>
      </Grid>

      <Paper variant="outlined" sx={{ maxHeight: 200, overflow: 'auto', mb: 3 }}>
        <List dense>
          {people.length === 0 ? (
            <ListItem>
              <ListItemText secondary="No hay personas agregadas" />
            </ListItem>
          ) : (
            people.map((p) => (
                <ListItem
                    key={p.rut}
                    secondaryAction={
                      <IconButton edge="end" onClick={() => onRemovePerson(p.rut)}>
                        <DeleteIcon />
                      </IconButton>
                    }
                >
                  <ListItemText
                      primary={`${p.name} ${p.lastName} (${p.rut})`}
                      secondary={p.email}
                  />
                </ListItem>
            ))
          )}
        </List>
      </Paper>
    </>
  );
};

ParticipantsSection.propTypes = {
  person: PropTypes.shape({
    rut: PropTypes.string,
    name: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
  people: PropTypes.arrayOf(
      PropTypes.shape({
        rut: PropTypes.string,
        name: PropTypes.string,
        lastName: PropTypes.string,
        email: PropTypes.string,
      })
  ).isRequired,
  numOfPeople: PropTypes.number.isRequired,
  onPersonChange: PropTypes.func.isRequired,
  onAddPerson: PropTypes.func.isRequired,
  onRemovePerson: PropTypes.func.isRequired,
  rutError: PropTypes.string,
  nameError: PropTypes.string,
  lastNameError: PropTypes.string,
  emailError: PropTypes.string,
};

export default ParticipantsSection;