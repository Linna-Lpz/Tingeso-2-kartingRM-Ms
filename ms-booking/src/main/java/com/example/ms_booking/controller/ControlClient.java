package com.example.ms_booking.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.ms_booking.entity.EntityClient;
import com.example.ms_booking.service.ServiceClient;

@RestController
@RequestMapping("/client")

public class ControlClient {

    private final ServiceClient serviceClient;

    public ControlClient(ServiceClient serviceClient) {
        this.serviceClient = serviceClient;
    }

    @PostMapping("/save")
    public ResponseEntity<EntityClient> saveClient(@RequestBody EntityClient client) {
        serviceClient.saveClient(client);
        return ResponseEntity.ok(client);
    }

    @GetMapping("/get/{rut}")
    public ResponseEntity<EntityClient> getClientByRut(@PathVariable String rut) {
        EntityClient client = serviceClient.getClientByRut(rut);
        return ResponseEntity.ok(client);
    }
}
