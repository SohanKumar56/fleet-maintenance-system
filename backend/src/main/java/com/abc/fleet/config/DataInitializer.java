package com.abc.fleet.config;

import com.abc.fleet.entity.Role;
import com.abc.fleet.entity.User;
import com.abc.fleet.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements ApplicationRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        if (userRepository.count() == 0) {
            // Create sample users with BCrypt-hashed passwords
            createUser("John Manager", "manager1", "manager123", Role.MANAGER);
            createUser("Alice Driver", "driver1", "driver123", Role.DRIVER);
            createUser("Bob Mechanic", "mechanic1", "mechanic123", Role.MECHANIC);
            
            System.out.println("Sample users created successfully!");
        }
    }

    private void createUser(String fullName, String username, String password, Role role) {
        String hashedPassword = passwordEncoder.encode(password);
        User user = new User(fullName, username, hashedPassword, role);
        userRepository.save(user);
    }
}