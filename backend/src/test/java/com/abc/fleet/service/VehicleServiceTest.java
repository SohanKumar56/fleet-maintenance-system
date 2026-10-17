package com.abc.fleet.service;

import com.abc.fleet.dto.VehicleRequest;
import com.abc.fleet.dto.VehicleResponse;
import com.abc.fleet.entity.Vehicle;
import com.abc.fleet.entity.VehicleStatus;
import com.abc.fleet.exception.ConflictException;
import com.abc.fleet.exception.ResourceNotFoundException;
import com.abc.fleet.repository.VehicleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VehicleServiceTest {

    @Mock
    private VehicleRepository vehicleRepository;

    @InjectMocks
    private VehicleService vehicleService;

    private Vehicle sampleVehicle;

    @BeforeEach
    void setUp() {
        sampleVehicle = new Vehicle();
        sampleVehicle.setId(1L);
        sampleVehicle.setRegistrationNumber("KA01AB1234");
        sampleVehicle.setModel("Toyota Hilux");
        sampleVehicle.setVehicleType("Truck");
        sampleVehicle.setCurrentMileage(10000);
        sampleVehicle.setStatus(VehicleStatus.ACTIVE);
    }

    @Test
    void testCreateVehicle() {
        VehicleRequest request = new VehicleRequest();
        request.setRegistrationNumber("KA01AB1234");
        request.setModel("Toyota Hilux");
        request.setVehicleType("Truck");
        request.setCurrentMileage(10000);

        when(vehicleRepository.existsByRegistrationNumber("KA01AB1234")).thenReturn(false);
        when(vehicleRepository.save(any(Vehicle.class))).thenReturn(sampleVehicle);

        VehicleResponse response = vehicleService.create(request);

        assertNotNull(response);
        assertEquals("KA01AB1234", response.getRegistrationNumber());
        assertEquals("Toyota Hilux", response.getModel());
        assertEquals(VehicleStatus.ACTIVE, response.getStatus());
    }

    @Test
    void testCreateVehicle_duplicateRegistration() {
        VehicleRequest request = new VehicleRequest();
        request.setRegistrationNumber("KA01AB1234");
        request.setModel("Model");
        request.setVehicleType("Truck");
        request.setCurrentMileage(0);

        when(vehicleRepository.existsByRegistrationNumber("KA01AB1234")).thenReturn(true);

        assertThrows(ConflictException.class, () -> vehicleService.create(request));
    }

    @Test
    void testGetAll() {
        when(vehicleRepository.findAll()).thenReturn(List.of(sampleVehicle));

        List<VehicleResponse> result = vehicleService.getAll();

        assertEquals(1, result.size());
        assertEquals("KA01AB1234", result.get(0).getRegistrationNumber());
    }

    @Test
    void testGetById() {
        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(sampleVehicle));

        VehicleResponse response = vehicleService.getById(1L);

        assertEquals(1L, response.getId());
    }

    @Test
    void testGetById_notFound() {
        when(vehicleRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> vehicleService.getById(99L));
    }

    @Test
    void testUpdate() {
        VehicleRequest request = new VehicleRequest();
        request.setRegistrationNumber("KA01AB1234");
        request.setModel("Toyota Hilux Updated");
        request.setVehicleType("Truck");
        request.setCurrentMileage(15000);
        request.setStatus(VehicleStatus.MAINTENANCE);

        Vehicle updated = new Vehicle();
        updated.setId(1L);
        updated.setRegistrationNumber("KA01AB1234");
        updated.setModel("Toyota Hilux Updated");
        updated.setVehicleType("Truck");
        updated.setCurrentMileage(15000);
        updated.setStatus(VehicleStatus.MAINTENANCE);

        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(sampleVehicle));
        when(vehicleRepository.save(any(Vehicle.class))).thenReturn(updated);

        VehicleResponse response = vehicleService.update(1L, request);

        assertEquals("Toyota Hilux Updated", response.getModel());
        assertEquals(VehicleStatus.MAINTENANCE, response.getStatus());
    }

    @Test
    void testSearch() {
        when(vehicleRepository.search("Toyota")).thenReturn(List.of(sampleVehicle));

        List<VehicleResponse> result = vehicleService.search("Toyota");

        assertEquals(1, result.size());
    }
}
