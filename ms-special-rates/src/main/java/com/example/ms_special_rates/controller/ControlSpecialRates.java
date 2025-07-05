package com.example.ms_special_rates.controller;

import com.example.ms_special_rates.service.ServiceSpecialRates;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/special-rates")
@CrossOrigin(origins = "*")
public class ControlSpecialRates {

    private final ServiceSpecialRates serviceSpecialRates;

    public ControlSpecialRates(ServiceSpecialRates serviceSpecialRates) {
        this.serviceSpecialRates = serviceSpecialRates;
    }

    @GetMapping("/discount/{clientBirthday}/{bookingDayMonth}/{basePrice}")
    public int discountForBirthday(@PathVariable String clientBirthday,
                                   @PathVariable String bookingDayMonth,
                                   @PathVariable int basePrice) {
        return serviceSpecialRates.discountForBirthday(clientBirthday, bookingDayMonth, basePrice);
    }
}
