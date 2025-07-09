import React from 'react';
import {
  Typography, 
  Grid, 
  TextField, 
  Alert, 
  Box, 
  FormControl, 
  FormControlLabel, 
  Radio, 
  RadioGroup, 
  Paper,
  Chip
} from '@mui/material';

const ActivityDetailsSection = ({ 
  lapsOrMaxTime, 
  numOfPeople, 
  onLapsChange, 
  onPeopleChange, 
  lapsError, 
  peopleError,
  showOnlyPeople = false,
  showOnlyLaps = false
}) => {

  // Definir opciones con precios
  const lapsOptions = [
    { value: 10, label: '10 vueltas / 10 minutos', price: '$15.000' },
    { value: 15, label: '15 vueltas / 15 minutos', price: '$20.000' },
    { value: 20, label: '20 vueltas / 20 minutos', price: '$25.000' }
  ];

  return (
    <Box>
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

        {/* Selector de cantidad de integrantes - solo mostrar si showOnlyPeople es true o si ambos flags son false */}
        {(showOnlyPeople || (!showOnlyPeople && !showOnlyLaps)) && (
          <Grid>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Cantidad de integrantes
              </Typography>
              <TextField
                fullWidth
                type="number"
                value={numOfPeople}
                onChange={(e) => onPeopleChange(parseInt(e.target.value) || 1)}
                slotProps={{ min: 1, max: 15 }}
                error={!!peopleError}
                sx={{ 
                  maxWidth: 100,
                  '& .MuiOutlinedInput-root': {
                    height: 56
                  }
                }}
                placeholder="Seleccione cantidad"
              />
            </Box>
          </Grid>
        )}

        {/* Selector de vueltas con precios - solo mostrar si showOnlyLaps es true o si ambos flags son false */}
        {(showOnlyLaps || (!showOnlyPeople && !showOnlyLaps)) && (
          <Grid>
            <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
              Vueltas o minutos a reservar
            </Typography>
            <FormControl component="fieldset" error={!!lapsError} sx={{ width: '100%' }}>
              <RadioGroup
                value={lapsOrMaxTime}
                onChange={(e) => onLapsChange(parseInt(e.target.value))}
                sx={{ gap: 2 }}
              >
                {lapsOptions.map((option) => (
                  <Paper
                    key={option.value}
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: 'grey.300',
                      borderRadius: 2,
                      backgroundColor: 'background.paper',
                      transition: 'all 0.2s ease-in-out',
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: 'grey.400',
                        boxShadow: 1
                      }
                    }}
                    onClick={() => onLapsChange(option.value)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <FormControlLabel
                        value={option.value}
                        control={<Radio />}
                        label={
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {option.label}
                          </Typography>
                        }
                        sx={{ margin: 0, flexGrow: 1 }}
                      />
                      <Chip
                        label={option.price}
                        color="primary"
                        variant="outlined"
                        sx={{ 
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          minWidth: 80
                        }}
                      />
                    </Box>
                  </Paper>
                ))}
              </RadioGroup>
            </FormControl>
            
            {/* Mensaje informativo que aparece cuando se selecciona una opción */}
            {lapsOrMaxTime && (
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  backgroundColor: '#e3f2fd',
                  border: '1px solid #2196f3',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    color: '#1565c0',
                    '&::before': {
                      marginRight: 1,
                      fontSize: '1.2em'
                    }
                  }}
                >
                  Además consideramos 20 minutos extra para la entrega de equipamiento e instrucciones
                </Typography>
              </Box>
            )}
          </Grid>
        )}
    </Box>
  );
};

import PropTypes from 'prop-types';

ActivityDetailsSection.propTypes = {
  lapsOrMaxTime: PropTypes.number.isRequired,
  numOfPeople: PropTypes.number.isRequired,
  onLapsChange: PropTypes.func.isRequired,
  onPeopleChange: PropTypes.func.isRequired,
  lapsError: PropTypes.string,
  peopleError: PropTypes.string,
  showOnlyPeople: PropTypes.bool,
  showOnlyLaps: PropTypes.bool
};
export default ActivityDetailsSection;