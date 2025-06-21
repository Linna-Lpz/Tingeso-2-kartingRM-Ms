package com.example.ms_booking.service;

import com.example.ms_booking.entity.EntityBooking;
import com.example.ms_booking.entity.EntityClient;
import com.example.ms_booking.repository.RepoBooking;
import com.example.ms_booking.repository.RepoClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class ServiceBooking {
    @Autowired
    RepoBooking repoBooking;
    @Autowired
    RepoClient repoClient;
    @Autowired
    RestTemplate restTemplate;

    public void saveBooking(EntityBooking booking) {
        // Establecer tarifa base y duración de la reserva
        setPriceAndDuration(booking);

        // Establecer descuentos
        applyDiscountsPerClient(booking);

        // Calcular el total con IVA
        String totalWithIva = calculateTotalWithIva(booking.getTotalPrice(), booking.getIva());
        booking.setTotalWithIva(totalWithIva);

        // Calcular el monto total a pagar
        booking.setTotalAmount(calculateTotalPrice(totalWithIva));

        // Establecer estado de la reserva
        booking.setBookingStatus("sin confirmar");

        // Guardar la reserva
        repoBooking.save(booking);
    }

    //-----------------------------------------------------------
    //    Métodos para establecer tarifas y duración de la reserva
    //-----------------------------------------------------------

    /**
     * Método para obtener el precio base de acuerdo a la cantidad de vueltas o tiempo máximo permitido
     * @param lapsOrMaxTimeAllowed vueltas o tiempo máximo permitido
     * @return ResponseEntity<Integer>
     */
    public Integer getBasePrice(Integer lapsOrMaxTimeAllowed) {
        return restTemplate.getForObject("http://ms-rates/rates/basePrice/" + lapsOrMaxTimeAllowed, Integer.class);
    }

    /**
     * Método para obtener la duración de acuerdo a la cantidad de vueltas o tiempo máximo permitido
     * @param lapsOrMaxTimeAllowed vueltas o tiempo máximo permitido
     * @return ResponseEntity<Integer>
     */
    public Integer getDuration(Integer lapsOrMaxTimeAllowed) {
        return restTemplate.getForObject("http://ms-rates/rates/duration/" + lapsOrMaxTimeAllowed, Integer.class);
    }

    /**
     * Método para establecer el precio base y la duración de la reserva
     * @param booking Reserva a la que se le establecerá el precio y la duración
     */
    public void setPriceAndDuration(EntityBooking booking){
        Integer lapsOrMaxTimeAllowed = booking.getLapsOrMaxTimeAllowed();
        Integer basePrice = getBasePrice(lapsOrMaxTimeAllowed);
        booking.setBasePrice(String.valueOf(basePrice));
        Integer duration = getDuration(lapsOrMaxTimeAllowed);
        booking.setBookingTimeEnd(booking.getBookingTime().plusMinutes(duration));
    }

    //-----------------------------------------------------------
    //    Métodos para establecer descuentos
    //-----------------------------------------------------------

    public Integer discountForNumOfPeople(int numOfPeople, int basePrice) {
        return restTemplate.getForObject("http://ms-discounts1/discounts1/discount/" + numOfPeople + "/" + basePrice, Integer.class);
    }

    public Integer discountForVisitsPerMonth(int visitsPerMonth, int basePrice) {
        return restTemplate.getForObject("http://ms-discounts2/discounts2/discount/" + visitsPerMonth + "/" + basePrice, Integer.class);
    }

    public Integer discountForBirthday(String clientBirthday, String bookingDayMonth, int basePrice) {
        return restTemplate.getForObject("http://ms-special-rates/special-rates/discount/" + clientBirthday + "/" + bookingDayMonth + "/" + basePrice, Integer.class);
    }

    public void applyDiscountsPerClient(EntityBooking booking) {
        Integer basePrice = Integer.parseInt(booking.getBasePrice());
        Integer numOfPeople = booking.getNumOfPeople();
        String[] clientsRut = booking.getClientsRUT().split(",");
        StringBuilder discountsList = new StringBuilder();
        StringBuilder discountsListType = new StringBuilder();
        String bookingDayMonth = booking.getBookingDate().format(DateTimeFormatter.ofPattern("dd-MM"));
        int bDayDiscountApplied = 0;

        for(String rut : clientsRut) {
            EntityClient client = repoClient.findByClientRUT(rut);
            Integer discount = basePrice; // Tarifa con el descuento base aplicado
            String discountType = "no"; // Tipo de descuento aplicado

            if (client != null) {
                // Verificar si aplica el descuento de cumpleaños
                if ((numOfPeople >= 3 && numOfPeople <= 5 && bDayDiscountApplied == 0) ||
                        (numOfPeople >= 6 && numOfPeople <= 10 && bDayDiscountApplied < 3)) {
                    Integer birthdayDiscount = discountForBirthday(client.getClientBirthday(), bookingDayMonth, basePrice);
                    if (!birthdayDiscount.equals(basePrice)) {
                        discount = birthdayDiscount;
                        discountType = "cumpleaños";
                        bDayDiscountApplied++;
                    }

                }
                // Si no aplica el descuento de cumpleaños, verificar el descuento por visitas
                if (discount == basePrice) {
                    Integer visitsDiscount = discountForVisitsPerMonth(client.getVisitsPerMonth(), basePrice);
                    if (!visitsDiscount.equals(basePrice)) {
                        discount = visitsDiscount;
                        discountType = "visitas";
                    } else if (numOfPeople >= 3 && numOfPeople <= 15) {
                        // Aplicar el descuento por número de personas
                        discount = discountForNumOfPeople(numOfPeople, basePrice);
                        discountType = "integrantes";
                    }
                }
                // Actualizar el número de visitas del cliente
                client.setVisitsPerMonth(client.getVisitsPerMonth() + 1);
            }
            discountsList.append(discount).append(",");
            discountsListType.append(discountType).append(",");
        }

        booking.setDiscounts(discountsListType.toString()); // Lista de descuentos aplicados (cumpleaños, visitas, integrantes)
        booking.setTotalPrice(discountsList.toString()); // Lista de precios con descuento
    }

    //-----------------------------------------------------------
    //    Métodos para calcular el precio total a pagar
    //-----------------------------------------------------------

    /**
     * Método para calcular el precio total con IVA
     * @param totalPrice precio total a pagar por cada cliente
     * @param iva porcentaje de IVA
     * @return precio total con IVA
     */
    public String calculateTotalWithIva(String totalPrice, String iva) {
        Integer ivaI = Integer.parseInt(iva);
        List<String> totalPriceList = List.of(totalPrice.split(","));
        StringBuilder totalWithIva = new StringBuilder();
        for (String total : totalPriceList) {
            Integer price = Integer.parseInt(total);
            System.out.println("Precio base: " + price);
            Integer totalWithIvaValue = price + ((price * ivaI) / 100);
            System.out.println("Precio total con IVA: " + totalWithIvaValue);
            totalWithIva.append(totalWithIvaValue).append(",");
        }
        if (totalWithIva.length() > 0) {
            totalWithIva.setLength(totalWithIva.length() - 1); // Elimina la última coma al añadir los precios
        }
        return totalWithIva.toString();
    }

    /**
     * Método para calcular el precio total a pagar
     * @param totalWithIva precio total con IVA
     * @return precio total a pagar
     */
    public Integer calculateTotalPrice(String totalWithIva) {
        Integer totalPrice = 0;
        List<String> totalWithIvaList = List.of(totalWithIva.split(","));
        for (String total : totalWithIvaList) {
            Integer price = Integer.parseInt(total);
            totalPrice += price;
        }
        return totalPrice;
    }

    //-----------------------------------------------------------
    //    Métodos para establecer el estado de la reserva
    //-----------------------------------------------------------

    /**
     * Método para confirmar una reserva
     * @param bookingId id de la reserva
     */
    public void confirmBooking(Long bookingId) {
        EntityBooking booking = repoBooking.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada con ID: " + bookingId));
        booking.setBookingStatus("confirmada");
        saveRack(booking.getId(), booking.getBookingDate(), booking.getBookingTime(), booking.getBookingTimeEnd(), booking.getBookingStatus(), booking.getClientsNames().split(",")[0]);
        repoBooking.save(booking);
    }

    /**
     * Método para cancelar una reserva
     * @param bookingId id de la reserva
     */
    public void cancelBooking(Long bookingId) {
        EntityBooking booking = repoBooking.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada con ID: " + bookingId));
        booking.setBookingStatus("cancelada");
        deleteRack(booking.getId());
        repoBooking.save(booking);
    }

    //-----------------------------------------------------------
    //    Métodos para obtener reservas para el rack semanal
    //-----------------------------------------------------------

    public void saveRack(Long id, LocalDate bookingDate, LocalTime bookingTime, LocalTime bookingTimeEnd, String bookingStatus, String clientName){
        restTemplate.postForObject("http://ms-rack/rack/save/" + id + "/" + bookingDate + "/" + bookingTime + "/" + bookingTimeEnd + "/" + bookingStatus + "/" + clientName, null, String.class);
    }

    public void deleteRack(Long id){
        restTemplate.delete("http://ms-rack/rack/delete/" + id);
    }

    //------------------------------------------------------------
    //    Métodos para obtener reservas para el reporte
    //------------------------------------------------------------

    public List<EntityBooking> findByStatusAndDayAndLapsOrMaxTime(String status, String month, Integer maxTimeAllowed) {
        return repoBooking.findByStatusAndDayAndLapsOrMaxTime(status, month, maxTimeAllowed);
    }

    public List<EntityBooking> findByStatusAndDayAndNumOfPeople1or2(String status, String month, Integer numOfPeople) {
        return repoBooking.findByStatusAndDayAndNumOfPeople1or2(status, month, numOfPeople);
    }

    public List<EntityBooking> findByStatusAndDayAndNumOfPeople3to5(String status, String month, Integer numOfPeople) {
        return repoBooking.findByStatusAndDayAndNumOfPeople3to5(status, month, numOfPeople);
    }

    public List<EntityBooking> findByStatusAndDayAndNumOfPeople6to10(String status, String month, Integer numOfPeople) {
        return repoBooking.findByStatusAndDayAndNumOfPeople6to10(status, month, numOfPeople);
    }

    public List<EntityBooking> findByStatusAndDayAndNumOfPeople11to15(String status, String month, Integer numOfPeople) {
        return repoBooking.findByStatusAndDayAndNumOfPeople11to15(status, month, numOfPeople);
    }

    //------------------------------------------------------------
    //    Métodos generales para obtener reservas
    //------------------------------------------------------------

    /**
     * Método para obtener una lista de reservas
     * @return lista de reservas
     */
    public List<EntityBooking> getBookings() {
        return repoBooking.findByBookingStatusContains("confirmada");
    }

    public List<EntityBooking> findByBookingDate(LocalDate bookingDate){
        return repoBooking.findByBookingDate(bookingDate);
    }

    public List<EntityBooking> findByClientsRUTContains(String rut){
        return repoBooking.findByClientsRUTContains(rut);
    }


    /**
     * Método para obtener una lista de reservas de un cliente
     * @param rut RUT del cliente
     * @return lista de reservas
     */
    public List<EntityBooking> getBookingsByUserRut(String rut) {
        List<EntityBooking> bookings = repoBooking.findByClientsRUTContains(rut);
        List<EntityBooking> filteredBookings = new ArrayList<>();

        if (bookings.isEmpty()) {
            System.out.println("No se encontraron reservas para el cliente con RUT: " + rut);
            return new ArrayList<>();
        } else {
            for (EntityBooking booking : bookings) {
                // Verificar si el RUT del cliente coincide con el RUT de la reserva
                List<String> clientsRUT = List.of(booking.getClientsRUT().split(","));
                if (clientsRUT.get(0).equals(rut)) {
                    filteredBookings.add(booking);
                }
            }
        }
        return filteredBookings;
    }

    /**
     * Método para obtener una lista de reservas por fecha
     * @param date fecha de la reserva
     * @return lista de horas de reserva
     */
    public List<LocalTime> getTimesByDate(LocalDate date){
        List<EntityBooking> bookings = repoBooking.findByBookingDate(date);
        List<LocalTime> times = new ArrayList<>();
        for (EntityBooking booking : bookings) {
            times.add(booking.getBookingTime());
        }
        return times;
    }

    /**
     * Método para obtener una lista de reservas por fecha final
     * @param date fecha de la reserva
     * @return lista de horas de reserva
     */
    public List<LocalTime> getTimesEndByDate(LocalDate date){
        List<EntityBooking> bookings = repoBooking.findByBookingDate(date);
        List<LocalTime> times = new ArrayList<>();
        for (EntityBooking booking : bookings) {
            times.add(booking.getBookingTimeEnd());
        }
        return times;
    }

    /**
     * Método para obtener una lista de reservas confirmadas
     * @return lista de reservas confirmadas
     */
    public List<EntityBooking> getConfirmedBookings() {
        return repoBooking.findByBookingStatusContains("confirmada");
    }
}
