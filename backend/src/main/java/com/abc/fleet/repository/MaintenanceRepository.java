package com.abc.fleet.repository;

import com.abc.fleet.entity.MaintenanceRecord;
import com.abc.fleet.entity.MaintenanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaintenanceRepository extends JpaRepository<MaintenanceRecord, Long> {

    List<MaintenanceRecord> findByReportedBy(String reportedBy);

    List<MaintenanceRecord> findByAssignedTo(String assignedTo);

    long countByStatus(MaintenanceStatus status);

    @Query("SELECT m FROM MaintenanceRecord m WHERE " +
           "LOWER(m.issueDescription) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(m.reportedBy) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(m.assignedTo) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(m.vehicle.registrationNumber) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<MaintenanceRecord> search(@Param("query") String query);
}
