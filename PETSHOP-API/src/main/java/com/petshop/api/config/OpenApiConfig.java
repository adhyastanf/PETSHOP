package com.petshop.api.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI petshopOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Petshop API")
                        .description("REST API untuk aplikasi Petshop")
                        .version("1.0.0"));
    }
}
