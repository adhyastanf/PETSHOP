package com.petshop.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan("com.petshop.api.auth.config")
public class PetshopApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(PetshopApiApplication.class, args);
    }
}
