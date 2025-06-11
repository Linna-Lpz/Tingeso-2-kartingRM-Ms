package com.example.ms_rack.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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
@Table(name = "rack")
public class EntityRack {
    @Id
    private Long id;
    private LocalDate bookingDate; // DD-MM-YYYY
    private LocalTime bookingTime; // HH:MM
    private LocalTime bookingTimeEnd; // HH:MM Tiempo total duración reserva
    private String bookingStatus; // Estado de la reserva (confirmada)
    private String clientName; // clientes
}
