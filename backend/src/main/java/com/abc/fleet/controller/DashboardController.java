package com.abc.fleet.controller;

import com.abc.fleet.dto.DashboardResponse;
import com.abc.fleet.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/summary")
    @PreAuthorize("hasRole('MANAGER')")
    public DashboardResponse getSummary() {
        return dashboardService.getSummary();
    }
}
