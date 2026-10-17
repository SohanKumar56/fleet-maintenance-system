package com.abc.fleet.repository;

import com.abc.fleet.entity.Vehicle;
import com.abc.fleet.entity.VehicleStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    Optional<Vehicle> findByRegistrationNumber(String registrationNumber);

    boolean existsByRegistrationNumber(String registrationNumber);

    long countByStatus(VehicleStatus status);

    @Query("SELECT v FROM Vehicle v WHERE " +
           "LOWER(v.registrationNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(v.model) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(v.vehicleType) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Vehicle> search(@Param("query") String query);
}
