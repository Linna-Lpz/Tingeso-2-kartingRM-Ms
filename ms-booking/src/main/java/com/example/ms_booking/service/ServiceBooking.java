package com.example.ms_booking.service;

import com.example.ms_booking.entity.EntityBooking;
import com.example.ms_booking.entity.EntityClient;
import com.example.ms_booking.exception.BookingValidationException;
import com.example.ms_booking.repository.RepoBooking;
import com.example.ms_booking.repository.RepoClient;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class ServiceBooking {

    private final RepoBooking repoBooking;
    private final RepoClient repoClient;
    private final RestTemplate restTemplate;

    public ServiceBooking(RepoBooking repoBooking, RepoClient repoClient, RestTemplate restTemplate) {
        this.repoBooking = repoBooking;
        this.repoClient = repoClient;
        this.restTemplate = restTemplate;
    }

    private static final String STATUS_CONFIRMADA = "confirmada";

    public void saveBooking(EntityBooking booking) {
        // Validar datos de la reserva
        validateBooking(booking);

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
    //    Métodos para validar los datos de la reserva
    //-----------------------------------------------------------
    public boolean validateBooking(EntityBooking booking) {
        // Validar que la fecha de reserva no sea nula
        if (booking.getBookingDate() == null) {
            throw new BookingValidationException("La fecha de reserva no puede ser nula");
        }

        // Validar que la hora de reserva no sea nula
        if (booking.getBookingTime() == null) {
            throw new BookingValidationException("La hora de reserva no puede ser nula");
        }

        // Validar el número de vueltas o tiempo máximo permitido
        if ( booking.getLapsOrMaxTimeAllowed() != 10 &&
             booking.getLapsOrMaxTimeAllowed() != 15 &&
             booking.getLapsOrMaxTimeAllowed() != 20) {
            throw new BookingValidationException("El número de vueltas o tiempo máximo permitido debe ser 10, 15 o 20");
        }

        // Validar que el número de personas sea mayor a 0 y menor o igual a 15
        if (booking.getNumOfPeople() <= 0) {
            throw new BookingValidationException("El número de personas debe ser mayor a 0 y menor o igual a 15");
        }

        // Validar que el RUT del cliente no sea nulo o vacío
        if (booking.getClientsRUT() == null || booking.getClientsRUT().isEmpty()) {
            throw new BookingValidationException("El RUT del cliente no puede ser nulo o vacío");
        }

        // Validar que el RUT tenga el formato correcto
        String[] clientsRUT = booking.getClientsRUT().split(",");
        for (String rut : clientsRUT) {
            if (!rut.matches("\\d{1,8}-[\\dkK]")) {
                throw new BookingValidationException("El RUT '" + rut + "' no tiene el formato correcto (12345678-9)");            }
        }

        return true;
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

    // Dentro de ServiceBooking.java

    private boolean canApplyBirthdayDiscount(int numOfPeople, int bDayDiscountApplied) {
        return (numOfPeople >= 3 && numOfPeople <= 5 && bDayDiscountApplied == 0) ||
                (numOfPeople >= 6 && numOfPeople <= 10 && bDayDiscountApplied < 3);
    }

    private boolean isDiscountApplied(Integer discount, Integer basePrice) {
        return !discount.equals(basePrice);
    }

    private DiscountResult applyDiscounts(EntityClient client, int numOfPeople, int basePrice, String bookingDayMonth, int bDayDiscountApplied) {
        int discount = basePrice;
        String discountType = "no";
        int birthdayApplied = bDayDiscountApplied;

        if (client != null) {
            if (canApplyBirthdayDiscount(numOfPeople, bDayDiscountApplied)) {
                Integer birthdayDiscount = discountForBirthday(client.getClientBirthday(), bookingDayMonth, basePrice);
                if (isDiscountApplied(birthdayDiscount, basePrice)) {
                    discount = birthdayDiscount;
                    discountType = "cumpleaños";
                    birthdayApplied++;
                    return new DiscountResult(discount, discountType, birthdayApplied);
                }
            }
            Integer visitsDiscount = discountForVisitsPerMonth(client.getVisitsPerMonth(), basePrice);
            if (isDiscountApplied(visitsDiscount, basePrice)) {
                discount = visitsDiscount;
                discountType = "visitas";
            } else if (numOfPeople >= 3 && numOfPeople <= 15) {
                discount = discountForNumOfPeople(numOfPeople, basePrice);
                discountType = "integrantes";
            }
            client.setVisitsPerMonth(client.getVisitsPerMonth() + 1);
        }
        return new DiscountResult(discount, discountType, birthdayApplied);
    }

    private static class DiscountResult {
        int discount;
        String discountType;
        int bDayDiscountApplied;

        DiscountResult(int discount, String discountType, int bDayDiscountApplied) {
            this.discount = discount;
            this.discountType = discountType;
            this.bDayDiscountApplied = bDayDiscountApplied;
        }
    }

    public void applyDiscountsPerClient(EntityBooking booking) {
        Integer basePrice = Integer.parseInt(booking.getBasePrice());
        Integer numOfPeople = booking.getNumOfPeople();
        String[] clientsRut = booking.getClientsRUT().split(",");
        StringBuilder discountsList = new StringBuilder();
        StringBuilder discountsListType = new StringBuilder();
        String bookingDayMonth = booking.getBookingDate().format(DateTimeFormatter.ofPattern("dd-MM"));
        int bDayDiscountApplied = 0;

        for (String rut : clientsRut) {
            EntityClient client = repoClient.findByClientRUT(rut);
            DiscountResult result = applyDiscounts(client, numOfPeople, basePrice, bookingDayMonth, bDayDiscountApplied);
            bDayDiscountApplied = result.bDayDiscountApplied;
            discountsList.append(result.discount).append(",");
            discountsListType.append(result.discountType).append(",");
        }

        booking.setDiscounts(discountsListType.toString());
        booking.setTotalPrice(discountsList.toString());
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
            Integer totalWithIvaValue = price + ((price * ivaI) / 100);
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
                .orElseThrow(() -> new BookingValidationException("Reserva no encontrada con ID: " + bookingId));
        booking.setBookingStatus(STATUS_CONFIRMADA);
        saveRack(booking.getId(), booking.getBookingDate(), booking.getBookingTime(), booking.getBookingTimeEnd(), booking.getBookingStatus(), booking.getClientsNames().split(",")[0]);
        repoBooking.save(booking);
    }

    /**
     * Método para cancelar una reserva
     * @param bookingId id de la reserva
     */
    public void cancelBooking(Long bookingId) {
        EntityBooking booking = repoBooking.findById(bookingId)
                .orElseThrow(() -> new BookingValidationException("Reserva no encontrada con ID: " + bookingId));
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
        return repoBooking.findByBookingStatusContains(STATUS_CONFIRMADA);
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
        return repoBooking.findByBookingStatusContains(STATUS_CONFIRMADA);
    }
}
