package com.example.ms_reports.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EntityBookingDTO {
    private Long id;
    private LocalDate bookingDate;
    private LocalTime bookingTimeEnd;
    private String bookingStatus;
    private Integer lapsOrMaxTimeAllowed;
    private Integer numOfPeople;
    private String basePrice;
}
