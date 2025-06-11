package com.example.ms_booking.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ms_booking.entity.EntityClient;
import com.example.ms_booking.service.ServiceClient;

@RestController
@RequestMapping("/client")

public class ControlClient {
    @Autowired
    ServiceClient serviceClient;

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
