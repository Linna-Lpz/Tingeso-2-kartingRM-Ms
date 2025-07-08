package com.example.ms_booking.controller;

import com.example.ms_booking.service.ServiceVoucher;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/voucher")

public class ControlVoucher {

    private final ServiceVoucher serviceVoucher;

    public ControlVoucher(ServiceVoucher serviceVoucher) {
        this.serviceVoucher = serviceVoucher;
    }

    /**
     * Método para exportar el comprobante a Excel
     * @param bookingId ID de la reserva
     */
    @PostMapping("/export/{bookingId}")
    public ResponseEntity<byte[]> exportVoucherToExcel(@PathVariable Long bookingId) {
        return serviceVoucher.exportVoucherToExcel(bookingId);
    }

    /**
     * Método para enviar el comprobante por correo electrónico
     * @param bookingId ID de la reserva
     */
    @PostMapping("/send/{bookingId}")
    public void sendVoucherByEmail(@PathVariable Long bookingId) {
        serviceVoucher.sendVoucherByEmail(bookingId);
    }
}