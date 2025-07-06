package com.example.ms_discounts1.TestService;

import com.example.ms_discounts1.service.ServiceDiscounts1;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import static org.assertj.core.api.Assertions.assertThat;

class TestServiceMsDiscounts1 {

    ServiceDiscounts1 serviceDiscounts1 = new ServiceDiscounts1();

    @ParameterizedTest
    @CsvSource({
            "1, 10000, 10000",   // 1 persona, sin descuento
            "2, 10000, 10000",   // 2 personas, sin descuento
            "4, 10000, 9000",    // 3-5 personas, 10% descuento
            "7, 10000, 8000",    // 6-10 personas, 20% descuento
            "12, 10000, 7000"    // 11-15 personas, 30% descuento
    })
    void whenDiscountsForNumOfPeople_thenExpectedResult(int numOfPeople, int basePrice, int expected) {
        // When
        int result = serviceDiscounts1.discountsForNumOfPeople(numOfPeople, basePrice);

        // Then
        assertThat(result).isEqualTo(expected);
    }
}