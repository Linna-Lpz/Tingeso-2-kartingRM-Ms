import { Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    return (
      <div>
        <h1>KartingRM: Reserva tu kart!</h1>
        <p style={{ textAlign: 'center' }}>
          Ven con tus amigos y familiares a disfrutar una emocionante experiencia!
        </p>

        {/* Botón para reservar */}
        <Box display="flex" justifyContent="center" my={4}>
          <Button
            variant="contained"
            size="large"
            sx={{ fontSize: 24, px: 6, py: 2 }}
            onClick={() => navigate('/kartBookingForm')}
          >
            ¡Reserva aquí!
          </Button>
        </Box>

        {/* Sección de información de tarifas */}
        <Typography variant="h6" gutterBottom align="center">
            Tarifas
          </Typography>
          
          {/* Tabla de tarifas */}
          <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Número de vueltas o tiempo máximo permitido</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Precios regulares</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align="center">10 vueltas o máx 10 min</TableCell>
                  <TableCell align="center">$15.000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center">15 vueltas o máx 15 min</TableCell>
                  <TableCell align="center">$20.000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center">20 vueltas o máx 20 min</TableCell>
                  <TableCell align="center">$25.000</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
      </div>
    );
  };
  
  export default Home;