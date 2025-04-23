package com.ooad.miniproject.controllers;

import com.ooad.miniproject.models.User;
import com.ooad.miniproject.repositories.UserRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserRepository userRepository;

    // Constructor injection
    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Register a new passenger with username and password
     * @param request {username, password}
     * @return Created user (without password)
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerPassenger(@RequestBody RegisterRequest request) {
        // Validate input
        if (request.username() == null || request.password() == null) {
            return ResponseEntity.badRequest().body("Username and password are required");
        }

        // Check if username exists
        if (userRepository.existsByUsername(request.username())) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        // Create and save user
        User newUser = new User(
            request.username(),
            request.password(), // Stored as plaintext (per requirements)
            "PASSENGER" // Default role
        );

        User savedUser = userRepository.save(newUser);
        
        // Return user without password (security best practice)
        return ResponseEntity.ok(new UserResponse(
            savedUser.getId(),
            savedUser.getUsername(),
            savedUser.getRole()
        ));
    }

    /**
     * Login a user with username and password
     * @param request {username, password}
     * @return User details if authentication is successful
     */
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {
        // Validate input
        if (request.username() == null || request.password() == null) {
            return ResponseEntity.badRequest().body("Username and password are required");
        }

        // Find user by username
        var optionalUser = userRepository.findByUsername(request.username());
        if (optionalUser.isEmpty() || !optionalUser.get().getPassword().equals(request.password())) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }

        User user = optionalUser.get();
        // Return user details (excluding password)
        return ResponseEntity.ok(new UserResponse(
            user.getId(),
            user.getUsername(),
            user.getRole()
        ));
    }

    /**
     * Get username by user ID
     * @param userId User ID
     * @return Username if user exists
     */
    @GetMapping("/{userId}/username")
    public ResponseEntity<?> getUsernameById(@PathVariable String userId) {
        // Find user by ID
        var optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        // Return username
        return ResponseEntity.ok(optionalUser.get().getUsername());
    }
}

// Request/Response DTOs
record RegisterRequest(String username, String password) {} // Request DTO
record UserResponse(String id, String username, String role) {} // Response DTO
record LoginRequest(String username, String password) {} // Login Request DTO