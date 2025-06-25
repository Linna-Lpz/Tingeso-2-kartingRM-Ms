import { Typography, Button, Box, Container, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import BarChartIcon from '@mui/icons-material/BarChart';

const Home = () => {
    const navigate = useNavigate();

    return (
      <div>
        {/* Header section */}
        <h1 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem', padding: '30px', color: '#1976d2' }}>
          Bienvenido a Karting RM
        </h1>
        <p>¡Ven con tus amigos y familiares a disfrutar de una emocionante experiencia!</p>
        <Container maxWidth="md" sx={{ py: 4 }}>
          {/* Main reserve button */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/kartBookingForm')}
              sx={{
                fontSize: '24px',
                px: 8,
                py: 3,
                borderRadius: '50px',
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#1565c0',
                }
              }}
            >
              RESERVA AQUÍ
            </Button>
          </Box>

          {/* Bottom navigation cards */}
          <Box 
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: 3,
              mt: 4 
            }}
          >
            {/* Reservas semanales */}
            <Card 
              sx={{ 
                cursor: 'pointer',
                '&:hover': { 
                  boxShadow: 6,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease'
                }
              }}
              onClick={() => navigate('/RackWeekly')}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <EventOutlinedIcon sx={{ fontSize: 60, color: '#1976d2', mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Planifica tu visita
                </Typography>
                <Typography variant="h6" sx={{ mt: 1 }}>
                  Reservas semanales
                </Typography>
              </CardContent>
            </Card>

            {/* Registro de usuario */}
            <Card 
              sx={{ 
                cursor: 'pointer',
                '&:hover': { 
                  boxShadow: 6,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease'
                }
              }}
              onClick={() => navigate('/clientRegister')}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <PersonAddAltOutlinedIcon sx={{ fontSize: 60, color: '#1976d2', mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Regístrate y obtén descuentos
                </Typography>
                <Typography variant="h6" sx={{ mt: 1 }}>
                  Registro de usuario
                </Typography>
              </CardContent>
            </Card>

            {/* Reportes */}
            <Card 
              sx={{ 
                cursor: 'pointer',
                '&:hover': { 
                  boxShadow: 6,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease'
                }
              }}
              onClick={() => navigate('/Reports')}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <BarChartIcon sx={{ fontSize: 60, color: '#1976d2', mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Información para empresas
                </Typography>
                <Typography variant="h6" sx={{ mt: 1 }}>
                  Reportes de venta
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </div>
    );
  };
  
  export default Home;