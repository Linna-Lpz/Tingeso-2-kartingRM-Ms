package com.example.ms_booking.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "client")
public class EntityClient {
    @Id
    private String clientRUT; // 12345678-9
    private String clientName; // Nombre Apellido
    private String clientEmail;
    private String clientBirthday; // DD-MM
    private Integer visitsPerMonth;

}
