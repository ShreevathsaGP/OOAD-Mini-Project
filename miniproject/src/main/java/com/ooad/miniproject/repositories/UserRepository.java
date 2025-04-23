package com.ooad.miniproject.repositories;

import com.ooad.miniproject.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    
    /**
     * Find a user by username (exact match)
     * @param username The username to search for
     * @return Optional containing user if found
     */
    Optional<User> findByUsername(String username);

    /**
     * Check if a username exists
     * @param username Username to check
     * @return true if username exists
     */
    boolean existsByUsername(String username);

    /**
     * Find users by role (PASSENGER/TC/ADMIN)
     * @param role Role to filter by
     * @return List of users with matching role
     */
    List<User> findByRole(String role);
}