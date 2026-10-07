package com.abc.fleet.service;

import com.abc.fleet.dto.LoginRequest;
import com.abc.fleet.dto.LoginResponse;
import com.abc.fleet.entity.User;
import com.abc.fleet.exception.AuthenticationException;
import com.abc.fleet.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    public LoginResponse login(LoginRequest loginRequest) {
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new AuthenticationException("Invalid username or password"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPasswordHash())) {
            throw new AuthenticationException("Invalid username or password");
        }

        String token = jwtService.generateToken(user.getUsername(), user.getRole());

        return new LoginResponse(token, user.getUsername(), user.getFullName(), user.getRole());
    }
}