package com.example.ms_discounts2.controller;

import com.example.ms_discounts2.service.ServiceDiscounts2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/discounts2")
@CrossOrigin(origins = "*")
public class ControlDiscounts2 {
    @Autowired
    ServiceDiscounts2 serviceDiscounts2;

    /**
     * Método para obtener el descuento de acuerdo a la cantidad de visitas por mes
     * @param visitsPerMonth visitas por mes
     * @param basePrice precio base
     * @return int
     */
    @GetMapping("/discount/{visitsPerMonth}/{basePrice}")
    public int discountForVisitsPerMonth(@PathVariable Integer visitsPerMonth, @PathVariable int basePrice){
        return serviceDiscounts2.discountForVisitsPerMonth(visitsPerMonth, basePrice);
    }
}
