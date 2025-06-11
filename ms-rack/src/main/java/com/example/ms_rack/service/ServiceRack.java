package com.example.ms_rack.service;

import com.example.ms_rack.entity.EntityRack;
import com.example.ms_rack.repository.RepoRack;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class ServiceRack {
    @Autowired
    RepoRack repoRack;

    public void saveRack(Long id, LocalDate bookingDate, LocalTime bookingTime, LocalTime bookingTimeEnd, String bookingStatus, String clientName) {
        EntityRack entityRack = new EntityRack();
        entityRack.setId(id);
        entityRack.setBookingDate(bookingDate);
        entityRack.setBookingTime(bookingTime);
        entityRack.setBookingTimeEnd(bookingTimeEnd);
        entityRack.setBookingStatus(bookingStatus);
        entityRack.setClientName(clientName);
        repoRack.save(entityRack);
    }

    public void deleteRack(Long id) {
        repoRack.deleteById(id);
    }

    public List<EntityRack> getBookingsForRack(String month, String year) {
        return repoRack.findByStatusAndMonthAndYear("confirmada", month, year);
    }
}
