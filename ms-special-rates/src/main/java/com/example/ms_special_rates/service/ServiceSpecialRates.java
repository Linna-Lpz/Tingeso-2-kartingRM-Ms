package com.example.ms_special_rates.service;

import org.springframework.stereotype.Service;

@Service
public class ServiceSpecialRates {

    /**
     * Método para calcular el descuento por cumpleaños
     * @param clientBirthday fecha de cumpleaños del cliente
     * @param bookingDayMonth fecha de la reserva (día y mes)
     * @return int
     */
    public int discountForBirthday(String clientBirthday, String bookingDayMonth, int basePrice) {
        int discount = 0;
        if (clientBirthday != null && clientBirthday.substring(0, 5).equals(bookingDayMonth)) {
            discount = 50;
        }
        return basePrice - ((basePrice * discount) / 100);
    }

}
