import { Typography, Box, Container, Card, CardContent, Grid, Chip} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SportsMotorsportsIcon from '@mui/icons-material/SportsMotorsports';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import InfoIcon from '@mui/icons-material/Info';

const Home = () => {
    const navigate = useNavigate();

    return (
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        {/* Hero Section */}
        <Box 
          sx={{ 
            background: 'linear-gradient(135deg, #2E1065 0%, #5B21B6 50%, #1E3A8A 100%)',
            color: 'white',
            py: 2,
            textAlign: 'center'
          }}
        >
          <Container maxWidth="lg">
            <SportsMotorsportsIcon sx={{ fontSize: 80, mb: 2, color: 'white' }} />
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                mb: 3,
                fontSize: { xs: '2rem', md: '3rem' }
              }}
            >
              ¡Vive la Velocidad!
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 4,
                opacity: 0.9,
                fontSize: { xs: '1.2rem', md: '1.5rem' }
              }}
            >
              Experimenta la emoción del karting con tus amigos y familiares
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: 6 }}>
          {/* Quick Actions Section */}
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h4" 
              component="h2" 
              gutterBottom 
              sx={{ 
                textAlign: 'center',
                fontWeight: 'bold',
                color: '#5B21B6',
                mb: 4
              }}
            >
              ¿Qué deseas hacer?
            </Typography>

            <Grid container spacing={3}>
              {/* Reservar */}
              <Grid item xs={12} md={6}>
                <Card 
                  sx={{ 
                    height: '100%',
                    cursor: 'pointer',
                    border: '2px solid transparent',
                    background: 'linear-gradient(135deg, #E0E7FF 0%, #C7D2FE 100%)',
                    '&:hover': { 
                      boxShadow: 8,
                      transform: 'translateY(-4px)',
                      borderColor: '#5B21B6',
                      background: 'linear-gradient(135deg, #C7D2FE 0%, #A78BFA 100%)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => navigate('/kartBookingForm')}
                >
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <CalendarMonthIcon sx={{ fontSize: 60, color: '#5B21B6', mb: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#5B21B6' }}>
                      Nueva Reserva
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                      Reserva tu experiencia de karting ahora
                    </Typography>
                    <Chip 
                      label="Recomendado" 
                      sx={{ 
                        fontWeight: 'bold',
                        bgcolor: '#D97706',
                        color: 'white',
                        '&:hover': { 
                      boxShadow: 8,
                      transform: 'translateY(-4px)',
                      borderColor: '#5B21B6',
                      background: 'linear-gradient(135deg, #C7D2FE 0%, #A78BFA 100%)'
                    },
                      }}
                      size="small"
                    />
                  </CardContent>
                </Card>
              </Grid>

              {/* Ver Reservas */}
              <Grid item xs={12} md={6}>
                <Card 
                  sx={{ 
                    height: '100%',
                    cursor: 'pointer',
                    border: '2px solid transparent',
                    background: 'linear-gradient(135deg, #E0E7FF 0%, #C7D2FE 100%)',
                    '&:hover': { 
                      boxShadow: 8,
                      transform: 'translateY(-4px)',
                      borderColor: '#5B21B6',
                      background: 'linear-gradient(135deg, #C7D2FE 0%, #A78BFA 100%)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => navigate('/statusKartBooking')}
                >
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Box sx={{ position: 'relative' }}>
                      <CalendarMonthIcon sx={{ fontSize: 60, color: '#5B21B6', mb: 2 }} />
                      <Chip 
                        label="Mis" 
                        size="small" 
                        sx={{ 
                          position: 'absolute', 
                          top: -5, 
                          right: '30%',
                          bgcolor: '#D97706',
                          color: 'white',
                          fontSize: '0.7rem'
                        }} 
                      />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#5B21B6' }}>
                      Ver Mis Reservas
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Consulta y gestiona tus reservas existentes
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* Information Card */}
          <Card 
            sx={{ 
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #F3E8FF 0%, #DDD6FE 100%)',
              border: '2px solid',
              borderColor: '#A78BFA',
              '&:hover': { 
                boxShadow: 8,
                transform: 'translateY(-2px)',
                borderColor: '#5B21B6',
                background: 'linear-gradient(135deg, #EDE9FE 0%, #C4B5FD 100%)'
              },
              transition: 'all 0.3s ease'
            }}
            onClick={() => navigate('/information')}
          >
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <InfoIcon sx={{ fontSize: 60, color: '#5B21B6', mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#5B21B6' }}>
                Tarifas y Horarios
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Consulta aquí nuestros precios, horarios y promociones especiales
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  label="Tarifas" 
                  size="small" 
                  sx={{ 
                    borderColor: '#D97706', 
                    color: '#D97706',
                    '&:hover': { bgcolor: '#FEF3C7' }
                  }}
                  variant="outlined" 
                />
                <Chip 
                  label="Descuentos" 
                  size="small" 
                  sx={{ 
                    borderColor: '#1E3A8A', 
                    color: '#1E3A8A',
                    '&:hover': { bgcolor: '#DBEAFE' }
                  }}
                  variant="outlined" 
                />
                <Chip 
                  label="Horarios" 
                  size="small" 
                  sx={{ 
                    borderColor: '#5B21B6', 
                    color: '#5B21B6',
                    '&:hover': { bgcolor: '#F3E8FF' }
                  }}
                  variant="outlined" 
                />
              </Box>
            </CardContent>
          </Card>

          {/* Help Section */}
          <Box sx={{ mt: 6, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'text.secondary' }}>
              ¿Necesitas ayuda?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Contacta con nosotros: 📞 +56 9 72618375 | 📧 unique.bussiness@gmail.com
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  };
  
  export default Home;