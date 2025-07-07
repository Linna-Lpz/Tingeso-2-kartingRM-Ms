import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Grid, TextField, IconButton, Paper, List, ListItem, ListItemText, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
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
  emailError
}) => {
  return (
    <>
      <Typography variant="h6" gutterBottom>Ingresa los datos de cada integrante</Typography>
      <Typography variant="subtitle1" gutterBottom color='textPrimary'>
        ¡Ingresa primero a quien realiza la reserva!
      </Typography>
      
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
        <Grid>
          <TextField
            fullWidth
            label="RUT"
            placeholder="Formato 12345678-9"
            value={person.rut}
            onChange={(e) => onPersonChange({ ...person, rut: e.target.value })}
            error={!!rutError}
          />
        </Grid>
        <Grid>
          <TextField
            fullWidth
            label="Nombre y Apellido"
            placeholder="Ej: Juan Pérez"
            value={person.name}
            onChange={(e) => onPersonChange({ ...person, name: e.target.value })}
            error={!!nameError}
          />
        </Grid>
        <Grid>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={person.email}
            onChange={(e) => onPersonChange({ ...person, email: e.target.value })}
            error={!!emailError}
          />
        </Grid>
        <Grid sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton 
            color="primary" 
            onClick={onAddPerson}
            disabled={people.length >= numOfPeople}
          >
            <AddIcon />
          </IconButton>
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
                      primary={`${p.name} (${p.rut})`}
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
    email: PropTypes.string,
  }).isRequired,
  people: PropTypes.arrayOf(
      PropTypes.shape({
        rut: PropTypes.string,
        name: PropTypes.string,
        email: PropTypes.string,
      })
  ).isRequired,
  numOfPeople: PropTypes.number.isRequired,
  onPersonChange: PropTypes.func.isRequired,
  onAddPerson: PropTypes.func.isRequired,
  onRemovePerson: PropTypes.func.isRequired,
  rutError: PropTypes.string,
  nameError: PropTypes.string,
  emailError: PropTypes.string,
};
export default ParticipantsSection;