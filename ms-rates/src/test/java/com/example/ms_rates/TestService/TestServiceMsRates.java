package com.example.ms_rates.TestService;

import com.example.ms_rates.service.ServiceRates;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import static org.assertj.core.api.Assertions.assertThat;

class ServiceRatesTest {

    ServiceRates serviceRates = new ServiceRates();

    @ParameterizedTest
    @CsvSource({
            "10, 15000",
            "15, 20000",
            "20, 25000",
            "5, 0"
    })
    void whenCalculatePrice_thenExpectedResult(int lapsOrMaxTime, int expectedPrice) {
        // When
        int price = serviceRates.calculatePrice(lapsOrMaxTime);

        // Then
        assertThat(price).isEqualTo(expectedPrice);
    }
}