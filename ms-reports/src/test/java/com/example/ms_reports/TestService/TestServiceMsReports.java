package com.example.ms_reports.TestService;

import com.example.ms_reports.dto.EntityBookingDTO;
import com.example.ms_reports.service.ServiceReport;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class ServiceReportTest {

    RestTemplate restTemplate = mock(RestTemplate.class);
    ServiceReport serviceReport = Mockito.spy(new ServiceReport(restTemplate));

    @Test
    void whenGetIncomesForTimeAndMonthWithBookings_thenCorrectIncome() {
        // Given
        EntityBookingDTO booking1 = new EntityBookingDTO();
        booking1.setNumOfPeople(2);
        booking1.setBasePrice("1000");

        EntityBookingDTO booking2 = new EntityBookingDTO();
        booking2.setNumOfPeople(3);
        booking2.setBasePrice("2000");

        List<EntityBookingDTO> bookings = Arrays.asList(booking1, booking2);

        doReturn(bookings).when(serviceReport)
                .findByStatusAndDayAndLapsOrMaxTime("confirmada", "05", 10);

        // When
        int income = serviceReport.getIncomesForTimeAndMonth(10, "05");

        // Then
        assertThat(income).isEqualTo(2 * 1000 + 3 * 2000);
    }

    @Test
    void whenGetIncomesForTimeAndMonthWithEmptyBookings_thenZeroIncome() {
        // Given
        doReturn(Collections.emptyList()).when(serviceReport)
                .findByStatusAndDayAndLapsOrMaxTime("confirmada", "06", 5);

        // When
        int income = serviceReport.getIncomesForTimeAndMonth(5, "06");

        // Then
        assertThat(income).isZero();
    }
}