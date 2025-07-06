package com.example.ms_booking.TestService;

import com.example.ms_booking.service.ServiceBooking;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

class TestServiceMsBooking {

    ServiceBooking serviceBooking = null; // No se requiere instancia real para método estático

    @Test
    void whenCalculateTotalWithIva_thenCorrectResult() {
        //Given
        String totalPrice = "10000,20000,30000";
        String iva = "19";

        //When
        String totalWithIva = new ServiceBooking(null, null, null).calculateTotalWithIva(totalPrice, iva);

        //Then
        assertThat(totalWithIva).isEqualTo("11900,23800,35700");
    }

    @Test
    void whenCalculateTotalWithIvaWithZeroIva_thenSameResult() {
        //Given
        String totalPrice = "5000,15000";
        String iva = "0";

        //When
        String totalWithIva = new ServiceBooking(null, null, null).calculateTotalWithIva(totalPrice, iva);

        //Then
        assertThat(totalWithIva).isEqualTo("5000,15000");
    }
}