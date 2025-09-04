package com.tasksync;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

@Entity
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is mandatory")
    private String name;

    private String jobTitle;

    private String department;

    private LocalDate hireDate;

    @Min(value = 1, message = "Performance rating must be between 1 and 5")
    @Max(value = 5, message = "Performance rating must be between 1 and 5")
    private Integer performanceRating;

    private boolean promotionEligibility = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id")
    private Manager manager;

    public Employee() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public LocalDate getHireDate() { return hireDate; }
    public void setHireDate(LocalDate hireDate) { this.hireDate = hireDate; }

    public Integer getPerformanceRating() { return performanceRating; }
    public void setPerformanceRating(Integer performanceRating) { this.performanceRating = performanceRating; }

    public boolean isPromotionEligibility() { return promotionEligibility; }
    public void setPromotionEligibility(boolean promotionEligibility) { this.promotionEligibility = promotionEligibility; }

    public Manager getManager() { return manager; }
    public void setManager(Manager manager) { this.manager = manager; }
}


