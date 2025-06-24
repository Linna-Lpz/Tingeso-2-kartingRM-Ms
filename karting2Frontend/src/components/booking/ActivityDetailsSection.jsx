import React from 'react';
import { Typography, Grid, FormControl, InputLabel, Select, MenuItem, TextField, Alert } from '@mui/material';

const ActivityDetailsSection = ({ 
  lapsOrMaxTime, 
  numOfPeople, 
  onLapsChange, 
  onPeopleChange, 
  lapsError, 
  peopleError 
}) => {
  return (
    <>
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
              onChange={(e) => onLapsChange(e.target.value)}
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
            onChange={(e) => onPeopleChange(parseInt(e.target.value))}
            slotProps={{min: 1, max: 15}}
            error={!!peopleError}
            sx={{ minWidth: 200 }}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default ActivityDetailsSection;