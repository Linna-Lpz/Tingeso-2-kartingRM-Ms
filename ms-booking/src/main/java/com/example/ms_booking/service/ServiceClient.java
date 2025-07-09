package com.example.ms_booking.service;

import com.example.ms_booking.entity.EntityClient;
import com.example.ms_booking.exception.ClientValidationException;
import com.example.ms_booking.repository.RepoClient;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;

@Service
public class ServiceClient {

    private final RepoClient repoClient;

    public ServiceClient(RepoClient repoClient) {
        this.repoClient = repoClient;
    }

    /**
     * Método para crear un nuevo cliente
     * @param client Cliente a crear
     */
    public void saveClient(EntityClient client) {
        String rut = convertRut(client.getClientRUT());

        if (validateRut(rut) &&
            validateName(client.getClientName()) &&
            validateBirthday(client.getClientBirthday()) &&
            validateEmail(client.getClientEmail())) {
            client.setVisitsPerMonth(0);

            repoClient.save(client);
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
            String rutFormatted = convertRut(clientRUT);
            client = repoClient.findByClientRUT(rutFormatted);
            if (client != null) {
                return client;
            } else {
                throw new ClientValidationException("El cliente no está registrado");
            }

        }
    }

    /**
     * Método para convertir el dígito verificador de un RUT a mayúscula
     * @param clientRUT RUT del cliente a convertir
     * @return RUT en formato estándar (sin puntos y con guion)
     */
    public String convertRut(String clientRUT) {
        if (clientRUT != null && clientRUT.contains("-")) {
            String[] parts = clientRUT.split("-");
            if (parts.length == 2) {
                String dv = parts[1].toUpperCase();
                clientRUT = parts[0] + "-" + dv;
                return clientRUT;
            }
        }
        return "";
    }

    /**
     * Método para validar el RUT del cliente
     * @param clientRUT RUT del cliente a validar
     * @return true si el RUT es válido, false en caso contrario
     */
    public boolean validateRut(String clientRUT){
        // Validar que el RUT no esté vacío
        if (clientRUT == null || clientRUT.isEmpty()) {
            throw new ClientValidationException("Debe ingresar un RUT");
        }

        // Validar que el RUT tenga el formato correcto
        if (!clientRUT.matches("\\d{1,8}-[\\dkK]")) {
            throw new ClientValidationException("El RUT debe tener el formato correcto (12345678-9)");
        }

        // Validar que el RUT no exista en la base de datos
        if (repoClient.findByClientRUT(clientRUT) != null) {
            throw new ClientValidationException("El RUT ya está registrado");
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
            throw new ClientValidationException("Debe ingresar un email");
        }

        // Validar que el email tenga el formato correcto
        if (!clientEmail.matches("^[\\w-\\.]+@[\\w-]+\\.[a-zA-Z]{2,}$")) {
            throw new ClientValidationException("El email debe tener el formato correcto");
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
            throw new ClientValidationException("Debe ingresar un nombre");
        }

        // Validar que el nombre tenga al menos 3 caracteres
        if (clientName.length() < 3) {
            throw new ClientValidationException("El nombre debe tener al menos 3 caracteres");
        }

        // Validar que el nombre no contenga números
        if (!clientName.matches("[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ ]+")) {
            throw new ClientValidationException("El nombre no debe contener números ni caracteres especiales");
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
            throw new ClientValidationException("Debe ingresar una fecha de nacimiento");
        }

        // Validar que la fecha de nacimiento esté en un rango válido
        try {
            LocalDate birthday = LocalDate.parse(clientBirthday);
            LocalDate today = LocalDate.now();
            LocalDate maxAgeYear = today.minusYears(100);
            LocalDate minAgeYear = today.minusYears(10);

            if (birthday.isBefore(maxAgeYear) || birthday.isAfter(minAgeYear)) {
                throw new ClientValidationException("La edad del cliente debe estar entre 10 y 100 años");
            }
        } catch (DateTimeParseException e) {
            throw new ClientValidationException("La fecha de nacimiento debe tener el formato correcto (YYYY-MM-DD)");
        }
        return true;
    }
}
