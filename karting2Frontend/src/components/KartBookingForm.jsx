import React, { useState } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DigitalClock, DateCalendar } from '@mui/x-date-pickers';
import { es } from 'date-fns/locale';
import { Container, Typography, TextField, Button, Paper, Grid, 
        IconButton, List, ListItem, ListItemText, Divider, Box, Alert, 
        FormControl, InputLabel, Select, MenuItem} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import bookingService from '../services/services.management';
import { useNavigate } from 'react-router-dom';

// Inicialización del formulario
const KartBookingForm = () => {
  // Variables para manejar la fecha y hora
  const [bookingDate, setBookingDate] = useState(null);
  const [bookingTime, setBookingTime] = useState(null);
  const [bookingTimeNoFree, setBookingTimeNoFree] = useState([]);
  const [lapsOrMaxTime, setLapsOrMaxTime] = useState(10);
  // Variables para manejar datos del cliente
  const [numOfPeople, setNumOfPeople] = useState(1);
  const [person, setPerson] = useState({ rut: '', name: '', email: '' });
  const [people, setPeople] = useState([]);
  
  // Estados para errores específicos
  const [lapsError, setLapsError] = useState('');
  const [peopleError, setPeopleError] = useState('');
  const [dateError, setDateError] = useState('');
  const [timeError, setTimeError] = useState('');
  const [rutError, setRutError] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const navigate = useNavigate();

  // Definición de días feriados MM-DD
  const holidays = [
    '01-01', // Año Nuevo
    '05-01', // Día del Trabajador
    '09-18', // Fiestas Patrias
    '09-19', // Fiestas Patrias
    '12-25', // Navidad
  ];

  let blockDuration;
  if(lapsOrMaxTime === 10) blockDuration = 30;
  else if(lapsOrMaxTime === 15) blockDuration = 35;
  else if(lapsOrMaxTime === 20) blockDuration = 40;

  // Función para limpiar todos los errores
  const clearErrors = () => {
    setLapsError('');
    setPeopleError('');
    setDateError('');
    setTimeError('');
    setRutError('');
    setNameError('');
    setEmailError('');
    setGeneralError('');
    setSuccessMessage('');
  };

  // Función para manejar errores específicos del backend
  const handleValidationError = (errorMsg) => {
    clearErrors();
    
    // Errores específicos de vueltas/tiempo máximo
    if (errorMsg.includes('vueltas') || errorMsg.includes('tiempo máximo') || errorMsg.includes('10, 15 o 20')) {
      setLapsError(errorMsg);
    } 
    // Errores específicos de número de personas
    else if (errorMsg.includes('número de personas') || errorMsg.includes('mayor a 0') || errorMsg.includes('menor o igual a 15')) {
      setPeopleError(errorMsg);
    } 
    // Errores específicos de fecha
    else if (errorMsg.includes('fecha de reserva') || errorMsg.includes('fecha') || errorMsg.includes('nula')) {
      setDateError(errorMsg);
    } 
    // Errores específicos de hora
    else if (errorMsg.includes('hora de reserva') || errorMsg.includes('hora')) {
      setTimeError(errorMsg);
    } 
    // Errores específicos de RUT
    else if (errorMsg.includes('RUT') || errorMsg.includes('formato correcto') || errorMsg.includes('12345678-9')) {
      setRutError(errorMsg);
    } 
    // Errores específicos de nombre
    else if (errorMsg.includes('nombre') || errorMsg.includes('nulo o vacío')) {
      setNameError(errorMsg);
    } 
    // Errores específicos de email
    else if (errorMsg.includes('email') || errorMsg.includes('correo')) {
      setEmailError(errorMsg);
    } 
    // Errores generales de validación
    else {
      setGeneralError(errorMsg);
    }
  };

  // Función para obtener los horarios reservados (inicio y fin) y bloquear los horarios intermedios
  const fetchReservedTimes = async (date) => {
    if (!date) return;
  
    const formattedDate = date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    try {
      const [startResponse, endResponse] = await Promise.all([
        bookingService.getTimesByDate(formattedDate),
        bookingService.getTimesEndByDate(formattedDate)
      ]);
  
      console.log('Horarios de inicio:', startResponse.data);
      console.log('Horarios de fin:', endResponse.data);
  
      // Crear pares de horarios inicio-fin
      const blockedTimes = startResponse.data.map((time, index) => {
        const [startHour, startMinute] = time.split(':');
        const startTime = new Date(date);
        startTime.setHours(parseInt(startHour, 10), parseInt(startMinute, 10), 0, 0);
        
        // Si hay un tiempo de finalización, se usa
        if (endResponse.data[index]) {
          const [endHour, endMinute] = endResponse.data[index].split(':');
          const endTime = new Date(date);
          endTime.setHours(parseInt(endHour, 10), parseInt(endMinute, 10), 0, 0);
          return { start: startTime, end: endTime };
        }
        
        // Se calcula tiempo de finalización basado en blockDuration
        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + blockDuration);
        return { start: startTime, end: endTime };
      });
  
      setBookingTimeNoFree(blockedTimes);
      console.log('Horarios bloqueados:', blockedTimes);
  
    } catch (error) {
      console.error('Error al obtener los horarios reservados:', error);
    }
  };
  
  // Función para manejar el cambio de hora seleccionada
  const handleTimeChange = (newTime) => {
    setBookingTime(newTime);
    setTimeError(''); // Limpiar error cuando se selecciona una hora
  };

  const handleLapsOrMaxTimeChange = (value) => {
    setLapsOrMaxTime(value);
    if (value !== 10 && value !== 15 && value !== 20) {
      setLapsError('El número de vueltas o tiempo máximo permitido debe ser 10, 15 ó 20');
    } else {
      setLapsError('');
    }
  };

  const handleNumOfPeopleChange = (value) => {
    setNumOfPeople(value);
    if (value < 1 || value > 15) {
      setPeopleError('El número de personas debe ser entre 1 y 15');
    } else {
      setPeopleError('');
    }
  };
  
  // Función para verificar si la fecha es un feriado
  const isHoliday = (date) => {
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mes en formato MM
    const day = date.getDate().toString().padStart(2, '0'); // Día en formato DD
    const formattedDate = `${month}-${day}`; // Formato MM-DD
    return holidays.includes(formattedDate);
  };

  // Función para calcular la hora de término de la reserva
  const calculateEndTime = (startTime, duration) => {
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + duration); // Suma la duración en minutos
    return endTime;
  };

  // Función para deshabilitar horarios
  const shouldDisableTime = (timeValue) => {
    if (!bookingDate) return true;
  
    const date = new Date(bookingDate);
    const hour = timeValue.getHours();
    const minute = timeValue.getMinutes();
  
    const isWeekendOrHoliday = [0, 6].includes(date.getDay()) || isHoliday(date);
    const openingHour = isWeekendOrHoliday ? 10 : 14;
    const closingHour = 22;
  
    // Bloquear horas fuera de horario
    if (hour < openingHour || hour >= closingHour) return true;
  
    // Crear un objeto de tiempo para comparar
    const selectedTime = new Date(date);
    selectedTime.setHours(hour, minute, 0, 0);
    
    // Tiempo de finalización de la posible reserva
    const potentialEndTime = new Date(selectedTime);
    potentialEndTime.setMinutes(potentialEndTime.getMinutes() + blockDuration);
  
    // Comprobar si esta posible reserva se solapa con alguna reserva existente
    for (const blockTime of bookingTimeNoFree) {
      // Si el tiempo seleccionado está entre el inicio y fin de una reserva existente
      if ((selectedTime >= blockTime.start && selectedTime < blockTime.end) ||
          // O si el tiempo de finalización de la posible reserva se solapa con una reserva existente
          (potentialEndTime > blockTime.start && selectedTime < blockTime.start)) {
        return true;
      }
    }
  
    return false;
  };
  
  // Función para manejar el cambio de fecha y obtener los horarios reservados
  const handleDateChange = (newDate) => {
    setBookingDate(newDate);
    setDateError(''); // Limpiar error cuando se selecciona una fecha
    if (newDate) {
      fetchReservedTimes(newDate); // Llama a la función unificada para obtener los horarios reservados
    }
  };

  // Función para validar de los datos del cliente que reserva
  const validatePerson = () => {
    let hasErrors = false;
    
    if (!person.rut) {
      setRutError('RUT es requerido');
      hasErrors = true;
    } else {
      setRutError('');
    }
    
    if (!person.name) {
      setNameError('Nombre es requerido');
      hasErrors = true;
    } else {
      setNameError('');
    }
    
    if (!person.email) {
      setEmailError('Email es requerido');
      hasErrors = true;
    } else {
      setEmailError('');
    }
    
    return hasErrors;
  };

  // Función para añadir una persona a la lista de participantes
  const addPerson = async () => {
    const hasErrors = validatePerson();
    if (hasErrors) {
      return;
    }
    
    setPeople([...people, person]);
    setPerson({ rut: '', name: '', email: '' });
    clearErrors();
  };

  // Función para eliminar una persona de la lista de participantes
  const removePerson = (index) => {
    const updatedPeople = [...people];
    updatedPeople.splice(index, 1);
    setPeople(updatedPeople);
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearErrors();

    if (!bookingDate || !bookingTime || people.length < numOfPeople || !lapsOrMaxTime) {
      setGeneralError('Por favor complete todos los campos requeridos y agregue el número correcto de participantes');
      return;
    }

    const duration = blockDuration;
    const endTime = calculateEndTime(bookingTime, duration);

    // Desglosar los datos de los participantes
    const clientsRUT = people.map(p => p.rut).join(',');
    const clientsNames = people.map(p => p.name).join(',');
    const clientsEmails = people.map(p => p.email).join(',');

    const reservationData = {
      bookingDate: bookingDate.toISOString().split('T')[0], // YYYY-MM-DD
      bookingTime: bookingTime.toTimeString().slice(0,5),   // HH:MM
      bookingTimeEnd: endTime.toTimeString().slice(0,5),    // HH:MM
      lapsOrMaxTimeAllowed: lapsOrMaxTime,
      numOfPeople,
      clientsRUT,
      clientsNames,
      clientsEmails
    };

    try {
      const response = await bookingService.saveBooking(reservationData);

      if (response.status === 200) {
        setBookingDate(null);
        setBookingTime(null);
        setPeople([]);
        clearErrors();
        setSuccessMessage('Reserva guardada exitosamente! A continuación será redirigido para validar su reserva');
        setTimeout(() => {
          navigate("/statusKartBooking");
        }, 2000);
      }
    } catch (error) {
      console.error('Error al guardar la reserva:', error);
      
      // Manejo mejorado de errores del backend
      if (error.response && error.response.data) {
        // Extraer el mensaje de error del backend
        let errorMessage;
        
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else {
          errorMessage = 'Error de validación en el servidor';
        }
        
        handleValidationError(errorMessage);
      } else if (error.message) {
        // Error de conexión o red
        if (error.message.includes('Network Error') || error.message.includes('ERR_NETWORK')) {
          setGeneralError('Error de conexión. Por favor, verifique su conexión a internet e intente nuevamente.');
        } else {
          setGeneralError(error.message);
        }
      } else {
        setGeneralError('Error inesperado. Por favor intente nuevamente.');
      }
    }
  };
   
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom align="center">
            Reserva de Karts
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {successMessage && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {successMessage}
            </Alert>
          )}

          {generalError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {generalError}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {/* Sección de detalles */}
            <Typography variant="h6" gutterBottom>Detalles de la Actividad</Typography>
            
            {lapsError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {lapsError}
              </Alert>
            )}
            
            {peopleError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {peopleError}
              </Alert>
            )}

            <Grid container spacing={2} sx={{ mb: 5 }} justifyContent={'center'}>
              <Grid>
                <FormControl fullWidth sx={{ minWidth: 200 }} error={!!lapsError}>
                  <InputLabel id="laps-select-label">Vueltas o tiempo máximo</InputLabel>
                  <Select
                    labelId="laps-select-label"
                    value={lapsOrMaxTime}
                    label="Vueltas o tiempo máximo"
                    onChange={(e) => handleLapsOrMaxTimeChange(e.target.value)}
                  >
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={15}>15</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid>
                <TextField
                  fullWidth
                  label="Número de personas"
                  type="number"
                  value={numOfPeople}
                  onChange={(e) => handleNumOfPeopleChange(parseInt(e.target.value))}
                  slotProps={{min: 1, max: 15}}
                  error={!!peopleError}
                  sx={{ minWidth: 200 }}
                />
              </Grid>
            </Grid>

            {/* Sección de fecha y hora */}
            <Typography variant="h6" gutterBottom>Fecha y hora</Typography>
            
            {dateError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {dateError}
              </Alert>
            )}
            
            {timeError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {timeError}
              </Alert>
            )}

            <Grid container spacing={2} sx={{ mb: 2 }} justifyContent={'center'}>
              <Grid>
                <DateCalendar
                  value={bookingDate}
                  onChange={handleDateChange}
                  disablePast
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      error: !!dateError
                    }
                  }}
                />
              </Grid>
              <Grid>
                <Paper sx={{ p: 2, minWidth: 280 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Horarios disponibles
                  </Typography>
                  <DigitalClock
                    value={bookingTime}
                    onChange={handleTimeChange}
                    disabled={!bookingDate}
                    shouldDisableTime={shouldDisableTime}
                    skipDisabled
                    ampm={false}
                    timeStep={1}
                  />
                </Paper>
              </Grid>
            </Grid>

            {/* Sección de participantes */}
            <Typography variant="h6" gutterBottom>Datos de las personas</Typography>
            <Typography variant="subtitle1" gutterBottom color='textSecondary'> Ingresa primero a quien realiza la reserva</Typography>
            
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
            
            {emailError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {emailError}
              </Alert>
            )}

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid>
                <TextField
                  fullWidth
                  label="RUT"
                  placeholder="Formato 12345678-9"
                  value={person.rut}
                  onChange={(e) => setPerson({ ...person, rut: e.target.value })}
                  error={!!rutError}
                />
              </Grid>
              <Grid>
                <TextField
                  fullWidth
                  label="Nombre y Apellido"
                  placeholder="Ej: Juan Pérez"
                  value={person.name}
                  onChange={(e) => setPerson({ ...person, name: e.target.value })}
                  error={!!nameError}
                />
              </Grid>
              <Grid>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={person.email}
                  onChange={(e) => setPerson({ ...person, email: e.target.value })}
                  error={!!emailError}
                />
              </Grid>
              <Grid sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton 
                  color="primary" 
                  onClick={addPerson}
                  disabled={people.length >= numOfPeople}
                >
                  <AddIcon />
                </IconButton>
              </Grid>
            </Grid>

            {/* Lista de participantes */}
            <Paper variant="outlined" sx={{ maxHeight: 200, overflow: 'auto', mb: 3 }}>
              <List dense>
                {people.length === 0 ? (
                  <ListItem>
                    <ListItemText secondary="No hay personas agregadas" />
                  </ListItem>
                ) : (
                  people.map((p, index) => (
                    <ListItem 
                      key={index}
                      secondaryAction={
                        <IconButton edge="end" onClick={() => removePerson(index)}>
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText 
                        primary={`${p.name} (${p.rut})`} 
                        secondary={p.email} 
                      />
                    </ListItem>
                  ))
                )
                }
              </List>
            </Paper>

            {/* Botón de envío */}
            <Box sx={{ textAlign: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={people.length < numOfPeople || !bookingDate || !bookingTime || !lapsOrMaxTime}
              >
                Reservar
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export default KartBookingForm;