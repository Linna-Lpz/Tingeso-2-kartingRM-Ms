import React, { useState } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { es } from 'date-fns/locale';
import { 
  Container, 
  Typography, 
  Button, 
  Paper, 
  Box, 
  Alert,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon, 
  Info as InfoIcon,
  Warning as WarningIcon,
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
  const [person, setPerson] = useState({ rut: '', name: '', lastName: '', email: '' });
  const [people, setPeople] = useState([]);
  
  // Estados para errores específicos
  const [lapsError, setLapsError] = useState('');
  const [peopleError, setPeopleError] = useState('');
  const [dateError, setDateError] = useState('');
  const [timeError, setTimeError] = useState('');
  const [rutError, setRutError] = useState('');
  const [nameError, setNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
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

  // Funciones para navegación entre pasos
  const nextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  // Función para validar si se puede avanzar al siguiente paso
  const canProceedToNextStep = () => {
    switch (activeStep) {
      case 0: // Detalles de la actividad
        return lapsOrMaxTime && numOfPeople >= 1 && numOfPeople <= 15;
      case 1: // Fecha y hora
        return bookingDate && bookingTime;
      case 2: // Participantes
        return people.length === numOfPeople;
      case 3: // Confirmar reserva
        return true;
      default:
        return false;
    }
  };

  // Función para limpiar todos los errores
  const clearErrors = () => {
    setLapsError('');
    setPeopleError('');
    setDateError('');
    setTimeError('');
    setRutError('');
    setNameError('');
    setLastNameError('');
    setEmailError('');
    setGeneralError('');
    setSuccessMessage('');
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
  
  // Función para calcular la hora de término basada en las vueltas
  const calculateBookingTimeEnd = (startTime, laps) => {
    if (!startTime) return null;
    
    const endTime = new Date(startTime);
    let additionalMinutes;
    
    if (laps === 10) additionalMinutes = 30;
    else if (laps === 15) additionalMinutes = 35;
    else if (laps === 20) additionalMinutes = 40;
    else additionalMinutes = 0; // valor por defecto
    
    endTime.setMinutes(endTime.getMinutes() + additionalMinutes);
    return endTime;
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
      // Resetear lista de participantes si el número cambia
      if (people.length > value) {
        setPeople(people.slice(0, value));
      }
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
    let updatedPerson = { ...person };
    
    // Validar RUT
    const rutValidation = validateRUT(person.rut);
    if (!rutValidation.isValid) {
      setRutError(rutValidation.error);
      hasErrors = true;
    } else {
      setRutError('');
      updatedPerson.rut = rutValidation.formattedRut;
    }
    
    // Validar nombre
    const nameValidation = validateName(person.name);
    if (!nameValidation.isValid) {
      setNameError(nameValidation.error);
      hasErrors = true;
    } else {
      setNameError('');
    }
    
    // Validar apellido
    const lastNameValidation = validateLastName(person.lastName);
    if (!lastNameValidation.isValid) {
      setLastNameError(lastNameValidation.error);
      hasErrors = true;
    } else {
      setLastNameError('');
    }
    
    // Validar email
    const emailValidation = validateEmail(person.email);
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error);
      hasErrors = true;
    } else {
      setEmailError('');
    }
    
    // Verificar que no exista una persona con el mismo RUT
    if (rutValidation.isValid && people.some(p => p.rut === rutValidation.formattedRut)) {
      setRutError('Ya existe una persona con este RUT');
      hasErrors = true;
    }
    
    // Si no hay errores, actualizar el estado con el RUT formateado
    if (!hasErrors && updatedPerson.rut !== person.rut) {
      setPerson(updatedPerson);
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
    setPerson({ rut: '', name: '', lastName: '', email: '' });
    clearErrors();
  };

  // Función para eliminar una persona de la lista de participantes
  const removePerson = (rut) => {
    const updatedPeople = people.filter(person => person.rut !== rut);
    setPeople(updatedPeople);
  };

// Refactor de handleSubmit
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

    const clientsRUT = people.map(p => p.rut).join(',');
    const clientsNames = people.map(p => `${p.name} ${p.lastName}`).join(',');
    const clientsEmails = people.map(p => p.email).join(',');

    const reservationData = {
      bookingDate: bookingDate.toISOString().split('T')[0],
      bookingTime: bookingTime.toTimeString().slice(0,5),
      bookingTimeEnd: endTime.toTimeString().slice(0,5),
      lapsOrMaxTimeAllowed: lapsOrMaxTime,
      numOfPeople,
      clientsRUT,
      clientsNames,
      clientsEmails
    };

    try {
      // Paso 1: Crear la reserva
      const response = await bookingService.saveBooking(reservationData);

      if (response.status === 200) {
        const bookingId = response.data.id || response.data;
        
        // Paso 2: Confirmar el pago de la reserva automáticamente (igual que en StatusKartBooking)
        try {
          console.log('Confirmando reserva con ID:', bookingId);
          await bookingService.confirmBooking(bookingId);
          
          // Intentar enviar vouchers, pero no fallar si esto no funciona
          try {
            await bookingService.sendVoucherByEmail(bookingId);
            // Redirigir a página de confirmación con éxito completo
            navigate('/payment-confirmation', {
              state: {
                paymentResult: {
                  success: true,
                  message: '¡Pago procesado exitosamente! Comprobante enviado por email a cada participante.',
                  bookingId: bookingId,
                  hasVoucherError: false
                }
              }
            });
            
          } catch (voucherError) {
            console.error('Error al enviar comprobante:', voucherError);
            // La reserva está confirmada, pero los vouchers no se pudieron enviar
            navigate('/payment-confirmation', {
              state: {
                paymentResult: {
                  success: true,
                  message: '¡Pago procesado exitosamente! Reserva confirmada. Hubo un problema al enviar el comprobante por email, pero puede revisarlos desde "Mis Reservas".',
                  bookingId: bookingId,
                  hasVoucherError: true
                }
              }
            });
          }
        } catch (confirmError) {
          console.error('Error al pagar la reserva:', confirmError);
          // Redirigir a página de confirmación con error de pago
          navigate('/payment-confirmation', {
            state: {
              paymentResult: {
                success: false,
                message: 'Error al procesar el pago. Por favor, intente nuevamente o contacte con soporte.',
                bookingId: bookingId,
                hasVoucherError: false
              }
            }
          });
        }
      }
    } catch (error) {
      console.error('Error al guardar la reserva:', error);
      // Para errores en la creación de la reserva, redirigir con error general
      navigate('/payment-confirmation', {
        state: {
          paymentResult: {
            success: false,
            message: 'Error al crear la reserva. Por favor, verifique los datos e intente nuevamente.',
            bookingId: null,
            hasVoucherError: false
          }
        }
      });
    } finally {
      setIsLoading(false);
    }
  };
   
  // Función para renderizar el resumen de la reserva completo
  const renderBookingSummary = () => {
    return (
      <Card 
        sx={{ 
          mb: 3, 
          background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
          border: '2px solid #0EA5E9',
          borderRadius: 3,
          boxShadow: '0 8px 25px rgba(14, 165, 233, 0.15)'
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              mb: 4,
              color: '#0369A1',
              fontWeight: 'bold'
            }}
          >
            <InfoIcon sx={{ fontSize: 35, color: '#0EA5E9' }} />
            Resumen de la Reserva
          </Typography>
          
          <Box sx={{ display: 'grid', gap: 3 }}>
            <Box sx={{ 
              p: 3, 
              bgcolor: 'white', 
              borderRadius: 2, 
              border: '1px solid #BAE6FD',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <Typography variant="h6" sx={{ color: '#0369A1', fontWeight: 'bold', mb: 2 }}>
                Detalles de la Actividad
              </Typography>
              <Typography variant="body1" sx={{ mb: 1, color: '#1E293B' }}>
                <strong>N° de vueltas o tiempo máximo:</strong> <span style={{ color: '#0EA5E9', fontWeight: 'bold' }}>{lapsOrMaxTime}</span>
              </Typography>
              <Typography variant="body1" sx={{ color: '#1E293B' }}>
                <strong>Cantidad de integrantes:</strong> <span style={{ color: '#0EA5E9', fontWeight: 'bold' }}>{numOfPeople}</span>
              </Typography>
            </Box>
            
            <Box sx={{ 
              p: 3, 
              bgcolor: 'white', 
              borderRadius: 2, 
              border: '1px solid #BAE6FD',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <Typography variant="h6" sx={{ color: '#0369A1', fontWeight: 'bold', mb: 2 }}>
                Fecha y Hora
              </Typography>
              <Typography variant="body1" sx={{ mb: 1, color: '#1E293B' }}>
                <strong>Fecha:</strong> <span style={{ color: '#0EA5E9', fontWeight: 'bold' }}>{bookingDate ? bookingDate.toLocaleDateString('es-CL') : ''}</span>
              </Typography>
              <Typography variant="body1" sx={{ color: '#1E293B' }}>
                <strong>Hora:</strong> <span style={{ color: '#0EA5E9', fontWeight: 'bold' }}>{bookingTime ? bookingTime.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }) : ''}</span>
              </Typography>
            </Box>

            <Box sx={{ 
              p: 3, 
              bgcolor: 'white', 
              borderRadius: 2, 
              border: '1px solid #BAE6FD',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <Typography variant="h6" sx={{ color: '#0369A1', fontWeight: 'bold', mb: 2 }}>
                Datos de los Integrantes
              </Typography>
              <TableContainer 
                component={Paper} 
                sx={{ 
                  mt: 2,
                  borderRadius: 2,
                  border: '1px solid #E2E8F0',
                  overflow: 'hidden'
                }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)' }}>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>RUT</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {people.map((person) => (
                        <TableRow 
                          key={person.rut}
                          sx={{ 
                            '&:nth-of-type(odd)': { 
                              backgroundColor: '#F8FAFC' 
                            },
                            '&:hover': {
                              backgroundColor: '#E0F2FE'
                            }
                          }}
                        >
                          <TableCell sx={{ color: '#1E293B', fontWeight: 500 }}>{person.rut}</TableCell>
                          <TableCell sx={{ color: '#1E293B', fontWeight: 500 }}>{`${person.name} ${person.lastName}`}</TableCell>
                          <TableCell sx={{ color: '#1E293B', fontWeight: 500 }}>{person.email}</TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

  // Función para renderizar el contenido de cada paso
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <ActivityDetailsSection
            lapsOrMaxTime={lapsOrMaxTime}
            numOfPeople={numOfPeople}
            onLapsChange={handleLapsOrMaxTimeChange}
            onPeopleChange={handleNumOfPeopleChange}
            lapsError={lapsError}
            peopleError={peopleError}
          />
        );
      case 1:
        return (
          <DateTimeSection
            bookingDate={bookingDate}
            bookingTime={bookingTime}
            bookingTimeEnd={calculateBookingTimeEnd(bookingTime, lapsOrMaxTime)}
            onDateChange={handleDateChange}
            onTimeChange={handleTimeChange}
            shouldDisableTime={shouldDisableTime}
            dateError={dateError}
            timeError={timeError}
            loadingTimes={loadingTimes}
            isHoliday={isHoliday}
          />
        );
      case 2:
        return (
          <ParticipantsSection
            person={person}
            people={people}
            numOfPeople={numOfPeople}
            onPersonChange={setPerson}
            onAddPerson={addPerson}
            onRemovePerson={removePerson}
            rutError={rutError}
            nameError={nameError}
            lastNameError={lastNameError}
            emailError={emailError}
          />
        );
      case 3:
        return renderBookingSummary();
      default:
        return null;
    }
  };

  // Función para renderizar los botones de navegación
  const renderNavigationButtons = () => {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          variant="outlined"
          onClick={prevStep}
          disabled={activeStep === 0}
          sx={{ 
            minWidth: 120,
            borderColor: '#5B21B6',
            color: '#5B21B6',
            fontWeight: 'bold',
            '&:hover': {
              borderColor: '#2E1065',
              color: '#2E1065',
              backgroundColor: '#F3E8FF'
            },
            '&:disabled': {
              borderColor: '#E2E8F0',
              color: '#94A3B8'
            }
          }}
        >
          Anterior
        </Button>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          {activeStep < 3 && (
            <Button
              variant="contained"
              onClick={nextStep}
              disabled={!canProceedToNextStep()}
              sx={{ 
                minWidth: 120,
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
              Siguiente
            </Button>
          )}
          
          {activeStep === 3 && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={isLoading}
              sx={{ 
                minWidth: 160,
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                fontWeight: 'bold',
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
              {isLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  Procesando pago...
                </Box>
              ) : (
                'Pagar reserva'
              )}
            </Button>
          )}
        </Box>
      </Box>
    );
  };

  // Funciones de validación
  const validateRUT = (rut) => {
    // Eliminar espacios y convertir a mayúsculas
    let cleanRut = rut.replace(/\s/g, '').replace(/\./g, '').toUpperCase();
    
    // Si no tiene guión, agregarlo automáticamente
    if (!cleanRut.includes('-') && cleanRut.length >= 8) {
      cleanRut = cleanRut.slice(0, -1) + '-' + cleanRut.slice(-1);
    }
    
    // Verificar formato básico
    const rutRegex = /^\d{7,8}-[\dK]$/;
    if (!rutRegex.test(cleanRut)) {
      return { isValid: false, formattedRut: cleanRut, error: 'RUT debe tener formato 12345678-9' };
    }
    
    // Validar dígito verificador
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
    
    if (dv !== calculatedDV) {
      return { isValid: false, formattedRut: cleanRut, error: 'RUT no es válido' };
    }
    
    return { isValid: true, formattedRut: cleanRut, error: '' };
  };

  const validateName = (name) => {
    if (!name || name.trim().length === 0) {
      return { isValid: false, error: 'Nombre es requerido' };
    }
    
    // No debe contener números ni caracteres especiales
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!nameRegex.test(name)) {
      return { isValid: false, error: 'Nombre solo debe contener letras' };
    }
    
    if (name.trim().length < 2) {
      return { isValid: false, error: 'Nombre debe tener al menos 2 caracteres' };
    }
    
    return { isValid: true, error: '' };
  };

  const validateLastName = (lastName) => {
    if (!lastName || lastName.trim().length === 0) {
      return { isValid: false, error: 'Apellido es requerido' };
    }
    
    // No debe contener números ni caracteres especiales
    const lastNameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!lastNameRegex.test(lastName)) {
      return { isValid: false, error: 'Apellido solo debe contener letras' };
    }
    
    if (lastName.trim().length < 2) {
      return { isValid: false, error: 'Apellido debe tener al menos 2 caracteres' };
    }
    
    return { isValid: true, error: '' };
  };

  const validateEmail = (email) => {
    if (!email || email.trim().length === 0) {
      return { isValid: false, error: 'Email es requerido' };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Email no tiene formato válido' };
    }
    
    return { isValid: true, error: '' };
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Paper 
            elevation={8} 
            sx={{ 
              p: 4,
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

          {/* Indicador de progreso */}
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h5" 
              component="h2" 
              gutterBottom 
              sx={{ 
                textAlign: 'center',
                fontWeight: 'bold',
                color: '#5B21B6',
                mb: 3
              }}
            >
              Reserva tu kart
            </Typography>
            
            <Stepper 
              activeStep={activeStep} 
              sx={{ 
                mb: 3,
                '& .MuiStepLabel-root': {
                  cursor: 'default'
                },
                '& .MuiStepIcon-root': {
                  color: '#E2E8F0',
                  '&.Mui-active': {
                    color: '#5B21B6'
                  },
                  '&.Mui-completed': {
                    color: '#10B981'
                  }
                },
                '& .MuiStepConnector-line': {
                  borderColor: '#E2E8F0'
                },
                '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
                  borderColor: '#5B21B6'
                },
                '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
                  borderColor: '#10B981'
                }
              }}
            >
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel 
                    icon={activeStep > index ? <CheckCircleIcon color="success" /> : undefined}
                    sx={{
                      '& .MuiStepLabel-label': {
                        fontSize: { sm: '0.875rem' },
                        fontWeight: activeStep === index ? 600 : 400,
                        color: activeStep === index ? 'primary.main' : 'text.secondary'
                      }
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            
            {/* Indicador de progreso visual */}
            <Box sx={{ mt: 3, px: 2 }}>
              <Box 
                sx={{ 
                  width: '100%', 
                  height: 6, 
                  backgroundColor: '#E2E8F0', 
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <Box 
                  sx={{ 
                    width: `${(activeStep / (steps.length - 1)) * 100}%`, 
                    height: '100%', 
                    background: 'linear-gradient(90deg, #5B21B6 0%, #1E3A8A 100%)',
                    transition: 'width 0.5s ease-in-out',
                    borderRadius: 3,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(90deg, rgba(255,255,255,0.3) 0%, transparent 100%)',
                      borderRadius: 3
                    }
                  }}
                />
              </Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  display: 'block', 
                  textAlign: 'center', 
                  mt: 2, 
                  color: '#5B21B6',
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }}
              >
                Paso {activeStep + 1} de {steps.length}
              </Typography>
            </Box>
          </Box>

          {generalError && (
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
              icon={<WarningIcon />}
            >
              {generalError}
            </Alert>
          )}

          {/* Indicador de carga para horarios */}
          {loadingTimes && (
            <Alert 
              severity="info" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                border: '2px solid #8B5CF6',
                background: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)',
                '& .MuiAlert-icon': {
                  color: '#8B5CF6'
                },
                '& .MuiAlert-message': {
                  color: '#5B21B6',
                  fontWeight: 500
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CircularProgress size={20} sx={{ color: '#8B5CF6' }} />
                Cargando horarios disponibles...
              </Box>
            </Alert>
          )}

          {/* Contenido del paso actual */}
          <Box 
            sx={{ 
              minHeight: 400,
              background: 'white',
              borderRadius: 2,
              p: 3,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
              border: '1px solid #E2E8F0'
            }}
          >
            {renderStepContent()}
          </Box>

          {/* Botones de navegación */}
          {renderNavigationButtons()}

          {/* Mensajes de estado */}
          {successMessage && (
            <Alert 
              severity="success" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                border: '2px solid #10B981',
                background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
                '& .MuiAlert-icon': {
                  color: '#10B981'
                },
                '& .MuiAlert-message': {
                  color: '#065F46',
                  fontWeight: 500
                }
              }}
              icon={<CheckCircleIcon />}
            >
              {successMessage}
            </Alert>
          )}

          {/* Help Section */}
          <Box sx={{ mt: 6, textAlign: 'center', p: 3, bgcolor: 'white', borderRadius: 2, border: '1px solid #E2E8F0' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              ¿Preguntas? Contacta con nosotros: unique.bussiness@gmail.com
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
    </LocalizationProvider>
  );
};

export default KartBookingForm;