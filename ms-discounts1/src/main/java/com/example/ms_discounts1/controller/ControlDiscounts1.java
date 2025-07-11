package com.example.ms_discounts1.controller;

import com.example.ms_discounts1.service.ServiceDiscounts1;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/discounts1")
@CrossOrigin(origins = "*")
public class ControlDiscounts1 {

    private final ServiceDiscounts1 serviceDiscounts1;

    public ControlDiscounts1(ServiceDiscounts1 serviceDiscounts1) {
        this.serviceDiscounts1 = serviceDiscounts1;
    }

    @GetMapping("/discount/{numOfPeople}/{basePrice}")
    public int discountForNumOfPeople(@PathVariable Integer numOfPeople, @PathVariable int basePrice) {
        return serviceDiscounts1.discountsForNumOfPeople(numOfPeople, basePrice);
    }
}
