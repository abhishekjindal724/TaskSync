package com.tasksync;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final ManagerRepository managerRepository;

    public EmployeeService(EmployeeRepository employeeRepository, ManagerRepository managerRepository) {
        this.employeeRepository = employeeRepository;
        this.managerRepository = managerRepository;
    }

    public List<Employee> findAll() { return employeeRepository.findAll(); }

    public Employee findById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found with ID: " + id));
    }

    public Employee create(Employee employee) {
        if (employee.getManager() != null && employee.getManager().getId() != null) {
            Manager manager = managerRepository.findById(employee.getManager().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Manager not found with ID: " + employee.getManager().getId()));
            employee.setManager(manager);
        }
        return employeeRepository.save(employee);
    }

    public Employee update(Long id, Employee details) {
        Employee e = findById(id);
        e.setName(details.getName());
        e.setDepartment(details.getDepartment());
        e.setJobTitle(details.getJobTitle());
        e.setHireDate(details.getHireDate());
        e.setPerformanceRating(details.getPerformanceRating());
        e.setPromotionEligibility(details.isPromotionEligibility());
        if (details.getManager() != null && details.getManager().getId() != null) {
            Manager m = managerRepository.findById(details.getManager().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Manager not found with ID: " + details.getManager().getId()));
            e.setManager(m);
        } else {
            e.setManager(null);
        }
        return employeeRepository.save(e);
    }

    public void delete(Long id) { employeeRepository.deleteById(id); }

    public List<Employee> findByDepartment(String department) { return employeeRepository.findByDepartmentIgnoreCase(department); }

    public List<Employee> findByPromotionEligibility(boolean eligible) { return employeeRepository.findByPromotionEligibility(eligible); }

    public List<Employee> findByPerformanceAtLeast(Integer rating) { return employeeRepository.findByPerformanceRatingGreaterThanEqual(rating); }

    public List<Employee> findByManager(Long managerId) { return employeeRepository.findByManagerId(managerId); }
}


