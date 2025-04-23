package com.ooad.miniproject.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String username;
    private String password;
    private String role;

    public User() {}

    public User(String username, String password, String role) {
        this.username = username;
        this.password = password;
        this.role = role;
    }

    public String getId() { return id; }
    public String getUsername() { return username; }
    public String getPassword() { return password; }
    public String getRole() { return role; }

    public void setId(String id) {
        this.id = id;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setRole(String role) {
        this.role = role;
    }
}