package com.example.ms_booking.exception;

public class ClientValidationException extends RuntimeException{
    public ClientValidationException(String message) {
        super(message);
    }
}
