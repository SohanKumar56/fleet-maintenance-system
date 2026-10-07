package com.abc.fleet.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "vehicles")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "registration_number", nullable = false, unique = true)
    private String registrationNumber;

    @Column(name = "model", nullable = false)
    private String model;

    @Column(name = "vehicle_type", nullable = false)
    private String vehicleType;

    @Column(name = "current_mileage", nullable = false)
    private Integer currentMileage = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private VehicleStatus status = VehicleStatus.ACTIVE;

    public Vehicle() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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
