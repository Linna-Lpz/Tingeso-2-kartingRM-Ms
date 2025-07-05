package com.example.ms_discounts2.service;

import org.springframework.stereotype.Service;

@Service
public class ServiceDiscounts2 {
    /**
     * Método para calcular el descuento por visitas al mes
     * @param visitsPerMonth visitas por mes
     * @param basePrice precio base
     * @return int
     */
    public int discountForVisitsPerMonth(Integer visitsPerMonth, int basePrice) {
        int discount;
        if (2 <= visitsPerMonth && visitsPerMonth <= 4) {
            discount = 10;
        } else if (visitsPerMonth == 5 || visitsPerMonth == 6) {
            discount = 20;
        } else if (visitsPerMonth >= 7) {
            discount = 30;
        } else {
            discount = 0;
        }
        return basePrice - ((basePrice * discount) / 100);
    }
}
