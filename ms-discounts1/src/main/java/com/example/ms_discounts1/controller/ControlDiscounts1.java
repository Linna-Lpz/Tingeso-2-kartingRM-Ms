package com.example.ms_discounts1.controller;

import com.example.ms_discounts1.service.ServiceDiscounts1;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/discounts1")
public class ControlDiscounts1 {
    @Autowired
    ServiceDiscounts1 serviceDiscounts1;

    @GetMapping("/discount/{numOfPeople}/{basePrice}")
    public int discountForNumOfPeople(@PathVariable Integer numOfPeople, @PathVariable int basePrice) {
        return serviceDiscounts1.discountsForNumOfPeople(numOfPeople, basePrice);
    }
}
