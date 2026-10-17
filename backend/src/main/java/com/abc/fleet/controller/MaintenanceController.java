package com.abc.fleet.controller;

import com.abc.fleet.dto.AssignRequest;
import com.abc.fleet.dto.MaintenanceRequest;
import com.abc.fleet.dto.MaintenanceResponse;
import com.abc.fleet.service.MaintenanceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
public class MaintenanceController {

    @Autowired
    private MaintenanceService maintenanceService;

    /** DRIVER: Create a new maintenance report */
    @PostMapping
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<MaintenanceResponse> create(
            @Valid @RequestBody MaintenanceRequest request,
            @AuthenticationPrincipal String username) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(maintenanceService.create(request, username));
    }

    /** MANAGER: View all records */
    @GetMapping
    @PreAuthorize("hasRole('MANAGER')")
    public List<MaintenanceResponse> getAll() {
        return maintenanceService.getAll();
    }

    /** MANAGER: Get by id */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('MANAGER', 'DRIVER', 'MECHANIC')")
    public MaintenanceResponse getById(@PathVariable Long id) {
        return maintenanceService.getById(id);
    }

    /** DRIVER: My own reports */
    @GetMapping("/my-reports")
    @PreAuthorize("hasRole('DRIVER')")
    public List<MaintenanceResponse> myReports(@AuthenticationPrincipal String username) {
        return maintenanceService.getByDriver(username);
    }

    /** MECHANIC: My assigned jobs */
    @GetMapping("/my-jobs")
    @PreAuthorize("hasRole('MECHANIC')")
    public List<MaintenanceResponse> myJobs(@AuthenticationPrincipal String username) {
        return maintenanceService.getByMechanic(username);
    }

    /** MANAGER: Search */
    @GetMapping("/search")
    @PreAuthorize("hasRole('MANAGER')")
    public List<MaintenanceResponse> search(@RequestParam String query) {
        return maintenanceService.search(query);
    }

    /** MANAGER: OPEN → ASSIGNED */
    @PutMapping("/{id}/assign")
    @PreAuthorize("hasRole('MANAGER')")
    public MaintenanceResponse assign(@PathVariable Long id,
                                      @Valid @RequestBody AssignRequest request) {
        return maintenanceService.assign(id, request);
    }

    /** MECHANIC: ASSIGNED → IN_PROGRESS */
    @PutMapping("/{id}/start")
    @PreAuthorize("hasRole('MECHANIC')")
    public MaintenanceResponse start(@PathVariable Long id,
                                     @AuthenticationPrincipal String username) {
        return maintenanceService.start(id, username);
    }

    /** MECHANIC: IN_PROGRESS → COMPLETED */
    @PutMapping("/{id}/complete")
    @PreAuthorize("hasRole('MECHANIC')")
    public MaintenanceResponse complete(@PathVariable Long id,
                                        @AuthenticationPrincipal String username) {
        return maintenanceService.complete(id, username);
    }

    /** MANAGER: COMPLETED → CLOSED */
    @PutMapping("/{id}/close")
    @PreAuthorize("hasRole('MANAGER')")
    public MaintenanceResponse close(@PathVariable Long id) {
        return maintenanceService.close(id);
    }
}
