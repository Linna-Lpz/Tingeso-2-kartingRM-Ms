package com.example.ms_reports.service;

import com.example.ms_reports.dto.EntityBookingDTO;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class ServiceReport {

    private final RestTemplate restTemplate;

    public ServiceReport(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    private static final String STATUS_CONFIRMADA = "confirmada";

    /**
     * Método para obtener una LISTA de ingresos por mes según número de vueltas
     * [numVueltas, valor1, valor2, valor3, valor4, valor5, . . ., valor12, total]
     * @param lapsOrTimeMax número de vueltas o tiempo máximo
     * @return lista de ingresos por mes
     */
    public List<Integer> getIncomesForMonthOfLaps(Integer lapsOrTimeMax, Integer startMonth, Integer endMonth) {
        List<Integer> incomes = new ArrayList<>();
        Integer totalIncomes = 0;
        incomes.add(lapsOrTimeMax);
        while (startMonth <= endMonth) {
            String monthString = String.format("%02d", startMonth);
            Integer income = getIncomesForTimeAndMonth(lapsOrTimeMax, monthString);
            totalIncomes += income;
            incomes.add(income);
            startMonth++;
        }
        incomes.add(totalIncomes);
        return incomes;
    }

    /**
     * Método para sumar los ingresos totales de UN MES según número de vueltas
     * @param lapsOrTimeMax número de vueltas o tiempo máximo
     * @param month mes de la reserva
     * @return ingresos totales
     */
    public Integer getIncomesForTimeAndMonth(Integer lapsOrTimeMax, String month) {
        List<EntityBookingDTO> bookings = findByStatusAndDayAndLapsOrMaxTime(STATUS_CONFIRMADA, month, lapsOrTimeMax);
        Integer incomes = 0;
        for (EntityBookingDTO booking : bookings) {
            Integer numOfPeople = booking.getNumOfPeople();
            Integer price = Integer.parseInt(booking.getBasePrice());
            incomes += (price * numOfPeople);
        }
        return incomes;
    }

    /**
     * Método para SUMAR los ingresos totales de un mes para el reporte 1
     * @return lista de ingresos totales
     */
    public List<Integer> getIncomesForLapsOfMonth(Integer startMonth, Integer endMonth){
        int numMonths = endMonth - startMonth;
        List<Integer> totalIncomes = new ArrayList<>();
        for (int i = 1; i <= numMonths; i++){
            Integer value1 = getIncomesForMonthOfLaps(10, startMonth, endMonth).get(i);
            Integer value2 = getIncomesForMonthOfLaps(15, startMonth, endMonth).get(i);
            Integer value3 = getIncomesForMonthOfLaps(20, startMonth, endMonth).get(i);
            totalIncomes.add(value1 + value2 + value3);
        }
        Integer value1 = getIncomesForMonthOfLaps(10, startMonth, endMonth).get(numMonths + 1);
        Integer value2 = getIncomesForMonthOfLaps(15, startMonth, endMonth).get(numMonths + 1);
        Integer value3 = getIncomesForMonthOfLaps(20, startMonth, endMonth).get(numMonths + 1);
        totalIncomes.add(value1 + value2 + value3);
        return totalIncomes;
    }

    public List<EntityBookingDTO> findByStatusAndDayAndLapsOrMaxTime(String status, String month, Integer maxTimeAllowed){
        String url = "http://ms-booking/booking/findByStatusDayTimeAllowed/" + status + "/" + month + "/" + maxTimeAllowed;

        ResponseEntity<List<EntityBookingDTO>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<>() {
                }
        );

        return response.getBody();
    }

    // ------------------------- REPORTE 2 -----------------------------------------

    /**
     * Método para obtener una LISTA de ingresos por mes según número personas (1-2)
     * [10, valor1, valor2, valor3, valor4, valor5, . . ., valor12, total]
     * @param people número de personas
     * @param startMonth mes de inicio
     * @param endMonth mes de fin
     * @return lista de ingresos por mes
     */
    public List<Integer> getIncomesForMonthOfNumOfPeople(Integer people, Integer startMonth, Integer endMonth) {
        List<Integer> incomes = new ArrayList<>();
        Integer totalIncomes = 0;

        while (startMonth <= endMonth) {
            String monthString = String.format("%02d", startMonth);
            Integer income = getIncomesForNumOfPeople(people, monthString);
            totalIncomes += income;
            incomes.add(income);
            startMonth++;
        }
        incomes.add(totalIncomes);
        return incomes;
    }

    /**
     * Método para sumar los ingresos totales de UN MES según cantidad de personas
     * 1-2 personas: enero = $valor
     * @param people número de personas
     * @param month mes de la reserva
     * @return ingresos totales
     */
    public Integer getIncomesForNumOfPeople(Integer people, String month) {
        List<EntityBookingDTO> bookings;
        if (people == 1 || people == 2) {
            bookings = findByStatusAndDayAndNumOfPeople1or2(STATUS_CONFIRMADA, month, people);
        } else if (people >= 3 && people <= 5) {
            bookings = findByStatusAndDayAndNumOfPeople3to5(STATUS_CONFIRMADA, month, people);
        } else if (people >= 6 && people <= 10) {
            bookings = findByStatusAndDayAndNumOfPeople6to10(STATUS_CONFIRMADA, month, people);
        } else if (people >= 11 && people <= 15) {
            bookings = findByStatusAndDayAndNumOfPeople11to15(STATUS_CONFIRMADA, month, people);
        } else {
            throw new IllegalArgumentException("Número de personas no válido");
        }
        Integer incomes = 0;
        for (EntityBookingDTO booking : bookings) {
            Integer numOfPeople = booking.getNumOfPeople();
            Integer price = Integer.parseInt(booking.getBasePrice());
            incomes += (price * numOfPeople);
        }
        return incomes;
    }

    /**
     * Método para SUMAR los ingresos totales de un mes para el reporte 2
     * @return lista de ingresos totales
     */
    public List<Integer> getIncomesForNumOfPeopleOfMonth(Integer startMonth, Integer endMonth){
        int numMonths = endMonth - startMonth;
        List<Integer> totalIncomes = new ArrayList<>();
        for (int i = 0; i < numMonths; i++){
            Integer value1 = getIncomesForMonthOfNumOfPeople(2, startMonth, endMonth).get(i);
            Integer value2 = getIncomesForMonthOfNumOfPeople(5, startMonth, endMonth).get(i);
            Integer value3 = getIncomesForMonthOfNumOfPeople(10, startMonth, endMonth).get(i);
            Integer value4 = getIncomesForMonthOfNumOfPeople(15, startMonth, endMonth).get(i);
            totalIncomes.add(value1 + value2 + value3 + value4);
        }
        Integer value1 = getIncomesForMonthOfNumOfPeople(2, startMonth, endMonth).get(numMonths + 1);
        Integer value2 = getIncomesForMonthOfNumOfPeople(5, startMonth, endMonth).get(numMonths + 1);
        Integer value3 = getIncomesForMonthOfNumOfPeople(10, startMonth, endMonth).get(numMonths + 13);
        Integer value4 = getIncomesForMonthOfNumOfPeople(15, startMonth, endMonth).get(numMonths + 1);
        totalIncomes.add(value1 + value2 + value3 + value4);
        return totalIncomes;
    }

    public List<EntityBookingDTO> findByStatusAndDayAndNumOfPeople1or2(String status, String month, Integer numOfPeople){
        String url = "http://ms-booking/booking/findByStatusDayPeople1/" + status + "/" + month + "/" + numOfPeople;

        ResponseEntity<List<EntityBookingDTO>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<>() {
                }
        );

        return response.getBody();
    }

    public List<EntityBookingDTO> findByStatusAndDayAndNumOfPeople3to5(String status, String month, Integer numOfPeople){
        String url = "http://ms-booking/booking/findByStatusDayPeople2/" + status + "/" + month + "/" + numOfPeople;

        ResponseEntity<List<EntityBookingDTO>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<>() {
                }
        );

        return response.getBody();
    }

    public List<EntityBookingDTO> findByStatusAndDayAndNumOfPeople6to10(String status, String month, Integer numOfPeople){
        String url = "http://ms-booking/booking/findByStatusDayPeople3/" + status + "/" + month + "/" + numOfPeople;

        ResponseEntity<List<EntityBookingDTO>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<>() {
                }
        );

        return response.getBody();
    }

    public List<EntityBookingDTO> findByStatusAndDayAndNumOfPeople11to15(String status, String month, Integer numOfPeople){
        String url = "http://ms-booking/booking/findByStatusDayPeople4/" + status + "/" + month + "/" + numOfPeople;

        ResponseEntity<List<EntityBookingDTO>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<>() {
                }
        );

        return response.getBody();
    }
}
