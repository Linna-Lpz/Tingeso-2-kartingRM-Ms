package com.example.ms_booking.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ClientValidationException.class)
    public ResponseEntity<String> handleClientValidationException(ClientValidationException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }
}
