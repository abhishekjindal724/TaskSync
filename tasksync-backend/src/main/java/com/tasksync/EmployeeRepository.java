package com.tasksync;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    List<Employee> findByDepartmentIgnoreCase(String department);
    List<Employee> findByPromotionEligibility(boolean promotionEligibility);
    List<Employee> findByPerformanceRatingGreaterThanEqual(Integer performanceRating);
    List<Employee> findByManagerId(Long managerId);
}


