package com.abc.fleet.dto;

import com.abc.fleet.entity.MaintenanceRecord;
import com.abc.fleet.entity.MaintenanceStatus;
import com.abc.fleet.entity.MaintenanceType;

import java.time.LocalDateTime;

public class MaintenanceResponse {

    private Long id;
    private Long vehicleId;
    private String vehicleRegistration;
    private String vehicleModel;
    private String issueDescription;
    private MaintenanceType maintenanceType;
    private MaintenanceStatus status;
    private String reportedBy;
    private String assignedTo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static MaintenanceResponse from(MaintenanceRecord r) {
        MaintenanceResponse res = new MaintenanceResponse();
        res.id = r.getId();
        res.vehicleId = r.getVehicle().getId();
        res.vehicleRegistration = r.getVehicle().getRegistrationNumber();
        res.vehicleModel = r.getVehicle().getModel();
        res.issueDescription = r.getIssueDescription();
        res.maintenanceType = r.getMaintenanceType();
        res.status = r.getStatus();
        res.reportedBy = r.getReportedBy();
        res.assignedTo = r.getAssignedTo();
        res.createdAt = r.getCreatedAt();
        res.updatedAt = r.getUpdatedAt();
        return res;
    }

    public Long getId() { return id; }
    public Long getVehicleId() { return vehicleId; }
    public String getVehicleRegistration() { return vehicleRegistration; }
    public String getVehicleModel() { return vehicleModel; }
    public String getIssueDescription() { return issueDescription; }
    public MaintenanceType getMaintenanceType() { return maintenanceType; }
    public MaintenanceStatus getStatus() { return status; }
    public String getReportedBy() { return reportedBy; }
    public String getAssignedTo() { return assignedTo; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
