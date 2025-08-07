package com.tasksync;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TasksyncBackendApplication {

	public static void main(String[] args) {
		 System.out.println(">>> Application is starting! <<<");
		SpringApplication.run(TasksyncBackendApplication.class, args);
	}

}
