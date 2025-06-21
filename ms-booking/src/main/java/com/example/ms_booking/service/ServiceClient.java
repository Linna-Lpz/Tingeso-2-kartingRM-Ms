package com.example.ms_booking.service;

import com.example.ms_booking.entity.EntityClient;
import com.example.ms_booking.repository.RepoClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;

@Service
public class ServiceClient {
    @Autowired
    private RepoClient repoClient;

    /**
     * Método para crear un nuevo cliente
     * @param client Cliente a crear
     */
    public void saveClient(EntityClient client) {
        if ( validateRut(client.getClientRUT()) && validateName(client.getClientName()) &&
                validateBirthday(client.getClientBirthday()) && validateEmail(client.getClientEmail())) {
            System.out.println("El cliente es válido");
            client.setVisitsPerMonth(0);
            repoClient.save(client);
        } else {
            System.out.println("El cliente no es válido");
        }
    }

    /**
     * Método para obtener un cliente por su RUT
     * @param clientRUT RUT del cliente a buscar
     * @return Cliente encontrado o null si no existe
     */
    public EntityClient getClientByRut(String clientRUT) {
        EntityClient client = repoClient.findByClientRUT(clientRUT);
        if (client != null) {
            return client;
        } else {
            System.out.println("El cliente no está registrado");
            return null;
        }
    }

    /**
     * Método para validar el RUT del cliente
     * @param clientRUT RUT del cliente a validar
     * @return true si el RUT es válido, false en caso contrario
     */
    public boolean validateRut(String clientRUT){
        // Validar que el RUT no esté vacío
        if (clientRUT == null || clientRUT.isEmpty()) {
            System.out.println("Debe ingresar un RUT");
            return false;
        }

        // Validar que el RUT tenga el formato correcto
        if (!clientRUT.matches("\\d{1,8}-[\\dkK]")) {
            System.out.println("El RUT debe tener el formato correcto (12345678-9)");
            return false;
        }

        // Validar que el RUT no exista en la base de datos
        if (repoClient.findByClientRUT(clientRUT) != null) {
            System.out.println("El RUT ya está registrado");
            return false;
        }

        return true;
    }

    /**
     * Método para validar el email del cliente
     * @param clientEmail Email del cliente a validar
     * @return true si el email es válido, false en caso contrario
     */
    public boolean validateEmail(String clientEmail) {
        // Validar que el email no esté vacío
        if (clientEmail == null || clientEmail.isEmpty()) {
            System.out.println("Debe ingresar un email");
            return false;
        }

        // Validar que el email tenga el formato correcto
        if (!clientEmail.matches("^[\\w-\\.]+@[\\w-]+\\.[a-zA-Z]{2,}$")) {
            System.out.println("El email debe tener el formato correcto");
            return false;
        }
        return true;
    }

    /**
     * Método para validar el nombre del cliente
     * @param clientName Nombre del cliente a validar
     * @return true si el nombre es válido, false en caso contrario
     */
    public boolean validateName(String clientName) {
        // Validar que el nombre no esté vacío
        if (clientName == null || clientName.isEmpty()) {
            System.out.println("Debe ingresar un nombre");
            return false;
        }

        // Validar que el nombre tenga al menos 3 caracteres
        if (clientName.length() < 3) {
            System.out.println("El nombre debe tener al menos 3 caracteres");
            return false;
        }

        // Validar que el nombre no contenga números
        if (!clientName.matches("[a-zA-Z ]+")) {
            System.out.println("El nombre no debe contener números");
            return false;
        }
        return true;
    }

    /**
     * Método para validar la fecha de nacimiento del cliente
     * @param clientBirthday Fecha de nacimiento del cliente a validar
     * @return true si la fecha de nacimiento es válida, false en caso contrario
     */
    public boolean validateBirthday(String clientBirthday) {
        // Validar que la fecha de nacimiento no esté vacía
        if (clientBirthday == null || clientBirthday.isEmpty()) {
            System.out.println("Debe ingresar una fecha de nacimiento");
            return false;
        }

        // Validar que la fecha de nacimiento esté en un rango válido
        try {
            LocalDate birthday = LocalDate.parse(clientBirthday);
            LocalDate today = LocalDate.now();
            LocalDate maxAgeYear = today.minusYears(100);
            LocalDate minAgeYear = today.minusYears(10);

            if (birthday.isBefore(maxAgeYear) || birthday.isAfter(minAgeYear)) {
                System.out.println("La edad del cliente debe estar entre 10 y 100 años");
                return false;
            }
        } catch (DateTimeParseException e) {
            System.out.println("La fecha de nacimiento debe tener el formato correcto (YYYY-MM-DD)");
            return false;
        }
        return true;
    }
}
