package com.abc.fleet.dto;

import com.abc.fleet.entity.Vehicle;
import com.abc.fleet.entity.VehicleStatus;

public class VehicleResponse {

    private Long id;
    private String registrationNumber;
    private String model;
    private String vehicleType;
    private Integer currentMileage;
    private VehicleStatus status;

    public static VehicleResponse from(Vehicle v) {
        VehicleResponse r = new VehicleResponse();
        r.id = v.getId();
        r.registrationNumber = v.getRegistrationNumber();
        r.model = v.getModel();
        r.vehicleType = v.getVehicleType();
        r.currentMileage = v.getCurrentMileage();
        r.status = v.getStatus();
        return r;
    }

    public Long getId() { return id; }
    public String getRegistrationNumber() { return registrationNumber; }
    public String getModel() { return model; }
    public String getVehicleType() { return vehicleType; }
    public Integer getCurrentMileage() { return currentMileage; }
    public VehicleStatus getStatus() { return status; }
}
