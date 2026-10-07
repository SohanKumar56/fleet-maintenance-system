package com.abc.fleet.dto;

import jakarta.validation.constraints.NotBlank;

public class AssignRequest {

    @NotBlank(message = "Mechanic username is required")
    private String mechanicUsername;

    public String getMechanicUsername() { return mechanicUsername; }
    public void setMechanicUsername(String mechanicUsername) { this.mechanicUsername = mechanicUsername; }
}
