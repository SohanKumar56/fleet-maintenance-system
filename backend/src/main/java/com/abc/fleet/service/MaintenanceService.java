package com.abc.fleet.service;

import com.abc.fleet.dto.AssignRequest;
import com.abc.fleet.dto.MaintenanceRequest;
import com.abc.fleet.dto.MaintenanceResponse;
import com.abc.fleet.entity.*;
import com.abc.fleet.exception.InvalidTransitionException;
import com.abc.fleet.exception.ResourceNotFoundException;
import com.abc.fleet.repository.MaintenanceRepository;
import com.abc.fleet.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MaintenanceService {

    @Autowired
    private MaintenanceRepository maintenanceRepository;

    @Autowired
    private VehicleService vehicleService;

    @Autowired
    private UserRepository userRepository;

    /** Driver creates a new maintenance report. reportedBy comes from JWT principal. */
    public MaintenanceResponse create(MaintenanceRequest req, String reportedBy) {
        Vehicle vehicle = vehicleService.findOrThrow(req.getVehicleId());

        MaintenanceRecord record = new MaintenanceRecord();
        record.setVehicle(vehicle);
        record.setIssueDescription(req.getIssueDescription());
        record.setMaintenanceType(req.getMaintenanceType());
        record.setStatus(MaintenanceStatus.OPEN);
        record.setReportedBy(reportedBy);

        return MaintenanceResponse.from(maintenanceRepository.save(record));
    }

    public List<MaintenanceResponse> getAll() {
        return maintenanceRepository.findAll().stream()
                .map(MaintenanceResponse::from)
                .collect(Collectors.toList());
    }

    public MaintenanceResponse getById(Long id) {
        return MaintenanceResponse.from(findOrThrow(id));
    }

    /** Returns records reported by the given driver */
    public List<MaintenanceResponse> getByDriver(String username) {
        return maintenanceRepository.findByReportedBy(username).stream()
                .map(MaintenanceResponse::from)
                .collect(Collectors.toList());
    }

    /** Returns records assigned to the given mechanic */
    public List<MaintenanceResponse> getByMechanic(String username) {
        return maintenanceRepository.findByAssignedTo(username).stream()
                .map(MaintenanceResponse::from)
                .collect(Collectors.toList());
    }

    public List<MaintenanceResponse> search(String query) {
        return maintenanceRepository.search(query).stream()
                .map(MaintenanceResponse::from)
                .collect(Collectors.toList());
    }

    /** MANAGER: OPEN → ASSIGNED */
    public MaintenanceResponse assign(Long id, AssignRequest req) {
        MaintenanceRecord record = findOrThrow(id);
        requireStatus(record, MaintenanceStatus.OPEN, "assign");

        // Verify mechanic exists and has MECHANIC role
        userRepository.findByUsername(req.getMechanicUsername())
                .filter(u -> u.getRole() == Role.MECHANIC)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Mechanic not found: " + req.getMechanicUsername()));

        record.setAssignedTo(req.getMechanicUsername());
        record.setStatus(MaintenanceStatus.ASSIGNED);
        return MaintenanceResponse.from(maintenanceRepository.save(record));
    }

    /** MECHANIC: ASSIGNED → IN_PROGRESS. Only the assigned mechanic can start. */
    public MaintenanceResponse start(Long id, String mechanicUsername) {
        MaintenanceRecord record = findOrThrow(id);
        requireStatus(record, MaintenanceStatus.ASSIGNED, "start");
        requireAssignedTo(record, mechanicUsername);

        record.setStatus(MaintenanceStatus.IN_PROGRESS);
        return MaintenanceResponse.from(maintenanceRepository.save(record));
    }

    /** MECHANIC: IN_PROGRESS → COMPLETED. Only the assigned mechanic can complete. */
    public MaintenanceResponse complete(Long id, String mechanicUsername) {
        MaintenanceRecord record = findOrThrow(id);
        requireStatus(record, MaintenanceStatus.IN_PROGRESS, "complete");
        requireAssignedTo(record, mechanicUsername);

        record.setStatus(MaintenanceStatus.COMPLETED);
        return MaintenanceResponse.from(maintenanceRepository.save(record));
    }

    /** MANAGER: COMPLETED → CLOSED */
    public MaintenanceResponse close(Long id) {
        MaintenanceRecord record = findOrThrow(id);
        requireStatus(record, MaintenanceStatus.COMPLETED, "close");

        record.setStatus(MaintenanceStatus.CLOSED);
        return MaintenanceResponse.from(maintenanceRepository.save(record));
    }

    // ---- helpers ----

    MaintenanceRecord findOrThrow(Long id) {
        return maintenanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance record not found: " + id));
    }

    private void requireStatus(MaintenanceRecord record, MaintenanceStatus expected, String action) {
        if (record.getStatus() != expected) {
            throw new InvalidTransitionException(
                    "Cannot " + action + " a record with status " + record.getStatus() +
                    ". Required status: " + expected);
        }
    }

    private void requireAssignedTo(MaintenanceRecord record, String username) {
        if (!username.equals(record.getAssignedTo())) {
            throw new InvalidTransitionException("You are not assigned to this maintenance record");
        }
    }
}
