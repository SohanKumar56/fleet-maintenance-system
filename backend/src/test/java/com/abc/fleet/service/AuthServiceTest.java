package com.abc.fleet.service;

import com.abc.fleet.dto.LoginRequest;
import com.abc.fleet.dto.LoginResponse;
import com.abc.fleet.entity.Role;
import com.abc.fleet.entity.User;
import com.abc.fleet.exception.AuthenticationException;
import com.abc.fleet.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    private User testUser;
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        testUser = new User("Test Manager", "manager1", "hashedPassword", Role.MANAGER);
        loginRequest = new LoginRequest("manager1", "manager123");
    }

    @Test
    void testValidLogin() {
        // Given
        when(userRepository.findByUsername("manager1")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("manager123", "hashedPassword")).thenReturn(true);
        when(jwtService.generateToken("manager1", Role.MANAGER)).thenReturn("mock-jwt-token");

        // When
        LoginResponse response = authService.login(loginRequest);

        // Then
        assertNotNull(response);
        assertEquals("mock-jwt-token", response.getToken());
        assertEquals("manager1", response.getUsername());
        assertEquals("Test Manager", response.getFullName());
        assertEquals(Role.MANAGER, response.getRole());
    }

    @Test
    void testLoginWithWrongPassword() {
        // Given
        when(userRepository.findByUsername("manager1")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrongpassword", "hashedPassword")).thenReturn(false);

        LoginRequest wrongPasswordRequest = new LoginRequest("manager1", "wrongpassword");

        // When & Then
        AuthenticationException exception = assertThrows(AuthenticationException.class, 
                () -> authService.login(wrongPasswordRequest));
        assertEquals("Invalid username or password", exception.getMessage());
    }

    @Test
    void testLoginWithUnknownUser() {
        // Given
        when(userRepository.findByUsername("unknown")).thenReturn(Optional.empty());

        LoginRequest unknownUserRequest = new LoginRequest("unknown", "password");

        // When & Then
        AuthenticationException exception = assertThrows(AuthenticationException.class, 
                () -> authService.login(unknownUserRequest));
        assertEquals("Invalid username or password", exception.getMessage());
    }
}