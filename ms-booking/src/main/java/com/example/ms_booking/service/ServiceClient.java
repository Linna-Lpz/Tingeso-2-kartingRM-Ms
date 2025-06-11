package com.example.ms_booking.service;

import com.example.ms_booking.entity.EntityClient;
import com.example.ms_booking.repository.RepoClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ServiceClient {
    @Autowired
    private RepoClient repoClient;

    /**
     * Método para crear un nuevo cliente
     * @param client Cliente a crear
     */
    public void saveClient(EntityClient client) {
        String clientRUT = client.getClientRUT();
        String clientName = client.getClientName();
        String clientEmail = client.getClientEmail();
        String clientBirthday = client.getClientBirthday();
        System.out.println("Client RUT: " + clientRUT);
        System.out.println("Client Name: " + clientName);
        System.out.println("Client Email: " + clientEmail);
        System.out.println("Client Birthday: " + clientBirthday);

        // Validar que los campos no estén vacíos
        if (clientRUT == null || clientRUT.isEmpty() ||
                clientName == null || clientName.isEmpty() ||
                clientEmail == null || clientEmail.isEmpty() ||
                clientBirthday == null || clientBirthday.isEmpty()) {

            System.out.println("Debe ingresar todos los datos del cliente");
        } else {
            // Validar que el cliente no exista
            if (repoClient.findByClientRUT(clientRUT) != null) {
                System.out.println("El cliente ya existe");
            } else {
                client.setVisitsPerMonth(0);
                repoClient.save(client);
            }
        }
    }

    public EntityClient getClientByRut(String clientRUT) {
        EntityClient client = repoClient.findByClientRUT(clientRUT);
        if (client != null) {
            return client;
        } else {
            System.out.println("El cliente no está registrado");
            return null;
        }
    }

}
