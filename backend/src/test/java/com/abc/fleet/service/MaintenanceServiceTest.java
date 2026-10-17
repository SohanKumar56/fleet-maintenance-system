package com.abc.fleet.service;

import com.abc.fleet.dto.AssignRequest;
import com.abc.fleet.dto.MaintenanceRequest;
import com.abc.fleet.dto.MaintenanceResponse;
import com.abc.fleet.entity.*;
import com.abc.fleet.exception.InvalidTransitionException;
import com.abc.fleet.exception.ResourceNotFoundException;
import com.abc.fleet.repository.MaintenanceRepository;
import com.abc.fleet.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MaintenanceServiceTest {

    @Mock private MaintenanceRepository maintenanceRepository;
    @Mock private VehicleService vehicleService;
    @Mock private UserRepository userRepository;

    @InjectMocks
    private MaintenanceService maintenanceService;

    private Vehicle vehicle;
    private User mechanic;
    private MaintenanceRecord openRecord;
    private MaintenanceRecord assignedRecord;
    private MaintenanceRecord inProgressRecord;
    private MaintenanceRecord completedRecord;

    @BeforeEach
    void setUp() {
        vehicle = new Vehicle();
        vehicle.setId(1L);
        vehicle.setRegistrationNumber("KA01AB1234");
        vehicle.setModel("Toyota Hilux");
        vehicle.setVehicleType("Truck");
        vehicle.setCurrentMileage(0);
        vehicle.setStatus(VehicleStatus.ACTIVE);

        mechanic = new User("Bob Mechanic", "mechanic1", "hash", Role.MECHANIC);
        mechanic.setId(3L);

        openRecord = buildRecord(1L, MaintenanceStatus.OPEN, "driver1", null);
        assignedRecord = buildRecord(2L, MaintenanceStatus.ASSIGNED, "driver1", "mechanic1");
        inProgressRecord = buildRecord(3L, MaintenanceStatus.IN_PROGRESS, "driver1", "mechanic1");
        completedRecord = buildRecord(4L, MaintenanceStatus.COMPLETED, "driver1", "mechanic1");
    }

    private MaintenanceRecord buildRecord(Long id, MaintenanceStatus status, String reportedBy, String assignedTo) {
        MaintenanceRecord r = new MaintenanceRecord();
        r.setId(id);
        r.setVehicle(vehicle);
        r.setIssueDescription("Engine issue");
        r.setMaintenanceType(MaintenanceType.CORRECTIVE);
        r.setStatus(status);
        r.setReportedBy(reportedBy);
        r.setAssignedTo(assignedTo);
        return r;
    }

    @Test
    void testCreateMaintenance() {
        MaintenanceRequest req = new MaintenanceRequest();
        req.setVehicleId(1L);
        req.setIssueDescription("Engine issue");
        req.setMaintenanceType(MaintenanceType.CORRECTIVE);

        when(vehicleService.findOrThrow(1L)).thenReturn(vehicle);
        when(maintenanceRepository.save(any())).thenReturn(openRecord);

        MaintenanceResponse response = maintenanceService.create(req, "driver1");

        assertEquals(MaintenanceStatus.OPEN, response.getStatus());
        assertEquals("driver1", response.getReportedBy());
    }

    @Test
    void testAssign_validTransition() {
        AssignRequest req = new AssignRequest();
        req.setMechanicUsername("mechanic1");

        when(maintenanceRepository.findById(1L)).thenReturn(Optional.of(openRecord));
        when(userRepository.findByUsername("mechanic1")).thenReturn(Optional.of(mechanic));
        when(maintenanceRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        MaintenanceResponse response = maintenanceService.assign(1L, req);

        assertEquals(MaintenanceStatus.ASSIGNED, response.getStatus());
        assertEquals("mechanic1", response.getAssignedTo());
    }

    @Test
    void testAssign_invalidTransition_alreadyAssigned() {
        AssignRequest req = new AssignRequest();
        req.setMechanicUsername("mechanic1");

        when(maintenanceRepository.findById(2L)).thenReturn(Optional.of(assignedRecord));

        assertThrows(InvalidTransitionException.class, () -> maintenanceService.assign(2L, req));
    }

    @Test
    void testStart_validTransition() {
        when(maintenanceRepository.findById(2L)).thenReturn(Optional.of(assignedRecord));
        when(maintenanceRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        MaintenanceResponse response = maintenanceService.start(2L, "mechanic1");

        assertEquals(MaintenanceStatus.IN_PROGRESS, response.getStatus());
    }

    @Test
    void testStart_wrongMechanic() {
        when(maintenanceRepository.findById(2L)).thenReturn(Optional.of(assignedRecord));

        assertThrows(InvalidTransitionException.class, () -> maintenanceService.start(2L, "mechanic2"));
    }

    @Test
    void testComplete_validTransition() {
        when(maintenanceRepository.findById(3L)).thenReturn(Optional.of(inProgressRecord));
        when(maintenanceRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        MaintenanceResponse response = maintenanceService.complete(3L, "mechanic1");

        assertEquals(MaintenanceStatus.COMPLETED, response.getStatus());
    }

    @Test
    void testClose_validTransition() {
        when(maintenanceRepository.findById(4L)).thenReturn(Optional.of(completedRecord));
        when(maintenanceRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        MaintenanceResponse response = maintenanceService.close(4L);

        assertEquals(MaintenanceStatus.CLOSED, response.getStatus());
    }

    @Test
    void testClose_invalidTransition_openRecord() {
        when(maintenanceRepository.findById(1L)).thenReturn(Optional.of(openRecord));

        assertThrows(InvalidTransitionException.class, () -> maintenanceService.close(1L));
    }

    @Test
    void testGetById_notFound() {
        when(maintenanceRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> maintenanceService.getById(99L));
    }
}
