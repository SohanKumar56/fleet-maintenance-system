package com.abc.fleet.service;

import com.abc.fleet.dto.DashboardResponse;
import com.abc.fleet.entity.MaintenanceStatus;
import com.abc.fleet.entity.VehicleStatus;
import com.abc.fleet.repository.MaintenanceRepository;
import com.abc.fleet.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private MaintenanceRepository maintenanceRepository;

    public DashboardResponse getSummary() {
        DashboardResponse r = new DashboardResponse();
        r.setTotalVehicles(vehicleRepository.count());
        r.setActiveVehicles(vehicleRepository.countByStatus(VehicleStatus.ACTIVE));
        r.setVehiclesInMaintenance(vehicleRepository.countByStatus(VehicleStatus.MAINTENANCE));
        r.setInactiveVehicles(vehicleRepository.countByStatus(VehicleStatus.INACTIVE));
        r.setOpenMaintenance(maintenanceRepository.countByStatus(MaintenanceStatus.OPEN));
        r.setAssignedMaintenance(maintenanceRepository.countByStatus(MaintenanceStatus.ASSIGNED));
        r.setInProgressMaintenance(maintenanceRepository.countByStatus(MaintenanceStatus.IN_PROGRESS));
        r.setCompletedMaintenance(maintenanceRepository.countByStatus(MaintenanceStatus.COMPLETED));
        r.setClosedMaintenance(maintenanceRepository.countByStatus(MaintenanceStatus.CLOSED));
        return r;
    }
}
