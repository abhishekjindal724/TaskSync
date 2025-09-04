package com.tasksync;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ManagerService {

    private final ManagerRepository managerRepository;

    public ManagerService(ManagerRepository managerRepository) {
        this.managerRepository = managerRepository;
    }

    public List<Manager> findAll() { return managerRepository.findAll(); }

    public Manager findById(Long id) {
        return managerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Manager not found with ID: " + id));
    }

    public Manager create(Manager manager) { return managerRepository.save(manager); }

    public Manager update(Long id, Manager details) {
        Manager m = findById(id);
        m.setName(details.getName());
        m.setEmail(details.getEmail());
        return managerRepository.save(m);
    }

    public void delete(Long id) { managerRepository.deleteById(id); }
}


