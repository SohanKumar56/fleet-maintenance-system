package com.abc.fleet.dto;

import com.abc.fleet.entity.MaintenanceType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class MaintenanceRequest {

    @NotNull(message = "Vehicle ID is required")
    private Long vehicleId;

    @NotBlank(message = "Issue description is required")
    private String issueDescription;

    @NotNull(message = "Maintenance type is required")
    private MaintenanceType maintenanceType;

    public Long getVehicleId() { return vehicleId; }
    public void setVehicleId(Long vehicleId) { this.vehicleId = vehicleId; }

    public String getIssueDescription() { return issueDescription; }
    public void setIssueDescription(String issueDescription) { this.issueDescription = issueDescription; }

    public MaintenanceType getMaintenanceType() { return maintenanceType; }
    public void setMaintenanceType(MaintenanceType maintenanceType) { this.maintenanceType = maintenanceType; }
}
