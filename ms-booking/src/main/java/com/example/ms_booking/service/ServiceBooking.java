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
        Integer lapsOrMaxTimeAllowed = booking.getLapsOrMaxTimeAllowed();
        Integer basePrice = getBasePrice(lapsOrMaxTimeAllowed);
        booking.setBasePrice(String.valueOf(basePrice));
        Integer duration = getDuration(lapsOrMaxTimeAllowed);
        booking.setBookingTimeEnd(booking.getBookingTime().plusMinutes(duration));

        // Establecer descuentos
        Integer numOfPeople = booking.getNumOfPeople();
        String[] clientsRut = booking.getClientsRUT().split(",");
        Integer discount; // Tarifa con el descuento aplicado
        StringBuilder discountsList = new StringBuilder();
        StringBuilder discountsListType = new StringBuilder();
        String bookingDayMonth = booking.getBookingDate().format(DateTimeFormatter.ofPattern("dd-MM"));

        if (1 == numOfPeople || numOfPeople == 2) {
            for (String rut : clientsRut) {
                EntityClient client = repoClient.findByClientRUT(rut);
                if (client != null) {
                    discount = discountForVisitsPerMonth(client.getVisitsPerMonth(), basePrice);
                    if (Objects.equals(discount, basePrice)) {
                        discountsListType.append("no,");
                    } else {
                        discountsListType.append("visitas,");
                    }
                    client.setVisitsPerMonth(client.getVisitsPerMonth() + 1);
                    discountsList.append(discount).append(",");
                } else {
                    discountsList.append(basePrice).append(",");// Si el cliente no está registrado, no se aplica descuento
                    discountsListType.append("no,");
                }
            }
        }
        if (3 <= numOfPeople && numOfPeople <= 5) {
            int bDayDiscountApplied = 0;
            for (String rut : clientsRut) {
                EntityClient client = repoClient.findByClientRUT(rut);
                if (client != null) {
                    String clientBirthday = client.getClientBirthday();
                    if (bDayDiscountApplied == 0 && !Objects.equals(discountForBirthday(clientBirthday, bookingDayMonth, basePrice), basePrice)) {
                        discount = discountForBirthday(clientBirthday, bookingDayMonth, basePrice);
                        bDayDiscountApplied = 1;
                        discountsListType.append("cumpleaños,");
                    } else {
                        discount = discountForVisitsPerMonth(client.getVisitsPerMonth(), basePrice);
                        if (Objects.equals(discount, basePrice)) {
                            discount = discountForNumOfPeople(numOfPeople, basePrice); // Descuento por grupo de 3 a 5 personas
                            discountsListType.append("integrantes,");
                        } else {
                            discountsListType.append("visitas,");
                        }
                    }
                    client.setVisitsPerMonth(client.getVisitsPerMonth() + 1);
                    discountsList.append(discount).append(",");
                } else {
                    discountsList.append(basePrice).append(",");// Si el cliente no está registrado, no se aplica descuento
                    discountsListType.append("no,");
                }
            }
        }
        if (6 <= numOfPeople && numOfPeople <= 10) {
            int bDayDiscountApplied = 0;
            for (String rut : clientsRut) {
                EntityClient client = repoClient.findByClientRUT(rut);
                if (client != null) {
                    String clientBirthday = client.getClientBirthday();
                    if (bDayDiscountApplied < 3 && !Objects.equals(discountForBirthday(clientBirthday, bookingDayMonth, basePrice), basePrice)) {
                        discount = discountForBirthday(clientBirthday, bookingDayMonth, basePrice);
                        bDayDiscountApplied += 1;
                        discountsListType.append("cumpleaños,");
                    } else {
                        discount = discountForVisitsPerMonth(client.getVisitsPerMonth(), basePrice);
                        if (!Objects.equals(discount, basePrice)) {
                            discountsListType.append("visitas,");
                        } else {
                            discount = discountForNumOfPeople(numOfPeople, basePrice); // Descuento por el grupo de 6 a 10 personas
                            discountsListType.append("integrantes,");
                        }
                    }
                    client.setVisitsPerMonth(client.getVisitsPerMonth() + 1);
                    discountsList.append(discount).append(",");
                } else {
                    discountsList.append(basePrice).append(",");// Si el cliente no está registrado, no se aplica descuento
                    discountsListType.append("no,");
                }
            }
        }
        if (11 <= numOfPeople && numOfPeople <= 15) {
            for (String rut : clientsRut) {
                EntityClient client = repoClient.findByClientRUT(rut);
                if (client != null) {
                    discount = discountForNumOfPeople(numOfPeople, basePrice); // Descuento por grupo de 11 a 15 personas
                    client.setVisitsPerMonth(client.getVisitsPerMonth() + 1);
                    discountsListType.append("integrantes,");
                    discountsList.append(discount).append(",");
                } else {
                    discountsList.append(basePrice).append(",");// Si el cliente no está registrado, no se aplica descuento
                    discountsListType.append("no,");
                }
            }
        }

        booking.setDiscounts(discountsListType.toString()); // Lista de descuentos aplicados (cumpleaños, visitas, integrantes)
        booking.setTotalPrice(discountsList.toString()); // Lista de precios con descuento

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

    public Integer discountForNumOfPeople(int numOfPeople, int basePrice) {
        return restTemplate.getForObject("http://ms-discounts1/discounts1/discount/" + numOfPeople + "/" + basePrice, Integer.class);
    }

    public Integer discountForVisitsPerMonth(int visitsPerMonth, int basePrice) {
        return restTemplate.getForObject("http://ms-discounts2/discounts2/discount/" + visitsPerMonth + "/" + basePrice, Integer.class);
    }

    public Integer discountForBirthday(String clientBirthday, String bookingDayMonth, int basePrice) {
        return restTemplate.getForObject("http://ms-special-rates/special-rates/discount/" + clientBirthday + "/" + bookingDayMonth + "/" + basePrice, Integer.class);
    }

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
            totalWithIva.setLength(totalWithIva.length() - 1); // Elimina la última coma
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

    /**
     * Método para obtener una lista de reservas
     * @return lista de reservas
     */
    public List<EntityBooking> getBookings() {
        return repoBooking.findByBookingStatusContains("confirmada");
    }

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
    //    Métodos para x
    //------------------------------------------------------------
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
