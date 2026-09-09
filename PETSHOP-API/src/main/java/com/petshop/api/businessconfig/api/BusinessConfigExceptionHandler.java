package com.petshop.api.businessconfig.api;

import com.petshop.api.auth.api.dto.ErrorResponse;
import com.petshop.api.businessconfig.application.exception.ConfigurationNotFoundException;
import com.petshop.api.businessconfig.application.exception.InvalidConfigurationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Maps business-configuration exceptions to the canonical {@link ErrorResponse}
 * contract. Scoped to the businessconfig module.
 */
@RestControllerAdvice(basePackages = "com.petshop.api.businessconfig")
public class BusinessConfigExceptionHandler {

    @ExceptionHandler(ConfigurationNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ConfigurationNotFoundException ex) {
        ErrorResponse error = ErrorResponse.of("CONFIG_NOT_FOUND", ex.getMessage(), "");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(InvalidConfigurationException.class)
    public ResponseEntity<ErrorResponse> handleInvalid(InvalidConfigurationException ex) {
        ErrorResponse error = ErrorResponse.of("INVALID_CONFIGURATION", ex.getMessage(), "");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
}
