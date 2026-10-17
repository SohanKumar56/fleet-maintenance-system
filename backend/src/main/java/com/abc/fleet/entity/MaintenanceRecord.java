package com.abc.fleet.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "maintenance_records")
public class MaintenanceRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @Column(name = "issue_description", nullable = false, length = 1000)
    private String issueDescription;

    @Enumerated(EnumType.STRING)
    @Column(name = "maintenance_type", nullable = false)
    private MaintenanceType maintenanceType;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private MaintenanceStatus status = MaintenanceStatus.OPEN;

    // username of the driver who reported the issue
    @Column(name = "reported_by", nullable = false)
    private String reportedBy;

    // username of the mechanic assigned (nullable until assigned)
    @Column(name = "assigned_to")
    private String assignedTo;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public MaintenanceRecord() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Vehicle getVehicle() { return vehicle; }
    public void setVehicle(Vehicle vehicle) { this.vehicle = vehicle; }

    public String getIssueDescription() { return issueDescription; }
    public void setIssueDescription(String issueDescription) { this.issueDescription = issueDescription; }

    public MaintenanceType getMaintenanceType() { return maintenanceType; }
    public void setMaintenanceType(MaintenanceType maintenanceType) { this.maintenanceType = maintenanceType; }

    public MaintenanceStatus getStatus() { return status; }
    public void setStatus(MaintenanceStatus status) { this.status = status; }

    public String getReportedBy() { return reportedBy; }
    public void setReportedBy(String reportedBy) { this.reportedBy = reportedBy; }

    public String getAssignedTo() { return assignedTo; }
    public void setAssignedTo(String assignedTo) { this.assignedTo = assignedTo; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
