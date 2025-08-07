package com.tasksync;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
public class HelloController {
    
    @GetMapping("/")
    public String hello() {
        return "Hello from TaskSync Backend!";
    }
    
    @GetMapping("/status")
    public String status() {
        return "TaskSync Backend is running successfully!";
    }
}
