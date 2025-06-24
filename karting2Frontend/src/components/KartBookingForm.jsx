import React, { useState } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { es } from 'date-fns/locale';
import { 
  Container, 
  Typography, 
  Button, 
  Paper, 
  Divider, 
  Box, 
  Alert,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Chip,
  Card,
  CardContent
} from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon, 
  Info as InfoIcon,
  Warning as WarningIcon 
} from '@mui/icons-material';
import bookingService from '../services/services.management';
import { useNavigate } from 'react-router-dom';

// Importar los componentes modulares
import ActivityDetailsSection from './booking/ActivityDetailsSection';
import DateTimeSection from './booking/DateTimeSection';
import ParticipantsSection from './booking/ParticipantsSection';

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
  
  // Estados para mejorar UX (Nielsen: Visibilidad del estado del sistema)
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [loadingTimes, setLoadingTimes] = useState(false);
  
  const navigate = useNavigate();

  // Pasos del proceso (Nielsen: Visibilidad del estado del sistema)
  const steps = [
    'Detalles de la actividad',
    'Fecha y hora',
    'Participantes',
    'Confirmar reserva'
  ];

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

  // Función para determinar el paso actual basado en datos completados
  const getCurrentStep = () => {
    if (!lapsOrMaxTime || !numOfPeople) return 0;
    if (!bookingDate || !bookingTime) return 1;
    if (people.length < numOfPeople) return 2;
    return 3;
  };

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

  // Función mejorada para mostrar feedback específico (Nielsen: Prevención de errores)
  const handleValidationError = (errorMsg) => {
    clearErrors();
    
    // Errores específicos de vueltas/tiempo máximo
    if (errorMsg.includes('vueltas') || errorMsg.includes('tiempo máximo') || errorMsg.includes('10, 15 o 20')) {
      setLapsError(errorMsg);
      setActiveStep(0);
    } 
    // Errores específicos de número de personas
    else if (errorMsg.includes('número de personas') || errorMsg.includes('mayor a 0') || errorMsg.includes('menor o igual a 15')) {
      setPeopleError(errorMsg);
      setActiveStep(0);
    } 
    // Errores específicos de fecha
    else if (errorMsg.includes('fecha de reserva') || errorMsg.includes('fecha') || errorMsg.includes('nula')) {
      setDateError(errorMsg);
      setActiveStep(1);
    } 
    // Errores específicos de hora
    else if (errorMsg.includes('hora de reserva') || errorMsg.includes('hora')) {
      setTimeError(errorMsg);
      setActiveStep(1);
    } 
    // Errores específicos de RUT
    else if (errorMsg.includes('RUT') || errorMsg.includes('formato correcto') || errorMsg.includes('12345678-9')) {
      setRutError(errorMsg);
      setActiveStep(2);
    } 
    // Errores específicos de nombre
    else if (errorMsg.includes('nombre') || errorMsg.includes('nulo o vacío')) {
      setNameError(errorMsg);
      setActiveStep(2);
    } 
    // Errores específicos de email
    else if (errorMsg.includes('email') || errorMsg.includes('correo')) {
      setEmailError(errorMsg);
      setActiveStep(2);
    } 
    // Errores generales de validación
    else {
      setGeneralError(errorMsg);
    }
  };

  // Función mejorada con indicador de carga (Nielsen: Visibilidad del estado del sistema)
  const fetchReservedTimes = async (date) => {
    if (!date) return;
    
    setLoadingTimes(true);
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
      setGeneralError('Error al cargar horarios disponibles. Por favor, intente nuevamente.');
    } finally {
      setLoadingTimes(false);
    }
  };
  
  // Función para manejar el cambio de hora seleccionada
  const handleTimeChange = (newTime) => {
    setBookingTime(newTime);
    setTimeError(''); // Limpiar error cuando se selecciona una hora
    setActiveStep(getCurrentStep());
  };

  const handleLapsOrMaxTimeChange = (value) => {
    setLapsOrMaxTime(value);
    if (value !== 10 && value !== 15 && value !== 20) {
      setLapsError('El número de vueltas o tiempo máximo permitido debe ser 10, 15 ó 20');
    } else {
      setLapsError('');
      setActiveStep(getCurrentStep());
    }
  };

  const handleNumOfPeopleChange = (value) => {
    setNumOfPeople(value);
    if (value < 1 || value > 15) {
      setPeopleError('El número de personas debe ser entre 1 y 15');
    } else {
      setPeopleError('');
      setActiveStep(getCurrentStep());
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
    setActiveStep(getCurrentStep());
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
    setActiveStep(getCurrentStep());
  };

  // Función para eliminar una persona de la lista de participantes
  const removePerson = (index) => {
    const updatedPeople = [...people];
    updatedPeople.splice(index, 1);
    setPeople(updatedPeople);
    setActiveStep(getCurrentStep());
  };

  // Función mejorada con mejor feedback (Nielsen: Visibilidad del estado del sistema)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    clearErrors();

    if (!bookingDate || !bookingTime || people.length < numOfPeople || !lapsOrMaxTime) {
      setGeneralError('Por favor complete todos los campos requeridos y agregue el número correcto de participantes');
      setIsLoading(false);
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
        setSuccessMessage('¡Reserva guardada exitosamente! Será redirigido para validar su reserva en 3 segundos...');
        setTimeout(() => {
          navigate("/statusKartBooking");
        }, 3000);
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
    } finally {
      setIsLoading(false);
    }
  };
   
  // Función para mostrar resumen de la reserva (Nielsen: Prevención de errores)
  const renderBookingSummary = () => {
    if (getCurrentStep() < 3) return null;

    return (
      <Card sx={{ mb: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InfoIcon />
            Resumen de su reserva
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
            <Chip 
              label={`${lapsOrMaxTime} vueltas/minutos`} 
              color="secondary" 
              size="small"
            />
            <Chip 
              label={`${numOfPeople} persona${numOfPeople > 1 ? 's' : ''}`} 
              color="secondary" 
              size="small"
            />
            {bookingDate && (
              <Chip 
                label={bookingDate.toLocaleDateString('es-CL')} 
                color="secondary" 
                size="small"
              />
            )}
            {bookingTime && (
              <Chip 
                label={bookingTime.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })} 
                color="secondary" 
                size="small"
              />
            )}
            <Chip 
              label={`Duración: ${blockDuration} min`} 
              color="secondary" 
              size="small"
            />
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          {/* Header con información clara (Nielsen: Estándares y consistencia) */}
          <Typography variant="h4" gutterBottom align="center" color="primary">
            Reserva de Karts
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 2 }}>
            Complete el formulario paso a paso para reservar su experiencia
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {/* Indicador de progreso fijo (Nielsen: Visibilidad del estado del sistema) */}
          <Box 
            sx={{ 
              position: 'sticky',
              top: 80,
              zIndex: 1000,
              backgroundColor: 'background.paper',
              py: 2,
              mb: 2,
              borderRadius: 1,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Stepper 
              activeStep={getCurrentStep()} 
              sx={{ 
                '& .MuiStepLabel-root': {
                  cursor: 'default'
                }
              }}
            >
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel 
                    icon={getCurrentStep() > index ? <CheckCircleIcon color="success" /> : undefined}
                    sx={{
                      '& .MuiStepLabel-label': {
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        fontWeight: getCurrentStep() === index ? 600 : 400,
                        color: getCurrentStep() === index ? 'primary.main' : 'text.secondary'
                      }
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            
            {/* Indicador de progreso visual adicional */}
            <Box sx={{ mt: 2, px: 2 }}>
              <Box 
                sx={{ 
                  width: '100%', 
                  height: 4, 
                  backgroundColor: 'grey.200', 
                  borderRadius: 2,
                  overflow: 'hidden'
                }}
              >
                <Box 
                  sx={{ 
                    width: `${(getCurrentStep() / (steps.length - 1)) * 100}%`, 
                    height: '100%', 
                    backgroundColor: 'primary.main',
                    transition: 'width 0.3s ease-in-out'
                  }}
                />
              </Box>
              <Typography 
                variant="caption" 
                sx={{ 
                  display: 'block', 
                  textAlign: 'center', 
                  mt: 1, 
                  color: 'text.secondary',
                  fontWeight: 500
                }}
              >
                Paso {getCurrentStep() + 1} de {steps.length}
              </Typography>
            </Box>
          </Box>

          {/* Mensajes de estado (Nielsen: Visibilidad del estado del sistema) */}
          {successMessage && (
            <Alert 
              severity="success" 
              sx={{ mb: 3 }}
              icon={<CheckCircleIcon />}
            >
              {successMessage}
            </Alert>
          )}

          {generalError && (
            <Alert 
              severity="error" 
              sx={{ mb: 3 }}
              icon={<WarningIcon />}
            >
              {generalError}
            </Alert>
          )}

          {/* Información de horarios (Nielsen: Ayuda y documentación) */}
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ display: 'inline', alignItems: 'center' }}>
              <strong>Horarios de atención:</strong><br />
              • Lunes a Viernes: 14:00 - 22:00<br />
              • Fines de semana y feriados: 10:00 - 22:00
            </Typography>
          </Alert>

          {/* Indicador de carga para horarios (Nielsen: Visibilidad del estado del sistema) */}
          {loadingTimes && (
            <Alert severity="info" sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CircularProgress size={20} />
                Cargando horarios disponibles...
              </Box>
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <ActivityDetailsSection
              lapsOrMaxTime={lapsOrMaxTime}
              numOfPeople={numOfPeople}
              onLapsChange={handleLapsOrMaxTimeChange}
              onPeopleChange={handleNumOfPeopleChange}
              lapsError={lapsError}
              peopleError={peopleError}
            />

            <DateTimeSection
              bookingDate={bookingDate}
              bookingTime={bookingTime}
              onDateChange={handleDateChange}
              onTimeChange={handleTimeChange}
              shouldDisableTime={shouldDisableTime}
              dateError={dateError}
              timeError={timeError}
              loadingTimes={loadingTimes}
            />

            <ParticipantsSection
              person={person}
              people={people}
              numOfPeople={numOfPeople}
              onPersonChange={setPerson}
              onAddPerson={addPerson}
              onRemovePerson={removePerson}
              rutError={rutError}
              nameError={nameError}
              emailError={emailError}
            />

            {/* Resumen de la reserva (Nielsen: Prevención de errores) */}
            {renderBookingSummary()}

            {/* Botón de envío mejorado (Nielsen: Control y libertad del usuario) */}
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={
                  people.length < numOfPeople || 
                  !bookingDate || 
                  !bookingTime || 
                  !lapsOrMaxTime ||
                  isLoading
                }
                sx={{ 
                  minWidth: 200,
                  position: 'relative'
                }}
              >
                {isLoading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} color="inherit" />
                    Procesando...
                  </Box>
                ) : (
                  'Confirmar Reserva'
                )}
              </Button>
              
              {/* Texto de ayuda (Nielsen: Ayuda y documentación) */}
              <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                {people.length < numOfPeople && 
                  `Faltan ${numOfPeople - people.length} participante${numOfPeople - people.length > 1 ? 's' : ''}`}
              </Typography>
            </Box>
          </form>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export default KartBookingForm;