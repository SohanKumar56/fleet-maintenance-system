package com.abc.fleet.dto;

import com.abc.fleet.entity.VehicleStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class VehicleRequest {

    @NotBlank(message = "Registration number is required")
    private String registrationNumber;

    @NotBlank(message = "Model is required")
    private String model;

    @NotBlank(message = "Vehicle type is required")
    private String vehicleType;

    @NotNull(message = "Current mileage is required")
    @Min(value = 0, message = "Mileage cannot be negative")
    private Integer currentMileage;

    private VehicleStatus status;

    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }

    public Integer getCurrentMileage() { return currentMileage; }
    public void setCurrentMileage(Integer currentMileage) { this.currentMileage = currentMileage; }

    public VehicleStatus getStatus() { return status; }
    public void setStatus(VehicleStatus status) { this.status = status; }
}
