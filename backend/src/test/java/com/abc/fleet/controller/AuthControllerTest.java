package com.abc.fleet.controller;

import com.abc.fleet.dto.LoginRequest;
import com.abc.fleet.dto.LoginResponse;
import com.abc.fleet.entity.Role;
import com.abc.fleet.exception.AuthenticationException;
import com.abc.fleet.exception.GlobalExceptionHandler;
import com.abc.fleet.service.AuthService;
import com.abc.fleet.service.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@Import(GlobalExceptionHandler.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtService jwtService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser
    void testSuccessfulLogin() throws Exception {
        LoginRequest loginRequest = new LoginRequest("manager1", "manager123");
        LoginResponse loginResponse = new LoginResponse("mock-jwt-token", "manager1", "Test Manager", Role.MANAGER);

        when(authService.login(any(LoginRequest.class))).thenReturn(loginResponse);

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest))
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("mock-jwt-token"))
                .andExpect(jsonPath("$.username").value("manager1"))
                .andExpect(jsonPath("$.fullName").value("Test Manager"))
                .andExpect(jsonPath("$.role").value("MANAGER"));
    }

    @Test
    @WithMockUser
    void testLoginWithInvalidCredentials() throws Exception {
        LoginRequest loginRequest = new LoginRequest("manager1", "wrongpassword");

        when(authService.login(any(LoginRequest.class)))
                .thenThrow(new AuthenticationException("Invalid username or password"));

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest))
                .with(csrf()))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.message").value("Invalid username or password"));
    }

    @Test
    @WithMockUser
    void testLoginWithBlankFields() throws Exception {
        LoginRequest loginRequest = new LoginRequest("", "");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest))
                .with(csrf()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }
}
