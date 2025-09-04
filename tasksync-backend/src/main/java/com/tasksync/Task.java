package com.tasksync;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Entity
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Title is mandatory, cannot be blank
    @NotBlank(message = "Title is mandatory")
    private String title;

    private String description;

    // New field to track if task is completed
    private boolean completed = false;

    // Priority with enum for type safety, default MEDIUM
    @Enumerated(EnumType.STRING)
    private Priority priority = Priority.MEDIUM;

    private String category;

    // Auto-set creation time, not modifiable
    @Column(updatable = false)
    @org.hibernate.annotations.CreationTimestamp
    private LocalDateTime createdAt;

    // Auto-update modification time
    @org.hibernate.annotations.UpdateTimestamp
    private LocalDateTime updatedAt;

    // Default constructor for JPA
    public Task() {}

    // Getters and Setters for each field
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }

    // Define enum for priority
    public enum Priority {
        LOW, MEDIUM, HIGH
    }
}
