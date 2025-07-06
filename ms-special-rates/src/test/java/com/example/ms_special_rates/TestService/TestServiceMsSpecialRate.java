package com.example.ms_special_rates.TestService;

import com.example.ms_special_rates.service.ServiceSpecialRates;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import static org.assertj.core.api.Assertions.assertThat;

class ServiceSpecialRatesTest {

    ServiceSpecialRates serviceSpecialRates = new ServiceSpecialRates();

    @ParameterizedTest
    @CsvSource({
            "'12-05-1990', 12-05, 10000, 5000",
            "'13-06-1990', 12-05, 10000, 10000",
            " , 12-05, 10000, 10000"
    })
    void whenDiscountForBirthday_thenExpectedResult(String clientBirthday, String bookingDayMonth, int basePrice, int expected) {
        // When
        int result = serviceSpecialRates.discountForBirthday(clientBirthday, bookingDayMonth, basePrice);

        // Then
        assertThat(result).isEqualTo(expected);
    }
}