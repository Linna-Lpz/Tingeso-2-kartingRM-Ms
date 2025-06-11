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
        discount = (2 <= visitsPerMonth && visitsPerMonth <= 4) ? 10
                : (5 == visitsPerMonth || visitsPerMonth == 6) ? 20
                : (visitsPerMonth >= 7) ? 30
                : 0;
        return basePrice - ((basePrice * discount) / 100);
    }
}
