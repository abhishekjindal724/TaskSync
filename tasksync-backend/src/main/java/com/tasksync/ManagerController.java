package com.tasksync;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/managers")
public class ManagerController {

    private final ManagerService managerService;

    public ManagerController(ManagerService managerService) {
        this.managerService = managerService;
    }

    @GetMapping
    public List<Manager> getAll() { return managerService.findAll(); }

    @GetMapping("/{id}")
    public Manager getOne(@PathVariable Long id) { return managerService.findById(id); }

    @PostMapping
    public Manager create(@Valid @RequestBody Manager manager) { return managerService.create(manager); }

    @PutMapping("/{id}")
    public Manager update(@PathVariable Long id, @Valid @RequestBody Manager manager) { return managerService.update(id, manager); }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { managerService.delete(id); }
}


