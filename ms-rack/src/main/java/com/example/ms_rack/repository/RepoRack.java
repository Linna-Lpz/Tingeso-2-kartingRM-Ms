package com.example.ms_rack.repository;

import com.example.ms_rack.entity.EntityRack;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepoRack extends JpaRepository<EntityRack, Long> {
    @Query("SELECT b FROM EntityRack b WHERE b.bookingStatus = ?1 AND MONTH(b.bookingDate) = ?2 AND YEAR(b.bookingDate) = ?3")
    List<EntityRack> findByStatusAndMonthAndYear(String status, String month, String year);
}
