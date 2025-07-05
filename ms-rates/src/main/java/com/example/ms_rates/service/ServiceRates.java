package com.example.ms_rates.service;

import org.springframework.stereotype.Service;

@Service
public class ServiceRates {

    public int calculatePrice(Integer lapsOrMaxTimeAllowed){
        int basePrice;
        if (lapsOrMaxTimeAllowed == 10) {
            basePrice = 15000;
        } else if (lapsOrMaxTimeAllowed == 15) {
            basePrice = 20000;
        } else if (lapsOrMaxTimeAllowed == 20) {
            basePrice = 25000;
        } else {
            basePrice = 0;
        }
        return basePrice;
    }

    public int calculateDuration(Integer lapsOrMaxTimeAllowed){
        int duration;
        if (lapsOrMaxTimeAllowed == 10) {
            duration = 30;
        } else if (lapsOrMaxTimeAllowed == 15) {
            duration = 35;
        } else if (lapsOrMaxTimeAllowed == 20) {
            duration = 40;
        } else {
            duration = 0;
        }
        return duration;
    }
}