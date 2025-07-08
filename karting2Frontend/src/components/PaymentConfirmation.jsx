import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Container,
  Typography,
  Button,
  Paper,
  Box,
  Alert,
  Grid,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Home as HomeIcon,
  Assignment as AssignmentIcon,
  Email as EmailIcon
} from '@mui/icons-material';

// Componente auxiliar para el header
const PaymentHeader = ({ success }) => (
    <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: success
                    ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                    : 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                color: 'white',
                mb: 3,
                boxShadow: success
                    ? '0 8px 25px rgba(16, 185, 129, 0.3)'
                    : '0 8px 25px rgba(239, 68, 68, 0.3)'
            }}
        >
            {success ? (
                <CheckCircleIcon sx={{ fontSize: 40 }} />
            ) : (
                <WarningIcon sx={{ fontSize: 40 }} />
            )}
        </Box>
        <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
                fontWeight: 'bold',
                color: success ? '#065F46' : '#991B1B',
                mb: 2
            }}
        >
            {success ? '¡Pago Exitoso!' : 'Error en el Pago'}
        </Typography>
    </Box>
);

// Componente auxiliar para la información adicional de éxito

const SuccessInfo = ({ hasVoucherError }) => (
    <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid>
            <Card
                sx={{
                    height: '100%',
                    background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
                    border: '2px solid #3B82F6'
                }}
            >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <AssignmentIcon sx={{ fontSize: 40, color: '#3B82F6', mb: 2 }} />
                    <Typography variant="h6" sx={{ color: '#1E3A8A', fontWeight: 'bold', mb: 1 }}>
                        Reserva Confirmada
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#1E40AF' }}>
                        Pago y confirmación de reserva exitosos
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
        <Grid>
            <Card
                sx={{
                    height: '100%',
                    background: hasVoucherError
                        ? 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)'
                        : 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
                    border: `2px solid ${hasVoucherError ? '#F59E0B' : '#10B981'}`
                }}
            >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <EmailIcon sx={{
                        fontSize: 40,
                        color: hasVoucherError ? '#F59E0B' : '#10B981',
                        mb: 2
                    }} />
                    <Typography variant="h6" sx={{
                        color: hasVoucherError ? '#92400E' : '#065F46',
                        fontWeight: 'bold',
                        mb: 1
                    }}>
                        {hasVoucherError ? 'Comprobante Pendiente' : 'Comprobante Enviado'}
                    </Typography>
                    <Typography variant="body2" sx={{
                        color: hasVoucherError ? '#A16207' : '#047857'
                    }}>
                        {hasVoucherError
                            ? 'Revisa tu reserva para obtener el comprobante'
                            : 'Revisa tu email para el comprobante'
                        }
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    </Grid>
);

// Componente auxiliar para los botones de acción
const ActionButtons = ({ onReservations, onHome }) => (
    <Box sx={{ display: 'flex', flexDirection: { sm: 'row' }, gap: 3, justifyContent: 'center' }}>
        <Button
            variant="contained"
            onClick={onReservations}
            startIcon={<AssignmentIcon />}
            sx={{
                minWidth: 200,
                py: 1.5,
                px: 4,
                background: 'linear-gradient(135deg, #5B21B6 0%, #1E3A8A 100%)',
                fontWeight: 'bold',
                fontSize: '1rem',
                borderRadius: 2,
                textTransform: 'none',
                '&:hover': {
                    background: 'linear-gradient(135deg, #2E1065 0%, #1E40AF 100%)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(91, 33, 182, 0.3)'
                },
                transition: 'all 0.3s ease'
            }}
        >
            Ver Mis Reservas
        </Button>
        <Button
            variant="outlined"
            onClick={onHome}
            startIcon={<HomeIcon />}
            sx={{
                minWidth: 200,
                py: 1.5,
                px: 4,
                borderColor: '#5B21B6',
                color: '#5B21B6',
                fontWeight: 'bold',
                fontSize: '1rem',
                borderRadius: 2,
                textTransform: 'none',
                borderWidth: 2,
                '&:hover': {
                    borderColor: '#2E1065',
                    color: '#2E1065',
                    backgroundColor: '#F3E8FF',
                    borderWidth: 2,
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(91, 33, 182, 0.2)'
                },
                transition: 'all 0.3s ease'
            }}
        >
            Volver al Inicio
        </Button>
    </Box>
);

const PaymentConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [paymentData, setPaymentData] = useState(null);

    useEffect(() => {
        if (location.state?.paymentResult) {
            setPaymentData(location.state.paymentResult);
        } else {
            navigate('/');
        }
    }, [location.state, navigate]);

    const handleGoToReservations = () => navigate('/StatusKartBooking');
    const handleGoHome = () => navigate('/');

    if (!paymentData) return null;

    const { success, message, hasVoucherError } = paymentData;

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="md">
                <Paper
                    elevation={8}
                    sx={{
                        p: { sm: 4 },
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
                        border: '2px solid',
                        borderColor: success ? '#10B981' : '#EF4444',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: success
                                ? 'linear-gradient(90deg, #10B981 0%, #059669 100%)'
                                : 'linear-gradient(90deg, #EF4444 0%, #DC2626 100%)'
                        }
                    }}
                >
                    <PaymentHeader success={success} />

                    <Alert
                        severity={success ? "success" : "error"}
                        icon={success ? <CheckCircleIcon /> : <WarningIcon />}
                        sx={{
                            mb: 4,
                            borderRadius: 2,
                            border: `2px solid ${success ? '#10B981' : '#EF4444'}`,
                            background: success
                                ? 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)'
                                : 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)',
                            '& .MuiAlert-icon': {
                                color: success ? '#10B981' : '#EF4444'
                            },
                            '& .MuiAlert-message': {
                                color: success ? '#065F46' : '#991B1B',
                                fontWeight: 500,
                                fontSize: '1.1rem'
                            }
                        }}
                    >
                        {message}
                    </Alert>

                    {success && <SuccessInfo hasVoucherError={hasVoucherError} />}

                    <Divider sx={{ my: 4, backgroundColor: '#E2E8F0' }} />

                    <ActionButtons onReservations={handleGoToReservations} onHome={handleGoHome} />

                    <Box 
                      sx={{
                        mt: 6,
                        textAlign: 'center',
                        p: 3,
                        bgcolor: 'white',
                        borderRadius: 2,
                        border: '1px solid #E2E8F0'
                      }}
                    >
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        ¿Preguntas? Contacta con nosotros: unique.bussiness@gmail.com
                      </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

ActionButtons.propTypes = {
    onReservations: PropTypes.func.isRequired,
    onHome: PropTypes.func.isRequired
};

PaymentHeader.propTypes = {
    success: PropTypes.bool.isRequired
};

SuccessInfo.propTypes = {
    hasVoucherError: PropTypes.bool
};

ActionButtons.propTypes = {
    onReservations: PropTypes.func.isRequired,
    onHome: PropTypes.func.isRequired
};
export default PaymentConfirmation;
