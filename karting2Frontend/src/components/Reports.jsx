import React, { useState } from 'react';
import { 
    Typography, 
    Paper, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow,
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem, 
    Box, 
    Button,
    Container,
    Alert,
    CircularProgress,
    Card,
    CardContent,
    Grid,
    Chip
} from '@mui/material';
import {
    SportsMotorsports as SportsMotorsportsIcon,
    Assessment as AssessmentIcon,
    Search as SearchIcon,
    CalendarMonth as CalendarIcon,
    TrendingUp as TrendingUpIcon,
    Group as GroupIcon,
    Speed as SpeedIcon
} from '@mui/icons-material';
import bookingService from '../services/services.management';

const Reports = () => {
    const [reportData1, setreportData1] = useState({});
    const [reportData2, setreportData2] = useState({});
    const [totalIncomes1, setTotalIncomes1] = useState({});
    const [totalIncomes2, setTotalIncomes2] = useState({});
    const [error, setError] = useState(null);
    const [startMonth, setStartMonth] = useState(1);
    const [endMonth, setEndMonth] = useState(12);
    const [showTables, setShowTables] = useState(false);
    
    // Estados para mejorar UX (Nielsen: Visibilidad del estado del sistema)
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    
    const lapsOrMaxTime = [10, 15 ,20]
    const people = [2, 5, 10, 15];

    // Función mejorada para validar y cargar reportes (Nielsen: Prevención de errores)
    const fetchAllReports = async () => {
        // Validación de entrada (Nielsen: Prevención de errores)
        if (startMonth > endMonth) {
            setError('El mes de inicio debe ser anterior al mes de fin');
            return;
        }
        
        setIsLoading(true);
        setError(null);
        setSuccessMessage('');
        
        try {
            // Cargar reportes en paralelo para mejor rendimiento
            const promises = [
                ...lapsOrMaxTime.map(laps => fetchConfirmedBookings(laps, startMonth, endMonth)),
                ...people.map(p => fetchConfirmedBookingsByPeople(p, startMonth, endMonth))
            ];
            
            await Promise.all(promises);
            
            setShowTables(true);
            setSuccessMessage('Reportes cargados exitosamente');
            
            // Limpiar mensaje de éxito después de 3 segundos
            setTimeout(() => setSuccessMessage(''), 3000);
            
        } catch (error) {
            console.error('Error al cargar reportes:', error);
            setError('Error al cargar los reportes. Por favor, intente nuevamente.');
        } finally {
            setIsLoading(false);
        }
    };

    // Función mejorada para obtener las reservas por mes y número de vueltas (Nielsen: Visibilidad del estado del sistema)
    const fetchConfirmedBookings = async (lapsOrTimeMax, startMonth, endMonth) => {
        try {
            const response = await bookingService.getBookingsForReport1(lapsOrTimeMax, startMonth, endMonth);
            const responseTotalIncomes1 = await bookingService.getIncomesForLapsOfMonth(startMonth, endMonth);
            setreportData1(prev => ({...prev, [lapsOrTimeMax]: response.data})); 
            setTotalIncomes1(responseTotalIncomes1.data);
        } catch (error) {
            console.error('Error en reporte 1:', error);
            throw new Error("No se pudieron cargar las reservas del reporte de vueltas/tiempo. Por favor, intente de nuevo más tarde.");
        }
    };

    // Función mejorada para obtener las reservas por cantidad de integrantes (Nielsen: Visibilidad del estado del sistema)
    const fetchConfirmedBookingsByPeople = async (people, startMonth, endMonth) => {
        try{
            const response2 = await bookingService.getBookingsForReport2(people, startMonth, endMonth);
            const responseTotalIncomes2 = await bookingService.getIncomesForNumOfPeopleOfMonth(startMonth, endMonth);
            setreportData2(prev => ({...prev, [people]: response2.data})); 
            setTotalIncomes2(responseTotalIncomes2.data);
        } catch (error) {
            console.error('Error en reporte 2:', error);
            throw new Error("No se pudieron cargar las reservas del reporte de personas. Por favor, intente de nuevo más tarde.");
        }
    };

    // Nombres de los meses
    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    // Función para limpiar errores (Nielsen: Control y libertad del usuario)
    const clearError = () => {
        setError(null);
    };

    // Calcula el rango de meses a mostrar según selección
    const selectedMonths = monthNames.slice(startMonth - 1, endMonth);

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
            {/* Hero Section */}
            <Box 
                sx={{ 
                    background: 'linear-gradient(135deg, #2E1065 0%, #5B21B6 50%, #1E3A8A 100%)',
                    color: 'white',
                    py: 3,
                    textAlign: 'center'
                }}
            >
                <Container maxWidth="lg">
                    <SportsMotorsportsIcon sx={{ fontSize: 60, mb: 2, color: 'white' }} />
                    <Typography 
                        variant="h3" 
                        component="h1" 
                        gutterBottom 
                        sx={{ 
                            fontWeight: 'bold',
                            mb: 2,
                            fontSize: { xs: '1.8rem', md: '2.5rem' }
                        }}
                    >
                        Reportes de Ventas
                    </Typography>
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            mb: 2,
                            opacity: 0.9,
                            fontSize: { xs: '1rem', md: '1.2rem' }
                        }}
                    >
                        Analice el rendimiento de su negocio con reportes detallados
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="xl" sx={{ py: 4 }}>
                {/* Panel de Control */}
                <Paper 
                    elevation={8} 
                    sx={{ 
                        p: 4, 
                        mb: 4,
                        background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
                        border: '2px solid',
                        borderColor: '#E2E8F0',
                        borderRadius: 3,
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: 'linear-gradient(90deg, #5B21B6 0%, #1E3A8A 100%)'
                        }
                    }}
                >
                    <Typography 
                        variant="h5" 
                        gutterBottom 
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 2,
                            color: '#5B21B6',
                            fontWeight: 'bold',
                            mb: 3
                        }}
                    >
                        <AssessmentIcon sx={{ fontSize: 30, color: '#5B21B6' }} />
                        Configuración del Reporte
                    </Typography>

                    {/* Información contextual (Nielsen: Ayuda y documentación) */}
                    <Alert 
                        severity="info" 
                        sx={{ 
                            mb: 3,
                            borderRadius: 2,
                            border: '2px solid #3B82F6',
                            background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
                            '& .MuiAlert-icon': {
                                color: '#3B82F6'
                            },
                            '& .MuiAlert-message': {
                                color: '#1E3A8A',
                                fontWeight: 500
                            }
                        }}
                    >
                        <Typography variant="body2">
                            <strong>Información:</strong> Seleccione el rango de meses para generar reportes de ingresos por vueltas/tiempo y número de personas.
                        </Typography>
                    </Alert>

                    {/* Selectores de mes mejorados */}
                    <Box sx={{ display: 'flex', gap: 3, mb: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel sx={{ color: '#5B21B6', '&.Mui-focused': { color: '#5B21B6' } }}>
                                <CalendarIcon sx={{ mr: 1, fontSize: 18 }} />
                                Mes inicio
                            </InputLabel>
                            <Select
                                value={startMonth}
                                label="Mes inicio"
                                onChange={(e) => {
                                    setStartMonth(e.target.value);
                                    if (error) clearError();
                                }}
                                sx={{
                                    backgroundColor: 'white',
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#5B21B6'
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#5B21B6'
                                    }
                                }}
                            >
                                {monthNames.map((name, idx) => (
                                    <MenuItem key={name} value={idx+1}>{name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        
                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel sx={{ color: '#5B21B6', '&.Mui-focused': { color: '#5B21B6' } }}>
                                <CalendarIcon sx={{ mr: 1, fontSize: 18 }} />
                                Mes fin
                            </InputLabel>
                            <Select
                                value={endMonth}
                                label="Mes fin"
                                onChange={(e) => {
                                    setEndMonth(e.target.value);
                                    if (error) clearError();
                                }}
                                sx={{
                                    backgroundColor: 'white',
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#5B21B6'
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#5B21B6'
                                    }
                                }}
                            >
                                {monthNames.map((name, idx) => (
                                    <MenuItem key={name} value={idx+1}>{name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        
                        <Button 
                            variant="contained" 
                            onClick={fetchAllReports}
                            disabled={isLoading}
                            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                            sx={{
                                minWidth: 160,
                                height: 56,
                                background: 'linear-gradient(135deg, #5B21B6 0%, #1E3A8A 100%)',
                                fontWeight: 'bold',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #2E1065 0%, #1E40AF 100%)',
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 4px 12px rgba(91, 33, 182, 0.3)'
                                },
                                '&:disabled': {
                                    background: '#E2E8F0',
                                    color: '#94A3B8'
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {isLoading ? 'Generando...' : 'Generar Reportes'}
                        </Button>
                    </Box>

                    {/* Resumen de selección (Nielsen: Visibilidad del estado del sistema) */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                        <Chip 
                            label={`Período: ${monthNames[startMonth-1]} - ${monthNames[endMonth-1]}`}
                            sx={{ 
                                bgcolor: '#E0F2FE', 
                                color: '#0369A1', 
                                fontWeight: 'bold' 
                            }} 
                        />
                        <Chip 
                            label={`${selectedMonths.length} meses seleccionados`}
                            sx={{ 
                                bgcolor: '#F0F9FF', 
                                color: '#0284C7', 
                                fontWeight: 'bold' 
                            }} 
                        />
                    </Box>
                </Paper>

                {/* Mensajes de estado */}
                {error && (
                    <Alert 
                        severity="error" 
                        sx={{ 
                            mb: 3,
                            borderRadius: 2,
                            border: '2px solid #EF4444',
                            background: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)',
                            '& .MuiAlert-icon': {
                                color: '#EF4444'
                            },
                            '& .MuiAlert-message': {
                                color: '#991B1B',
                                fontWeight: 500
                            }
                        }}
                        onClose={clearError}
                    >
                        {error}
                    </Alert>
                )}

                {successMessage && (
                    <Alert 
                        severity="success" 
                        sx={{ 
                            mb: 3,
                            borderRadius: 2,
                            border: '2px solid #10B981',
                            background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
                            '& .MuiAlert-icon': {
                                color: '#10B981'
                            },
                            '& .MuiAlert-message': {
                                color: '#065F46',
                                fontWeight: 500
                            }
                        }}
                    >
                        {successMessage}
                    </Alert>
                )}
                {/* Tablas de reportes - versión sencilla */}
            {showTables && (
                <>
                {/* Reporte de ingresos por número de vueltas o tiempo máximo */}
                <Typography variant="h6" gutterBottom align="center" sx={{ mt: 6 }}>
                    Ingresos por número de vueltas o tiempo máximo
                </Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ mb: 3, width: '100%', overflowX: 'auto' }}>
                    <Table sx={{ minWidth: 800 }}>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Vueltas / Tiempo</TableCell>
                                {selectedMonths.map((month) => (
                                    <TableCell key={month} align="center" sx={{ fontWeight: 'bold' }}>
                                        {month}
                                    </TableCell>
                                ))}
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Total</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {lapsOrMaxTime.map((laps) => {
                                const data = reportData1[laps] || [];
                                // Suma total del rango seleccionado
                                const total = selectedMonths.reduce(
                                    (acc, _, i) => acc + (data[startMonth + i] || 0), 0
                                );
                                return (
                                <TableRow key={laps}>
                                    <TableCell align="center">
                                    {`${laps} vueltas o ${laps} mins`}
                                    </TableCell>
                                    {selectedMonths.map((_, i) => (
                                        <TableCell key={selectedMonths[i]} align="center">
                                            {data[startMonth + i] || 0}
                                        </TableCell>
                                    ))}
                                    <TableCell align="center">
                                        {total}
                                    </TableCell>
                                </TableRow>
                                );
                            })}
                            <TableRow>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Total</TableCell>
                                {selectedMonths.map((month, idx) => (
                                    <TableCell key={month} align="center" sx={{ fontWeight: 'bold' }}>
                                        {Array.isArray(totalIncomes1) ? (totalIncomes1[startMonth + idx - 1] || 0) : 0}
                                    </TableCell>
                                ))}
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                    {Array.isArray(totalIncomes1)
                                        ? selectedMonths.reduce(
                                            (acc, _, idx) => acc + (totalIncomes1[startMonth + idx - 1] || 0), 0
                                        )
                                        : 0}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Reporte de ingresos por número de personas */}
                <Typography variant="h6" gutterBottom align="center" sx={{ mt: 6 }}>
                    Ingresos por número de personas
                </Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ mb: 3, width: '100%', overflowX: 'auto' }}>
                    <Table sx={{ minWidth: 800 }}>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Número de personas</TableCell>
                                {selectedMonths.map((month) => (
                                    <TableCell key={month} align="center" sx={{ fontWeight: 'bold' }}>
                                        {month}
                                    </TableCell>
                                ))}
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Total</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {people.map((people) => {
                                const data = reportData2[people] || [];
                                const getPeopleLabel = (people) => {
                                    if (people === 2) return `1 a ${people} personas`;
                                    if (people === 5) return `3 a ${people} personas`;
                                    return `${people - 4} a ${people} personas`;
                                };
                                return (
                                <TableRow key={people}>
                                    <TableCell align="center">
                                        {getPeopleLabel(people)}
                                    </TableCell>
                                    {selectedMonths.map((_, i) => (
                                        <TableCell key={selectedMonths[i]} align="center">
                                            {data[startMonth + i - 1] || 0}
                                        </TableCell>
                                    ))}
                                    <TableCell align="center">
                                        {data[12] || 0}
                                    </TableCell>
                                </TableRow>
                                );
                            })}
                            <TableRow>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Total</TableCell>
                                {selectedMonths.map((month, idx) => (
                                    <TableCell key={month} align="center" sx={{ fontWeight: 'bold' }}>
                                        {Array.isArray(totalIncomes2) ? (totalIncomes2[startMonth + idx - 1] || 0) : 0}
                                    </TableCell>
                                ))}
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                    {Array.isArray(totalIncomes2) ? (totalIncomes2[11] || 0) : 0}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                </>
            )}

            {/* Estado vacío mejorado */}
            {!showTables && !isLoading && (
                <Paper 
                    elevation={4} 
                    sx={{ 
                        p: 6, 
                        textAlign: 'center', 
                        background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
                        border: '2px solid #E2E8F0',
                        borderRadius: 3,
                        mt: 4
                    }}
                >
                    <AssessmentIcon sx={{ fontSize: 64, color: '#94A3B8', mb: 3 }} />
                    <Typography variant="h5" sx={{ color: '#5B21B6', fontWeight: 'bold', mb: 2 }}>
                        Genere su Reporte
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748B', maxWidth: 400, mx: 'auto' }}>
                        Seleccione el rango de meses y haga clic en "Generar Reportes" para ver los análisis de ventas
                    </Typography>
                </Paper>
            )}

            {/* Help Section */}
            <Box sx={{ mt: 6, textAlign: 'center', p: 3, bgcolor: 'white', borderRadius: 2, border: '1px solid #E2E8F0' }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#5B21B6', fontWeight: 'bold' }}>
                    ¿Necesitas ayuda?
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B' }}>
                    Contacta con nosotros: 📞 +56 9 1234 5678 | 📧 unique.bussiness@gmail.com
                </Typography>
            </Box>
        </Container>
    </Box>
    );
};

export default Reports;