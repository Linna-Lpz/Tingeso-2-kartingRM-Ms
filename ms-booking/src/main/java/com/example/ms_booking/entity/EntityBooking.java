package com.example.ms_booking.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "booking")
public class EntityBooking {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;

    @Column(name = "booking_date")
    private LocalDate bookingDate; // DD-MM-YYYY
    @Column(name = "booking_time")
    private LocalTime bookingTime; // HH:MM
    @Column(name = "booking_time_end")
    private LocalTime bookingTimeEnd; // HH:MM Tiempo total duración reserva

    private String bookingStatus; // Estado de la reserva (confirmada, sin confirmar, cancelada)

    private Integer lapsOrMaxTimeAllowed;
    private Integer numOfPeople;
    private String clientsRUT; // Lista con los rut de los clientes
    private String clientsNames; // Lista con los nombres de los clientes
    private String clientsEmails; // Lista con los correos de los clientes

    private String basePrice; // Tarifa base
    private String discounts; // Descuentos aplicados (cumpleaños, integrantes, visitas)
    private String totalPrice; // Tarifa con descuentos aplicados

    private String Iva = "19"; // Porcentaje impuesto
    private String totalWithIva; // Total con impuesto
    private Integer totalAmount; // Suma de los valores por cliente (Precio final)
}
