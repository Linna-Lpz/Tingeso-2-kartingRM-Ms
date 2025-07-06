package com.example.ms_discounts2.TestService;

import com.example.ms_discounts2.service.ServiceDiscounts2;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import static org.assertj.core.api.Assertions.assertThat;

class TestServiceMsDiscounts2 {

    ServiceDiscounts2 serviceDiscounts2 = new ServiceDiscounts2();

    @ParameterizedTest
    @CsvSource({
            "3, 10000, 9000",   // Entre 2 y 4 visitas: 10% descuento
            "5, 10000, 8000",   // 5 o 6 visitas: 20% descuento
            "8, 10000, 7000",   // 7 o más visitas: 30% descuento
            "1, 10000, 10000"   // Menos de 2 visitas: sin descuento
    })
    void whenDiscountForVisitsPerMonth_thenExpectedResult(int visitsPerMonth, int basePrice, int expected) {
        // When
        int result = serviceDiscounts2.discountForVisitsPerMonth(visitsPerMonth, basePrice);

        // Then
        assertThat(result).isEqualTo(expected);
    }
}