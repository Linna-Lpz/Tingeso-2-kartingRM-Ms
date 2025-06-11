package com.example.ms_booking.repository;

import com.example.ms_booking.entity.EntityClient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RepoClient extends JpaRepository<EntityClient, Long> {
    EntityClient findByClientRUT(String clientRUT);
}
