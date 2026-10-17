package com.abc.fleet.controller;

import com.abc.fleet.dto.VehicleRequest;
import com.abc.fleet.dto.VehicleResponse;
import com.abc.fleet.service.VehicleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    @Autowired
    private VehicleService vehicleService;

    @PostMapping
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<VehicleResponse> create(@Valid @RequestBody VehicleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(vehicleService.create(request));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('MANAGER', 'DRIVER', 'MECHANIC')")
    public List<VehicleResponse> getAll() {
        return vehicleService.getAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('MANAGER', 'DRIVER', 'MECHANIC')")
    public VehicleResponse getById(@PathVariable Long id) {
        return vehicleService.getById(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    public VehicleResponse update(@PathVariable Long id, @Valid @RequestBody VehicleRequest request) {
        return vehicleService.update(id, request);
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('MANAGER', 'DRIVER', 'MECHANIC')")
    public List<VehicleResponse> search(@RequestParam String query) {
        return vehicleService.search(query);
    }
}
