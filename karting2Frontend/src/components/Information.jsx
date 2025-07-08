import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  Button,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  Groups as GroupsIcon,
  Star as StarIcon,
  AttachMoney as AttachMoneyIcon,
  Cake as CakeIcon,
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon,
  BookOnline as BookOnlineIcon,
  Assignment as AssignmentIcon,
  Info as InfoIcon,
  AccessTime as AccessTimeIcon,
  Weekend as WeekendIcon,
  MonetizationOn as MonetizationOnIcon,
  AutoAwesome as AutoAwesomeIcon,
  CardGiftcard as CardGiftcardIcon,
  People as PeopleIcon,
  Grade as GradeIcon,
  TrendingUp as TrendingUpIcon,
  Badge as BadgeIcon,
  CalendarToday as CalendarTodayIcon,
  Block as BlockIcon,
  LightbulbOutlined as LightbulbOutlinedIcon,
  Phone as PhoneIcon,
  SportsMotorsports as SportsMotorsportsIcon,
  EmojiEvents as EmojiEventsIcon,
  Timer as TimerIcon,
  MoneyOff as MoneyOffIcon,
  PersonAdd as PersonAddIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Information = () => {
  const navigate = useNavigate();
  
  // Datos de tarifas
  const tarifas = [
    { vueltas: '10 vueltas o máx 10 min', precio: 15000, duracion: '30 min' },
    { vueltas: '15 vueltas o máx 15 min', precio: 20000, duracion: '35 min' },
    { vueltas: '20 vueltas o máx 20 min', precio: 25000, duracion: '40 min' }
  ];

  // Datos de descuentos por número de personas
  const descuentosPersonas = [
    { personas: '1-2 personas', descuento: '0%' },
    { personas: '3-5 personas', descuento: '10%' },
    { personas: '6-10 personas', descuento: '20%' },
    { personas: '11-15 personas', descuento: '30%' }
  ];

  // Datos de descuentos por frecuencia
  const descuentosFrecuencia = [
    { categoria: 'Muy frecuente', visitas: '7 a MAS veces', descuento: '30%' },
    { categoria: 'Frecuente', visitas: '5 a 6 veces', descuento: '20%' },
    { categoria: 'Regular', visitas: '2 a 4 veces', descuento: '10%' },
    { categoria: 'No frecuente', visitas: '0 a 1 vez', descuento: '0%' }
  ];

  // Datos de descuentos de cumpleaños
  const descuentosCumpleanos = [
    { 
      grupoSize: '3-5 personas', 
      personasDescuento: '1 persona', 
      descuento: '50%',
      descripcion: 'Una persona cumpleañera con 50% de descuento'
    },
    { 
      grupoSize: '6-10 personas', 
      personasDescuento: 'Hasta 2 personas', 
      descuento: '50%',
      descripcion: 'Hasta dos personas cumpleañeras con 50% de descuento'
    }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, mx: 'auto' }}>
      {/* Breadcrumb Navigation */}
      <Breadcrumbs 
        aria-label="breadcrumb" 
        sx={{ mb: 3 }}
        separator={<NavigateNextIcon fontSize="small" />}
      >
        <Link 
          underline="hover" 
          color="inherit" 
          href="#" 
          onClick={() => navigate('/')}
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            '&:hover': { color: '#5B21B6' }
          }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Inicio
        </Link>
        <Typography color="#5B21B6" sx={{ fontWeight: 'medium' }}>
          Tarifas y Horarios
        </Typography>
      </Breadcrumbs>

      {/* Header Principal */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
          <AssignmentIcon sx={{ fontSize: 48, color: '#5B21B6', mr: 1 }} />
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', color: '#5B21B6' }}>
            Tarifas y Horarios
          </Typography>
        </Box>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Información completa sobre precios y beneficios
        </Typography>
        
        {/* Quick Action Button */}
        <Button
          variant="contained"
          size="large"
          startIcon={<BookOnlineIcon />}
          onClick={() => navigate('/kartBookingForm')}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: '25px',
            fontWeight: 'bold',
            background: ' #F59E0B',
            boxShadow: 3,
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 6,
              background: ' #D97706'
            },
            transition: 'all 0.3s ease'
          }}
        >
          ¡Reservar Ahora!
        </Button>
      </Box>

      {/* Sección de Horarios */}
      <Card sx={{ mb: 4, elevation: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <AccessTimeIcon sx={{ mr: 1, color: '#1E3A8A', fontSize: 32 }} />
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: '#1E3A8A' }}>
              Horarios de Atención
            </Typography>
          </Box>
          
          <Grid container spacing={2}>
            <Grid >
              <Alert severity="info" sx={{ height: '100%', bgcolor: '#F3E8FF', border: '1px solid #A78BFA' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ScheduleIcon sx={{ mr: 1, color: '#5B21B6' }} />
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#5B21B6' }}>
                    Lunes a Viernes
                  </Typography>
                </Box>
                <Typography variant="h6" color="#5B21B6">
                  14:00 - 22:00 horas
                </Typography>
              </Alert>
            </Grid>
            <Grid >
              <Alert severity="success" sx={{ height: '100%', bgcolor: '#F3E8FF', border: '1px solid #A78BFA' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <WeekendIcon sx={{ mr: 1, color: '#5B21B6' }} />
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#5B21B6' }}>
                    Sábados, Domingos y Feriados
                  </Typography>
                </Box>
                <Typography variant="h6" color="#5B21B6">
                  10:00 - 22:00 horas
                </Typography>
              </Alert>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Sección de Tarifas */}
      <Card sx={{ mb: 4, elevation: 3,  }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <AttachMoneyIcon sx={{ mr: 1, color: '#5B21B6', fontSize: 32 }} />
            <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', color: '#5B21B6' }}>
              Tarifas Base
            </Typography>
          </Box>
          
          <Alert severity="info" sx={{ mb: 3, borderRadius: 2, bgcolor: '#DBEAFE', border: '1px solid #1E3A8A' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <MonetizationOnIcon sx={{ mr: 1, color: '#1E3A8A' }} />
              <Typography variant="body1" sx={{ fontWeight: 'medium', color: '#1E3A8A' }}>
                Precios sin IVA incluido 
              </Typography>
            </Box>
          </Alert>
          
          <TableContainer 
            component={Paper} 
            elevation={4}
            sx={{ 
              borderRadius: 3,
              overflow: 'hidden',
              border: '2px solid',
              borderColor: '#A78BFA',
              mb: 3
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ 
                  background: '#A78BFA',
                  '& th': { 
                    border: 'none',
                    py: 2.5
                  }
                }}>
                  <TableCell sx={{ 
                    fontWeight: 'bold', 
                    color: 'white', 
                    fontSize: '1rem',
                    textAlign: 'center'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <SportsMotorsportsIcon sx={{ mr: 1 }} />
                      Vueltas / Tiempo Máximo
                    </Box>
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: 'bold', 
                    color: 'white', 
                    fontSize: '1rem',
                    textAlign: 'center'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <AttachMoneyIcon sx={{ mr: 1 }} />
                      Precio Base
                    </Box>
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: 'bold', 
                    color: 'white', 
                    fontSize: '1rem',
                    textAlign: 'center'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <TimerIcon sx={{ mr: 1 }} />
                      Duración Total
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tarifas.map((tarifa, index) => (
                  <TableRow 
                    key={tarifa.vueltas} 
                    sx={{ 
                      backgroundColor: index % 2 === 0 ? 'rgba(30, 58, 138, 0.05)' : 'white',
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    <TableCell sx={{ 
                      fontWeight: 'medium', 
                      fontSize: '1rem',
                      textAlign: 'center',
                      py: 2,
                      borderRight: '1px solid rgba(224, 224, 224, 0.5)'
                    }}>
                      {tarifa.vueltas}
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 'bold', 
                      color: '#D97706', 
                      fontSize: '1.3rem',
                      textAlign: 'center',
                      py: 2,
                      borderRight: '1px solid rgba(224, 224, 224, 0.5)'
                    }}>
                      <Box sx={{ 
                        borderRadius: 2,
                        py: 1,
                        px: 2,
                        display: 'inline-block'
                      }}>
                        {formatPrice(tarifa.precio)}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 'medium',
                      fontSize: '1rem',
                      textAlign: 'center',
                      py: 2,
                      color: 'text.secondary'
                    }}>
                      {tarifa.duracion}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Nota informativa */}
          <Box sx={{ 
            backgroundColor: 'rgba(217, 119, 6, 0.1)', 
            borderRadius: 2, 
            p: 2, 
            border: '1px dashed #D97706',
            textAlign: 'center'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AutoAwesomeIcon sx={{ mr: 1, color: '#B45309' }} />
              <Typography variant="body2" sx={{ fontWeight: 'medium', color: '#B45309' }}>
                Los precios mostrados se ajustarán automáticamente según los descuentos que apliquen (solo para clientes registrados)
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Sección de Beneficios */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ 
        textAlign: 'center', 
        fontWeight: 'bold', 
        color: '#5B21B6',
        mb: 3
      }}>
        Beneficios para Clientes Registrados
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Descuentos por Número de Personas */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ 
            height: '100%', 
            elevation: 4,
            background: 'linear-gradient(135deg, #e8f5e8 0%, #a5d6a7 100%)',
            border: '2px solid',
            borderColor: 'success.light',
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <GroupsIcon sx={{ mr: 1, color: 'success.main', fontSize: 32 }} />
                <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', color: 'success.dark' }}>
                  Descuentos por Grupo
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontStyle: 'italic' }} component="div">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <EmojiEventsIcon sx={{ mr: 1, color: 'success.main' }} />
                  Más amigos, mayor diversión y mejores precios
                </Box>
              </Typography>

              <TableContainer 
                component={Paper} 
                elevation={3}
                sx={{ 
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'success.light'
                }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ 
                      background: 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)',
                      '& th': { border: 'none' }
                    }}>
                      <TableCell sx={{ 
                        fontWeight: 'bold', 
                        color: 'white',
                        textAlign: 'center',
                        py: 1.5
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <PeopleIcon sx={{ mr: 1 }} />
                          Personas
                        </Box>
                      </TableCell>
                      <TableCell sx={{ 
                        fontWeight: 'bold', 
                        color: 'white',
                        textAlign: 'center',
                        py: 1.5
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <CardGiftcardIcon sx={{ mr: 1 }} />
                          Descuento
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {descuentosPersonas.map((descuento, index) => (
                      <TableRow 
                        key={descuento.personas} 
                        sx={{ 
                          backgroundColor: index % 2 === 0 ? 'rgba(76, 175, 80, 0.05)' : 'white'
                        }}
                      >
                        <TableCell sx={{ 
                          textAlign: 'center',
                          fontWeight: 'medium',
                          py: 1.5
                        }}>
                          {descuento.personas}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center', py: 1.5 }}>
                          <Chip
                            label={descuento.descuento}
                            color={descuento.descuento === '0%' ? 'default' : 'success'}
                            size="medium"
                            sx={{ 
                              fontWeight: 'bold',
                              fontSize: '0.9rem',
                              px: 1,
                              ...(descuento.descuento !== '0%' && {
                                background: 'linear-gradient(45deg, #4caf50 30%, #81c784 90%)',
                                color: 'white'
                              })
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Descuentos por Frecuencia */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ 
            height: '100%', 
            elevation: 4,
            background: 'linear-gradient(135deg, #fff3e0 0%, #ffcc80 100%)',
            border: '2px solid',
            borderColor: 'warning.light'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <StarIcon sx={{ mr: 1, color: 'warning.main', fontSize: 32 }} />
                <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', color: 'warning.dark' }}>
                  Clientes VIP
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontStyle: 'italic' }} component="div">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <GradeIcon sx={{ mr: 1, color: 'warning.main' }} />
                  Tu fidelidad tiene recompensa mensual
                </Box>
              </Typography>

              <TableContainer 
                component={Paper} 
                elevation={3}
                sx={{ 
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'warning.light'
                }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ 
                      background: 'linear-gradient(45deg, #ff9800 30%, #ffb74d 90%)',
                      '& th': { border: 'none' }
                    }}>
                      <TableCell sx={{ 
                        fontWeight: 'bold', 
                        color: 'white',
                        textAlign: 'center',
                        py: 1.5
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <EmojiEventsIcon sx={{ mr: 1 }} />
                          Nivel
                        </Box>
                      </TableCell>
                      <TableCell sx={{ 
                        fontWeight: 'bold', 
                        color: 'white',
                        textAlign: 'center',
                        py: 1.5
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <TrendingUpIcon sx={{ mr: 1 }} />
                          Visitas/Mes
                        </Box>
                      </TableCell>
                      <TableCell sx={{ 
                        fontWeight: 'bold', 
                        color: 'white',
                        textAlign: 'center',
                        py: 1.5
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <CardGiftcardIcon sx={{ mr: 1 }} />
                          Beneficio
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {descuentosFrecuencia.map((descuento, index) => (
                      <TableRow 
                        key={descuento.categoria} 
                        sx={{ 
                          backgroundColor: index % 2 === 0 ? 'rgba(255, 152, 0, 0.05)' : 'white'
                        }}
                      >
                        <TableCell sx={{ 
                          fontWeight: 'medium',
                          textAlign: 'center',
                          py: 1.5
                        }}>
                          {descuento.categoria}
                        </TableCell>
                        <TableCell sx={{ 
                          textAlign: 'center',
                          py: 1.5,
                          fontSize: '0.9rem'
                        }}>
                          {descuento.visitas}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center', py: 1.5 }}>
                          <Chip
                            label={descuento.descuento}
                            color={descuento.descuento === '0%' ? 'default' : 'warning'}
                            size="medium"
                            sx={{ 
                              fontWeight: 'bold',
                              fontSize: '0.9rem',
                              px: 1,
                              ...(descuento.descuento !== '0%' && {
                                background: 'linear-gradient(45deg, #ff9800 30%, #ffb74d 90%)',
                                color: 'white'
                              })
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Sección de Descuentos de Cumpleaños */}
      <Card sx={{ 
        mb: 4, 
        elevation: 4,
        background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%)',
        border: '2px solid',
        borderColor: 'error.light'
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <CakeIcon sx={{ mr: 1, color: 'error.main', fontSize: 36 }} />
            <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', color: 'error.main' }}>
              ¡Celebra tu Cumpleaños!
            </Typography>
          </Box>
          
          <Alert 
            severity="success" 
            sx={{ 
              mb: 3, 
              borderRadius: 3,
              background: 'linear-gradient(45deg, #e8f5e8 30%, #c8e6c9 90%)',
              border: '2px solid #4caf50'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <MoneyOffIcon sx={{ mr: 1, color: 'success.dark', fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.dark' }}>
                ¡50% de descuento en tu día especial!
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ color: 'success.dark' }}>
              Si cumples años el día que nos visitas, tienes un descuento súper especial que hará tu celebración aún más memorable.
            </Typography>
          </Alert>

          <Typography variant="h6" sx={{ mb: 3, fontWeight: 'medium', textAlign: 'center', color: 'text.primary' }} component="div">
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AssignmentIcon sx={{ mr: 1, color: 'text.primary' }} />
              Condiciones según el tamaño del grupo:
            </Box>
          </Typography>

          <TableContainer 
            component={Paper} 
            elevation={4}
            sx={{ 
              borderRadius: 3,
              overflow: 'hidden',
              border: '2px solid',
              borderColor: 'error.light',
              mb: 3
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ 
                  background: 'linear-gradient(45deg, #e91e63 30%, #f06292 90%)',
                  '& th': { border: 'none', py: 2.5 }
                }}>
                  <TableCell sx={{ 
                    fontWeight: 'bold', 
                    color: 'white',
                    fontSize: '1rem',
                    textAlign: 'center'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <GroupsIcon sx={{ mr: 1 }} />
                      Tamaño del Grupo
                    </Box>
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: 'bold', 
                    color: 'white',
                    fontSize: '1rem',
                    textAlign: 'center'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <PersonAddIcon sx={{ mr: 1 }} />
                      Personas con Descuento
                    </Box>
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: 'bold', 
                    color: 'white',
                    fontSize: '1rem',
                    textAlign: 'center'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CardGiftcardIcon sx={{ mr: 1 }} />
                      Descuento
                    </Box>
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: 'bold', 
                    color: 'white',
                    fontSize: '1rem',
                    textAlign: 'center'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <InfoIcon sx={{ mr: 1 }} />
                      Detalles
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {descuentosCumpleanos.map((descuento, index) => (
                  <TableRow 
                    key={descuento.grupoSize} 
                    sx={{ 
                      backgroundColor: index % 2 === 0 ? 'rgba(233, 30, 99, 0.05)' : 'white'
                    }}
                  >
                    <TableCell sx={{ 
                      fontWeight: 'bold', 
                      textAlign: 'center',
                      py: 2,
                      fontSize: '1rem',
                      color: 'primary.main'
                    }}>
                      {descuento.grupoSize}
                    </TableCell>
                    <TableCell sx={{ 
                      textAlign: 'center',
                      py: 2,
                      fontWeight: 'medium',
                      fontSize: '1rem'
                    }}>
                      {descuento.personasDescuento}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center', py: 2 }}>
                      <Chip
                        label={descuento.descuento}
                        sx={{ 
                          fontWeight: 'bold',
                          fontSize: '1rem',
                          px: 2,
                          py: 1,
                          background: 'linear-gradient(45deg, #e91e63 30%, #f06292 90%)',
                          color: 'white'
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ 
                      fontSize: '0.95rem',
                      py: 2,
                      fontStyle: 'italic',
                      color: 'text.secondary',
                      textAlign: 'center'
                    }}>
                      {descuento.descripcion}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Alert 
            severity="warning" 
            sx={{ 
              borderRadius: 3,
              background: 'linear-gradient(45deg, #fff3e0 30%, #ffe0b2 90%)',
              border: '2px solid #ff9800'
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'warning.dark', mb: 2 }} component="div">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AssignmentIcon sx={{ mr: 1 }} />
                Requisitos importantes para el descuento:
              </Box>
            </Typography>
            
            <Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BadgeIcon sx={{ color: 'warning.dark' }} />
                  <Typography variant="body1" sx={{ color: 'warning.dark' }}>
                    <strong>Identificación obligatoria:</strong> Presenta tu cédula de identidad
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <GroupsIcon sx={{ color: 'warning.dark' }} />
                  <Typography variant="body1" sx={{ color: 'warning.dark' }}>
                    <strong>Mínimo 3 personas:</strong> El grupo debe tener al menos 3 integrantes
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarTodayIcon sx={{ color: 'warning.dark' }} />
                  <Typography variant="body1" sx={{ color: 'warning.dark' }}>
                    <strong>Solo el día exacto:</strong> Válido únicamente en tu fecha de cumpleaños
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BlockIcon sx={{ color: 'warning.dark' }} />
                  <Typography variant="body1" sx={{ color: 'warning.dark' }}>
                    <strong>No acumulable:</strong> No se combina con otros descuentos (siempre aplicamos el mejor)
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Alert>
        </CardContent>
      </Card>

      {/* Nota importante */}
      <Box sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
            <WarningIcon sx={{ mr: 1, color: 'warning.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Importante - Política de Descuentos
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Los descuentos por número de personas, por frecuencia y por cumpleaños NO son acumulables. 
            Se aplicará automáticamente el descuento más beneficioso para ti. El descuento de cumpleaños 
            siempre tiene prioridad cuando aplica.
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LightbulbOutlinedIcon sx={{ mr: 1, color: 'warning.dark' }} />
            <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'warning.dark' }}>
              <strong>Tip:</strong> Nuestro sistema calculará automáticamente el mejor precio para tu reserva
            </Typography>
          </Box>
      </Box>

      {/* Footer con Call to Action */}
      <Box sx={{ mt: 6, textAlign: 'center', py: 4, bgcolor: 'grey.50', borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <SportsMotorsportsIcon sx={{ mr: 1, color: 'primary.main', fontSize: 32 }} />
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            ¿Listo para la aventura?
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          No esperes más y asegura tu lugar en la pista
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<BookOnlineIcon />}
          onClick={() => navigate('/kartBookingForm')}
          sx={{
            px: 5,
            py: 2,
            borderRadius: '30px',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            background: ' #ff9800',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 6
            },
            transition: 'all 0.3s ease'
          }}
        >
          Hacer Reserva
        </Button>
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            ¿Preguntas? Llámanos al +56 9 72618375
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Information;