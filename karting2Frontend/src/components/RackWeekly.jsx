import React, { useState, useEffect } from 'react';
import { 
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Typography, Box, Alert, IconButton, FormControl,
  Select, MenuItem, Grid
} from '@mui/material';
import { 
  format, startOfWeek, addDays, addWeeks, subWeeks, 
  startOfMonth, getMonth, getYear, setMonth, setYear
} from 'date-fns';
import { es } from 'date-fns/locale';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import bookingService from '../services/services.management';

const RackWeekly = () => {
  // Estados para las fechas y selecciones
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekStart, setWeekStart] = useState(startOfWeek(currentDate, { weekStartsOn: 1 }));
  const [selectedMonth, setSelectedMonth] = useState(getMonth(currentDate));
  const [selectedYear, setSelectedYear] = useState(getYear(currentDate));

  // Estados para los datos
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);

  // Constantes para la interfaz
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const timeBlocks = Array.from({ length: 13 }, (_, i) => `${i + 10}:00`);
  const months = Array.from({ length: 12 }, (_, i) => i);
  const years = Array.from({ length: 5 }, (_, i) => getYear(currentDate) - 2 + i);

  // Obtener reservas del servicio
  const fetchBookings = async () => {
    try {
      // Llama a la función pasando mes y año seleccionados
      const response = await bookingService.getBookingsForRack(selectedMonth + 1, selectedYear);
      console.log("Response from bookingService:", response);
      setBookings(response.data);
      setError(null);
    } catch (err) {
      console.error("Error al obtener las reservas:", err);
      setError("No se pudieron cargar las reservas. Por favor, intente de nuevo más tarde.");
    }
  };

  // Cargar reservas cuando cambia la semana, mes o año
  useEffect(() => {
    fetchBookings();
     
  }, [weekStart, selectedMonth, selectedYear]);

  // Actualizar la semana cuando cambia el mes o año
  useEffect(() => {
    const newDate = setYear(setMonth(currentDate, selectedMonth), selectedYear);
    setCurrentDate(newDate);
    
    // Ir a la primera semana del mes seleccionado
    const firstWeekOfMonth = startOfWeek(startOfMonth(newDate), { weekStartsOn: 1 });
    setWeekStart(firstWeekOfMonth);
  }, [selectedMonth, selectedYear]);

  // Función para ir a la semana anterior
  const goToPreviousWeek = () => {
    const newWeekStart = subWeeks(weekStart, 1);
    setWeekStart(newWeekStart);
    
    // Actualizar mes y año si cambian
    setSelectedMonth(getMonth(newWeekStart));
    setSelectedYear(getYear(newWeekStart));
  };

  // Función para ir a la semana siguiente
  const goToNextWeek = () => {
    const newWeekStart = addWeeks(weekStart, 1);
    setWeekStart(newWeekStart);
    
    // Actualizar mes y año si cambian
    setSelectedMonth(getMonth(newWeekStart));
    setSelectedYear(getYear(newWeekStart));
  };

  // Filtrar reservas por día y hora
  const getBookingsForTimeSlot = (day, timeBlock) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const hour = parseInt(timeBlock.split(':')[0]);
    
    return bookings.filter(booking => {
      if (booking.bookingDate !== dateStr) return false;
      
      const bookingTimeStr = booking.bookingTime;
      if (!bookingTimeStr) return false;
      
      const bookingHour = parseInt(bookingTimeStr.split(':')[0]);
      return bookingHour === hour;
    });
  };

  // Extraer el nombre del cliente
  const getClientName = (booking) => {
    if (booking.clientName && booking.clientName.length > 0) {
      return booking.clientName;
    }
    return 'Sin nombre';
  };

  // Manejo de cambios en mes y año
  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  // Mostrar si hay error
  if (error) {
    return (
      <Paper elevation={8} sx={{ p: 3, m: 2, borderRadius: 3, background: 'linear-gradient(135deg, #FEF3C7 0%, #FBBF24 100%)', border: '2px solid #D97706' }}>
        <Alert 
          severity="error" 
          sx={{ 
            borderRadius: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '2px solid #EF4444',
            '& .MuiAlert-icon': {
              fontSize: '1.5rem',
              color: '#DC2626'
            }
          }}
        >
          <Typography variant="h6" sx={{ mb: 1, color: '#DC2626', fontWeight: 'bold' }}>
            ⚠️ Error de Conexión
          </Typography>
          <Typography variant="body1" sx={{ color: '#7F1D1D' }}>
            {error}
          </Typography>
        </Alert>
      </Paper>
    );
  }

  return (
    <Paper 
      elevation={8}
      sx={{ 
        width: '100%', 
        overflow: 'hidden',
        borderRadius: 3,
        border: '2px solid',
        borderColor: '#A78BFA',
        background: 'linear-gradient(135deg, #F3E8FF 0%, #DDD6FE 100%)'
      }}
    >
      {/* Cabecera con controles de navegación */}
      <Box 
        sx={{ 
          p: 3, 
          background: 'linear-gradient(135deg, #2E1065 0%, #5B21B6 50%, #1E3A8A 100%)',
          color: 'white',
          borderBottom: '2px solid',
          borderBottomColor: '#2E1065'
        }}
      >
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
          <Grid item xs={12} md={6}>
            <Typography 
              variant="h5" 
              fontWeight="bold"
              sx={{ 
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                letterSpacing: 0.5
              }}
            >
              Rack Semanal de Ocupación
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                opacity: 0.9,
                mt: 0.5,
                fontStyle: 'italic'
              }}
            >
              Gestiona y visualiza las reservas de la pista
            </Typography>
          </Grid>
          
          {/* Selector de mes y año */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' }, gap: 2 }}>
              <FormControl 
                size="small"                  sx={{ 
                    minWidth: 140,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      borderRadius: 2,
                      border: '2px solid rgba(255,255,255,0.3)',
                      '&:hover': {
                        backgroundColor: 'white',
                        borderColor: '#A78BFA',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(167, 139, 250, 0.3)'
                      }
                    }
                  }}
                >
                  <Select
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    displayEmpty
                    sx={{
                      borderRadius: 2,
                      fontWeight: 'bold',
                      color: '#5B21B6'
                    }}
                  >
                  {months.map((month) => (
                    <MenuItem key={month} value={month}>
                      {format(new Date(2000, month, 1), 'MMMM', { locale: es })}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl 
                size="small" 
                sx={{ 
                  minWidth: 100,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    borderRadius: 2,
                    border: '2px solid rgba(255,255,255,0.3)',
                    '&:hover': {
                      backgroundColor: 'white',
                      borderColor: '#A78BFA',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(167, 139, 250, 0.3)'
                    }
                  }
                }}
              >
                <Select
                  value={selectedYear}
                  onChange={handleYearChange}
                  displayEmpty
                  sx={{
                    borderRadius: 2,
                    fontWeight: 'bold',
                    color: '#5B21B6'
                  }}
                >
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>{year}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Grid>
        </Grid>
      </Box>
      
      {/* Información de la semana actual con controles de navegación */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          px: 3, 
          py: 2,
          background: 'linear-gradient(135deg, #E0E7FF 0%, #C7D2FE 100%)',
          borderBottom: '2px solid',
          borderBottomColor: '#A78BFA'
        }}
      >
        <IconButton 
          onClick={goToPreviousWeek}
          sx={{
            background: ' #5B21B6',
            color: 'white',
            border: '2px solid rgba(255,255,255,0.2)',
            '&:hover': {
              background: ' #5B21B6',
              transform: 'scale(1.1) translateY(-2px)',
              boxShadow: '0 8px 20px rgba(91, 33, 182, 0.4)'
            },
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(91, 33, 182, 0.3)'
          }}
          size="large"
        >
          <ArrowBackIosNewIcon />
        </IconButton>
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography 
            variant="h6" 
            color="text.primary"
            fontWeight="bold"
            sx={{ 
              mb: 0.5,
              color: '#5B21B6',
              textShadow: '1px 1px 2px rgba(91, 33, 182, 0.2)'
            }}
          >
            Semana del {format(weekDays[0], 'dd MMMM', { locale: es })} al {format(weekDays[6], 'dd MMMM', { locale: es })}
          </Typography>
        </Box>
        
        <IconButton 
          onClick={goToNextWeek}
          sx={{
            background: ' #5B21B6',
            color: 'white',
            border: '2px solid rgba(255,255,255,0.2)',
            '&:hover': {
              background: ' #5B21B6',
              transform: 'scale(1.1) translateY(-2px)',
              boxShadow: '0 8px 20px rgba(91, 33, 182, 0.4)'
            },
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(91, 33, 182, 0.3)'
          }}
          size="large"
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
      
      {/* Tabla con las reservas */}
      <TableContainer sx={{ maxHeight: 650, backgroundColor: 'rgba(255,255,255,0.95)' }}>
        <Table stickyHeader aria-label="rack de reservas">
          <TableHead>
            <TableRow>
              <TableCell 
                sx={{ 
                  width: '100px', 
                  background: ' #5B21B6',
                  color: 'white',
                  borderRight: '2px solid',
                  borderRightColor: '#2E1065',
                  boxShadow: '2px 0 8px rgba(91, 33, 182, 0.3)'
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold" sx={{ textAlign: 'center' }}>
                  Hora
                </Typography>
              </TableCell>
              
              {weekDays.map((day, index) => (
                <TableCell 
                  key={day.toString()} 
                  align="center" 
                  sx={{ 
                    width: '130px', 
                    background: ' #5B21B6',
                    color: 'white',
                    borderRight: index < weekDays.length - 1 ? '2px solid rgba(255,255,255,0.2)' : 'none',
                    boxShadow: index % 2 === 0 ? '0 2px 8px rgba(91, 33, 182, 0.3)' : '0 2px 8px rgba(46, 16, 101, 0.3)'
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ textTransform: 'capitalize', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                    {format(day, 'EEEE', { locale: es })}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.95, fontWeight: 'medium' }}>
                    {format(day, 'dd/MM')}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          
          <TableBody>
            {timeBlocks.map((timeBlock) => (
              <TableRow 
                key={timeBlock}
              >
                <TableCell 
                  sx={{ 
                    background: ' #5B21B6',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    position: 'sticky',
                    left: 0,
                    borderRight: '2px solid',
                    borderRightColor: '#2E1065',
                    zIndex: 1,
                    textAlign: 'center',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                    boxShadow: '2px 0 8px rgba(91, 33, 182, 0.3)'
                  }}
                >
                  {timeBlock}
                </TableCell>
                
                {weekDays.map((day, colIndex) => {
                  const slotBookings = getBookingsForTimeSlot(day, timeBlock);
                  return (
                    <TableCell 
                      key={`${day.toString()}-${timeBlock}`} 
                      align="left" 
                      sx={{ 
                        verticalAlign: 'top',
                        height: '90px',
                        padding: 1.5,
                        border: '2px solid',
                        borderColor: '#C7D2FE',
                        backgroundColor: colIndex % 2 === 0 ? 'rgba(231, 229, 254, 0.3)' : 'rgba(255,255,255,0.8)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {slotBookings.length === 0 ? (
                        <Box 
                          sx={{ 
                            height: '100%', 
                            minHeight: '70px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#A78BFA',
                            fontStyle: 'italic',
                            backgroundColor: 'rgba(243, 232, 255, 0.3)',
                            borderRadius: 2,
                            border: '2px dashed',
                            borderColor: '#C7D2FE'
                          }}
                        >
                          <Typography variant="body2" sx={{ opacity: 0.8, fontWeight: 'medium' }}>
                            Disponible
                          </Typography>
                        </Box>
                      ) : (
                        slotBookings.map((booking, bookingIndex) => (
                          <Box 
                            key={booking.id} 
                            sx={{ 
                              p: 1.5, 
                              borderRadius: 2, 
                              background: 'rgb(148, 88, 245)',
                              color: 'white',
                              mb: bookingIndex < slotBookings.length - 1 ? 1 : 0,
                              fontSize: '0.85rem',
                              border: '2px solid',
                              position: 'relative'
                            }}
                          >
                            <Typography 
                              variant="body2" 
                              fontWeight="bold" 
                              sx={{ 
                                fontSize: '0.85rem',
                                textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                                mb: 0.5
                              }}
                            >
                              {getClientName(booking)}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontSize: '0.8rem',
                                opacity: 0.95,
                                fontWeight: 'medium'
                              }}
                            >
                              {booking.bookingTime} - {booking.bookingTimeEnd}
                            </Typography>
                          </Box>
                        ))
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default RackWeekly;