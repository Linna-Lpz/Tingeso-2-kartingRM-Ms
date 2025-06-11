package com.example.ms_rack.controller;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ms_rack.entity.EntityRack;
import com.example.ms_rack.service.ServiceRack;

@RestController
@RequestMapping("/rack")

public class ControlRack {
    @Autowired
    ServiceRack serviceRack;

    @PostMapping("/save/{id}/{bookingDate}/{bookingTime}/{bookingTimeEnd}/{bookingStatus}/{clientName}")
    public void saveRack(@PathVariable Long id,
                         @PathVariable LocalDate bookingDate,
                         @PathVariable LocalTime bookingTime,
                         @PathVariable LocalTime bookingTimeEnd,
                         @PathVariable String bookingStatus,
                         @PathVariable String clientName) {
        serviceRack.saveRack(id, bookingDate, bookingTime, bookingTimeEnd, bookingStatus, clientName);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteRack(@PathVariable Long id) {
        serviceRack.deleteRack(id);
    }

    @GetMapping("/getBookingsForRack/{month}/{year}")
    public ResponseEntity<List<EntityRack>> getBookingsForRack(@PathVariable String month, @PathVariable String year){
        List<EntityRack> bookings = serviceRack.getBookingsForRack(month, year);
        return ResponseEntity.ok(bookings);
    }
}

