package com.tasksync;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    public List<Employee> getAll() { return employeeService.findAll(); }

    @GetMapping("/{id}")
    public Employee getOne(@PathVariable Long id) { return employeeService.findById(id); }

    @PostMapping
    public Employee create(@Valid @RequestBody Employee employee) { return employeeService.create(employee); }

    @PutMapping("/{id}")
    public Employee update(@PathVariable Long id, @Valid @RequestBody Employee employee) { return employeeService.update(id, employee); }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { employeeService.delete(id); }

    @GetMapping("/department/{department}")
    public List<Employee> byDepartment(@PathVariable String department) { return employeeService.findByDepartment(department); }

    @GetMapping("/eligible/{eligible}")
    public List<Employee> byEligibility(@PathVariable boolean eligible) { return employeeService.findByPromotionEligibility(eligible); }

    @GetMapping("/performance/{rating}")
    public List<Employee> byPerformance(@PathVariable Integer rating) { return employeeService.findByPerformanceAtLeast(rating); }

    @GetMapping("/manager/{managerId}")
    public List<Employee> byManager(@PathVariable Long managerId) { return employeeService.findByManager(managerId); }
}


