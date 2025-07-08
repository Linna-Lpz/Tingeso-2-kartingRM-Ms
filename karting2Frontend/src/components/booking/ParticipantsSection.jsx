import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Grid, TextField, IconButton, Paper, List, ListItem, ListItemText, Button } from '@mui/material';
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
  // Constantes para evitar duplicación de strings
  const ERROR_MESSAGES = {
    EMAIL_FORMAT: 'Formato: usuario@ejemplo.com',
    RUT_FORMAT: 'Formato: 21021021-0',
    INVALID_RUT: 'RUT no es válido',
    DUPLICATE_RUT: 'Este RUT ya fue agregado'
  };

  const REGEX_PATTERNS = {
    SPANISH_TEXT: /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g,
    RUT_CLEAN: /[^0-9K]/g,
    RUT_VALIDATION: /^\d{7,8}-[\dK]$/,
    EMAIL_VALIDATION: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  };
  // Función para formatear RUT automáticamente
  const formatRUT = (value) => {
    let clean = value.replace(REGEX_PATTERNS.RUT_CLEAN, '');
    
    // Limitar a máximo 9 caracteres
    if (clean.length > 9) {
      clean = clean.slice(0, 9);
    }
    
    // Agregar guión automáticamente
    if (clean.length >= 8) {
      clean = clean.slice(0, -1) + '-' + clean.slice(-1);
    }
    
    return clean;
  };

  // Función auxiliar para calcular dígito verificador del RUT
  const calculateRutDV = (rutNumber) => {
    let sum = 0;
    let multiplier = 2;
    
    for (let i = rutNumber.length - 1; i >= 0; i--) {
      sum += parseInt(rutNumber.charAt(i)) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }
    
    const remainder = sum % 11;
    if (remainder === 0) return '0';
    if (remainder === 1) return 'K';
    return (11 - remainder).toString();
  };

  // Función para validar RUT en tiempo real
  const validateRUTRealTime = (rut) => {
    if (!rut) return '';
    
    // Eliminar espacios y convertir a mayúsculas
    let cleanRut = rut.replace(/\s/g, '').replace(/\./g, '').toUpperCase();
    
    // Si está escribiendo y no tiene suficientes caracteres, no mostrar error
    if (cleanRut.length < 8) {
      return '';
    }
    
    // Si no tiene guion, agregarlo automáticamente para la validación
    if (!cleanRut.includes('-') && cleanRut.length >= 8) {
      cleanRut = cleanRut.slice(0, -1) + '-' + cleanRut.slice(-1);
    }
    
    // Verificar formato básico
    if (!REGEX_PATTERNS.RUT_VALIDATION.test(cleanRut)) {
      return ERROR_MESSAGES.RUT_FORMAT;
    }
    
    // Validar dígito verificador
    const [rutNumber, dv] = cleanRut.split('-');
    const calculatedDV = calculateRutDV(rutNumber);
    
    if (dv !== calculatedDV) {
      return ERROR_MESSAGES.INVALID_RUT;
    }
    
    // Verificar duplicados
    if (people.some(p => p.rut === cleanRut)) {
      return ERROR_MESSAGES.DUPLICATE_RUT;
    }
    
    return '';
  };

  // Función para validar campos de texto (nombre y apellido)
  const validateTextFieldRealTime = (value, fieldName) => {
    if (!value) return '';
    
    if (value.trim().length > 0 && value.trim().length < 2) {
      return `Ingrese un ${fieldName} válido`;
    }
    
    return '';
  };

  // Función para validar nombre en tiempo real
  const validateNameRealTime = (name) => validateTextFieldRealTime(name, 'nombre');

  // Función para validar apellido en tiempo real
  const validateLastNameRealTime = (lastName) => validateTextFieldRealTime(lastName, 'apellido');

  // Función auxiliar para validar el formato básico del email
  const isBasicEmailFormatInvalid = (email) => {
    return email.startsWith('@') || email.endsWith('@') || email.split('@').length > 2;
  };

  // Función auxiliar para validar el dominio del email
  const isDomainInvalid = (domain) => {
    if (!domain.includes('.')) {
      return domain.length > 2;
    }
    return !REGEX_PATTERNS.EMAIL_VALIDATION.test(domain);
  };

  // Validación de email
  const validateEmailRealTime = (email) => {
    if (!email) return '';

    const trimmedEmail = email.trim();
    if (trimmedEmail.length > 0 && !trimmedEmail.includes('@')) {
      return trimmedEmail.length > 10 ? ERROR_MESSAGES.EMAIL_FORMAT : '';
    }

    if (trimmedEmail.includes('@')) {
      if (isBasicEmailFormatInvalid(trimmedEmail)) {
        return ERROR_MESSAGES.EMAIL_FORMAT;
      }
      const domain = trimmedEmail.split('@')[1];
      if (domain && isDomainInvalid(trimmedEmail)) {
        return ERROR_MESSAGES.EMAIL_FORMAT;
      }
    }

    return '';
  };

  // Función reutilizable para manejar cambios en campos de texto
  const handleTextFieldChange = (field, regex) => (e) => {
    const value = regex ? e.target.value.replace(regex, '') : e.target.value;
    onPersonChange({ ...person, [field]: value });
  };

  // Validación en tiempo real
  const handleRutChange = (e) => {
    const formattedRut = formatRUT(e.target.value);
    onPersonChange({ ...person, rut: formattedRut });
  };

  const handleNameChange = handleTextFieldChange('name', REGEX_PATTERNS.SPANISH_TEXT);
  const handleLastNameChange = handleTextFieldChange('lastName', REGEX_PATTERNS.SPANISH_TEXT);
  const handleEmailChange = handleTextFieldChange('email');

  // Obtener errores en tiempo real
  const realtimeRutError = validateRUTRealTime(person.rut);
  const realtimeNameError = validateNameRealTime(person.name);
  const realtimeLastNameError = validateLastNameRealTime(person.lastName);
  const realtimeEmailError = validateEmailRealTime(person.email);

  // Usar el error del padre si existe, si no usar el error en tiempo real
  const displayRutError = rutError || realtimeRutError;
  const displayNameError = nameError || realtimeNameError;
  const displayLastNameError = lastNameError || realtimeLastNameError;
  const displayEmailError = emailError || realtimeEmailError;

  // Función para crear configuración de TextField
  const createTextFieldConfig = (configData) => {
    const { label, placeholder, value, onChange, error, helperText, type = 'text' } = configData;
    return {
      fullWidth: true,
      label,
      placeholder,
      value,
      onChange,
      error: !!error,
      helperText: error || helperText,
      ...(type !== 'text' && { type })
    };
  };

  // Configuraciones de los campos
  const fieldConfigs = [
    { field: 'rut', label: 'RUT', placeholder: 'Formato 21021021-0', value: person.rut, onChange: handleRutChange, error: displayRutError, helperText: 'Ej: 12345678-9' },
    { field: 'name', label: 'Nombre', placeholder: 'Ej: Juan', value: person.name, onChange: handleNameChange, error: displayNameError, helperText: '' },
    { field: 'lastName', label: 'Apellido', placeholder: 'Ej: Pérez', value: person.lastName, onChange: handleLastNameChange, error: displayLastNameError, helperText: '' },
    { field: 'email', label: 'Email', placeholder: 'correo@ejemplo.com', value: person.email, onChange: handleEmailChange, error: displayEmailError, helperText: 'usuario@ejemplo.com', type: 'email' }
  ];

  // Verificar si todos los campos son válidos para habilitar el botón
  const isFormValid = person.rut && person.name && person.lastName && person.email &&
                     person.rut.length >= 9 && // RUT completo (8 o 9 caracteres con guión)
                     person.name.trim().length >= 2 &&
                     person.lastName.trim().length >= 2 &&
                     person.email.includes('@') && person.email.includes('.') && // Email básicamente completo
                     !displayRutError && !displayNameError && !displayLastNameError && !displayEmailError;

  return (
    <>
      <Typography variant="h6" gutterBottom>Ingresa los datos de cada integrante</Typography>

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
        {fieldConfigs.map((config) => (
          <Grid key={config.field}>
            <TextField {...createTextFieldConfig(config)} />
          </Grid>
        ))}
        <Grid sx={{ display: 'flex', alignItems: 'center' }}>
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