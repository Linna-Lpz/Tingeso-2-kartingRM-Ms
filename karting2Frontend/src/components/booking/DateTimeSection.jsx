import React from 'react';
import { Typography, Grid, Paper, Alert } from '@mui/material';
import { DateCalendar, DigitalClock } from '@mui/x-date-pickers';

const DateTimeSection = ({ 
  bookingDate, 
  bookingTime, 
  onDateChange, 
  onTimeChange, 
  shouldDisableTime, 
  dateError, 
  timeError 
}) => {
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
        <Grid>
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
        <Grid>
          <Paper sx={{ p: 2, minWidth: 280 }}>
            <Typography variant="subtitle1" gutterBottom>
              Horarios disponibles
            </Typography>
            <DigitalClock
              value={bookingTime}
              onChange={onTimeChange}
              disabled={!bookingDate}
              shouldDisableTime={shouldDisableTime}
              skipDisabled
              ampm={false}
              timeStep={1}
            />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default DateTimeSection;