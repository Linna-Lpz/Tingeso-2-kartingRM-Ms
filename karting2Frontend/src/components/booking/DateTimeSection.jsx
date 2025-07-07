import React, { useState } from 'react';
import { Typography, Grid, Paper, Alert, Box, Button } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers';
import PropTypes from 'prop-types';

const DateTimeSection = ({ 
  bookingDate, 
  bookingTime, 
  onDateChange, 
  onTimeChange, 
  shouldDisableTime, 
  dateError, 
  timeError,
  isHoliday
}) => {
  const [expandedHour, setExpandedHour] = useState(null);

  // Función para generar las horas disponibles en un bloque (minuto a minuto)
  const getAvailableTimesInHour = (hour) => {
    const times = [];
    for (let minute = 0; minute < 60; minute += 1) {
      const time = new Date(bookingDate);
      time.setHours(hour, minute, 0, 0);
      if (!shouldDisableTime(time)) {
        times.push(time);
      }
    }
    return times;
  };

  // Función para obtener las horas de inicio según el tipo de día
  const getStartHour = () => {
    if (!bookingDate) return 10;
    
    const dayOfWeek = bookingDate.getDay();
    const isWeekendOrHoliday = dayOfWeek === 0 || dayOfWeek === 6 || isHoliday(bookingDate);
    
    return isWeekendOrHoliday ? 10 : 14;
  };

  // Generar bloques horarios
  const generateHourBlocks = () => {
    const startHour = getStartHour();
    const blocks = [];
    
    for (let hour = startHour; hour <= 21; hour++) {
      const availableTimes = getAvailableTimesInHour(hour);
      const hasAvailableTimes = availableTimes.length > 0;
      
      blocks.push({
        hour,
        hasAvailableTimes,
        availableTimes
      });
    }
    
    return blocks;
  };

  const handleHourBlockClick = (hour) => {
    if (expandedHour === hour) {
      setExpandedHour(null);
    } else {
      setExpandedHour(hour);
    }
  };

  const handleTimeSelection = (time) => {
    onTimeChange(time);
    setExpandedHour(null);
  };

  const formatTime = (time) => {
    return time.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const hourBlocks = generateHourBlocks();
  const getButtonTextColor = (block) => {
    if (!block.hasAvailableTimes) return '#9e9e9e';
    if (expandedHour === block.hour) return 'white';
    return 'primary.main';
  };
  const getButtonBgColor = (block) => {
    if (!block.hasAvailableTimes) return '#f5f5f5';
    if (expandedHour === block.hour) return 'primary.main';
    return 'transparent';
  };
  const getButtonHoverBgColor = (block) => {
    if (!block.hasAvailableTimes) return '#f5f5f5';
    if (expandedHour === block.hour) return 'primary.dark';
    return 'primary.light';
  };
  return (
    <>
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
        <Grid item>
          <DateCalendar
            value={bookingDate}
            onChange={onDateChange}
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
        <Grid item>
          <Paper sx={{ p: 2, minWidth: 280, height: 'fit-content' }}>
            <Typography variant="subtitle1" gutterBottom>
              Primero, selecciona un bloque de hora
            </Typography>
            
            {!bookingDate ? (
              <Typography variant="body2" color="text.secondary">
                Selecciona una fecha para ver los horarios disponibles
              </Typography>
            ) : (
              <Box sx={{ width: '100%', maxWidth: 300 }}>
                {/* Mostrar los bloques de horas disponibles */}
                <Grid container spacing={1}>
                  {hourBlocks.map((block) => (
                    <Grid item xs={4} key={block.hour}>
                      <Button
                        fullWidth
                        variant={expandedHour === block.hour ? "contained" : "outlined"}
                        disabled={!block.hasAvailableTimes}
                        onClick={() => handleHourBlockClick(block.hour)}
                        sx={{
                          minHeight: 40,
                          backgroundColor: getButtonBgColor(block),
                          color: getButtonTextColor(block),
                          '&:hover': {
                            backgroundColor: getButtonHoverBgColor(block),
                          },
                          '&.Mui-disabled': {
                            backgroundColor: '#f5f5f5',
                            color: '#9e9e9e',
                          }
                        }}
                      >
                        {`${block.hour.toString().padStart(2, '0')}:00`}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
                {/* Mostrar los horarios disponibles al expandir una hora */}
                {expandedHour !== null && (
                  <Box sx={{ mt: 2, p: 1, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Segundo, selecciona una hora de llegada
                    </Typography>
                    <Grid container spacing={1} sx={{ maxHeight: 200, overflow: 'auto' }}>
                      {hourBlocks.find(b => b.hour === expandedHour)?.availableTimes.map((time) => (
                          <Grid item xs={4} key={time.getTime()}>
                          <Button
                            fullWidth
                            variant={bookingTime && formatTime(bookingTime) === formatTime(time) ? "contained" : "outlined"}
                            size="small"
                            onClick={() => handleTimeSelection(time)}
                            sx={{
                              minHeight: 32,
                              fontSize: '0.75rem',
                              padding: '4px 8px'
                            }}
                          >
                            {formatTime(time)}
                          </Button>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Recuadro para mostrar la fecha y hora seleccionada */}
      <Paper sx={{ p: 2, mb: 2, bgcolor: '#f8f9fa', border: '1px solid #e0e0e0' }}>
        <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
          Resumen de selección
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Fecha seleccionada:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {bookingDate ? 
                bookingDate.toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) : 
                'No seleccionada'
              }
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Hora seleccionada:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {bookingTime ? 
                formatTime(bookingTime) : 
                'No seleccionada'
              }
            </Typography>
          </Grid>
        </Grid>
        
        {bookingDate && bookingTime && (
          <Box sx={{ mt: 2, p: 1, bgcolor: 'success.light', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ color: 'success.dark', fontWeight: 'medium' }}>
              ✓ Fecha y hora confirmadas para tu reserva
            </Typography>
          </Box>
        )}
      </Paper>
    </>
  );
};
DateTimeSection.propTypes = {
  bookingDate: PropTypes.instanceOf(Date),
  bookingTime: PropTypes.instanceOf(Date),
  onDateChange: PropTypes.func.isRequired,
  onTimeChange: PropTypes.func.isRequired,
  shouldDisableTime: PropTypes.func.isRequired,
  dateError: PropTypes.string,
  timeError: PropTypes.string,
  isHoliday: PropTypes.func.isRequired
};
export default DateTimeSection;