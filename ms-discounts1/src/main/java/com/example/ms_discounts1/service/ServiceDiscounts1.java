package com.example.ms_discounts1.service;

import org.springframework.stereotype.Service;

@Service
public class ServiceDiscounts1 {
    public int discountsForNumOfPeople(Integer numOfPeople, int basePrice) {
        int discount = 0;
        if (numOfPeople == 1 || numOfPeople == 2) {
            discount = 0;
        } else if (3 <= numOfPeople && numOfPeople <= 5) {
            discount = 10;
        } else if (6 <= numOfPeople && numOfPeople <= 10) {
            discount = 20;
        } else if (11 <= numOfPeople && numOfPeople <= 15) {
            discount = 30;
        }
        return basePrice - ((basePrice * discount) / 100);
    }
}
