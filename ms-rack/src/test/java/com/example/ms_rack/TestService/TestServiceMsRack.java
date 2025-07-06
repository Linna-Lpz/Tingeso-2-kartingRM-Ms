package com.example.ms_rack.TestService;

import com.example.ms_rack.entity.EntityRack;
import com.example.ms_rack.repository.RepoRack;
import com.example.ms_rack.service.ServiceRack;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class TestServiceMsRack {

    RepoRack repoRack = mock(RepoRack.class);
    ServiceRack serviceRack = new ServiceRack(repoRack);

    @Test
    void whenSaveRack_thenEntitySaved() {
        // Given
        Long id = 1L;
        LocalDate bookingDate = LocalDate.of(2024, 6, 10);
        LocalTime bookingTime = LocalTime.of(10, 0);
        LocalTime bookingTimeEnd = LocalTime.of(11, 0);
        String bookingStatus = "confirmada";
        String clientName = "Juan";

        // When
        serviceRack.saveRack(id, bookingDate, bookingTime, bookingTimeEnd, bookingStatus, clientName);

        // Then
        ArgumentCaptor<EntityRack> captor = ArgumentCaptor.forClass(EntityRack.class);
        verify(repoRack).save(captor.capture());
        EntityRack saved = captor.getValue();
        assertThat(saved.getId()).isEqualTo(id);
        assertThat(saved.getBookingDate()).isEqualTo(bookingDate);
        assertThat(saved.getBookingTime()).isEqualTo(bookingTime);
        assertThat(saved.getBookingTimeEnd()).isEqualTo(bookingTimeEnd);
        assertThat(saved.getBookingStatus()).isEqualTo(bookingStatus);
        assertThat(saved.getClientName()).isEqualTo(clientName);
    }

    @Test
    void whenDeleteRack_thenRepositoryCalled() {
        // Given
        Long id = 2L;

        // When
        serviceRack.deleteRack(id);

        // Then
        verify(repoRack).deleteById(id);
    }

    @Test
    void whenGetBookingsForRack_thenReturnList() {
        // Given
        String month = "06";
        String year = "2024";
        EntityRack rack1 = new EntityRack();
        EntityRack rack2 = new EntityRack();
        List<EntityRack> expected = Arrays.asList(rack1, rack2);
        when(repoRack.findByStatusAndMonthAndYear("confirmada", month, year)).thenReturn(expected);

        // When
        List<EntityRack> result = serviceRack.getBookingsForRack(month, year);

        // Then
        assertThat(result).isEqualTo(expected);
    }
}