package com.abc.fleet.service;

import com.abc.fleet.dto.VehicleRequest;
import com.abc.fleet.dto.VehicleResponse;
import com.abc.fleet.entity.Vehicle;
import com.abc.fleet.entity.VehicleStatus;
import com.abc.fleet.exception.ConflictException;
import com.abc.fleet.exception.ResourceNotFoundException;
import com.abc.fleet.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    public VehicleResponse create(VehicleRequest request) {
        if (vehicleRepository.existsByRegistrationNumber(request.getRegistrationNumber())) {
            throw new ConflictException("Vehicle with registration number '" +
                    request.getRegistrationNumber() + "' already exists");
        }
        Vehicle vehicle = new Vehicle();
        vehicle.setRegistrationNumber(request.getRegistrationNumber());
        vehicle.setModel(request.getModel());
        vehicle.setVehicleType(request.getVehicleType());
        vehicle.setCurrentMileage(request.getCurrentMileage());
        vehicle.setStatus(request.getStatus() != null ? request.getStatus() : VehicleStatus.ACTIVE);
        return VehicleResponse.from(vehicleRepository.save(vehicle));
    }

    public List<VehicleResponse> getAll() {
        return vehicleRepository.findAll().stream()
                .map(VehicleResponse::from)
                .collect(Collectors.toList());
    }

    public VehicleResponse getById(Long id) {
        return VehicleResponse.from(findOrThrow(id));
    }

    public VehicleResponse update(Long id, VehicleRequest request) {
        Vehicle vehicle = findOrThrow(id);

        // Check duplicate registration only if it changed
        if (!vehicle.getRegistrationNumber().equals(request.getRegistrationNumber())
                && vehicleRepository.existsByRegistrationNumber(request.getRegistrationNumber())) {
            throw new ConflictException("Registration number '" + request.getRegistrationNumber() + "' already in use");
        }

        vehicle.setRegistrationNumber(request.getRegistrationNumber());
        vehicle.setModel(request.getModel());
        vehicle.setVehicleType(request.getVehicleType());
        vehicle.setCurrentMileage(request.getCurrentMileage());
        if (request.getStatus() != null) {
            vehicle.setStatus(request.getStatus());
        }
        return VehicleResponse.from(vehicleRepository.save(vehicle));
    }

    public List<VehicleResponse> search(String query) {
        return vehicleRepository.search(query).stream()
                .map(VehicleResponse::from)
                .collect(Collectors.toList());
    }

    // Package-visible helper used by MaintenanceService
    Vehicle findOrThrow(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));
    }
}
