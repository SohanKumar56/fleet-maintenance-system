package com.abc.fleet.dto;

public class DashboardResponse {

    private long totalVehicles;
    private long activeVehicles;
    private long vehiclesInMaintenance;
    private long inactiveVehicles;
    private long openMaintenance;
    private long assignedMaintenance;
    private long inProgressMaintenance;
    private long completedMaintenance;
    private long closedMaintenance;

    public long getTotalVehicles() { return totalVehicles; }
    public void setTotalVehicles(long v) { this.totalVehicles = v; }

    public long getActiveVehicles() { return activeVehicles; }
    public void setActiveVehicles(long v) { this.activeVehicles = v; }

    public long getVehiclesInMaintenance() { return vehiclesInMaintenance; }
    public void setVehiclesInMaintenance(long v) { this.vehiclesInMaintenance = v; }

    public long getInactiveVehicles() { return inactiveVehicles; }
    public void setInactiveVehicles(long v) { this.inactiveVehicles = v; }

    public long getOpenMaintenance() { return openMaintenance; }
    public void setOpenMaintenance(long v) { this.openMaintenance = v; }

    public long getAssignedMaintenance() { return assignedMaintenance; }
    public void setAssignedMaintenance(long v) { this.assignedMaintenance = v; }

    public long getInProgressMaintenance() { return inProgressMaintenance; }
    public void setInProgressMaintenance(long v) { this.inProgressMaintenance = v; }

    public long getCompletedMaintenance() { return completedMaintenance; }
    public void setCompletedMaintenance(long v) { this.completedMaintenance = v; }

    public long getClosedMaintenance() { return closedMaintenance; }
    public void setClosedMaintenance(long v) { this.closedMaintenance = v; }
}
