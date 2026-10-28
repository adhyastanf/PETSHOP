package com.petshop.api.exception;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.petshop.api.utils.ApiResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

        @ExceptionHandler(ResourceNotFoundExeption.class)
        public ResponseEntity<ApiResponse<Void>> handleNotFound(
                        ResourceNotFoundExeption ex) {

                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                .body(
                                                ApiResponse.<Void>builder()
                                                                .timestamp(Instant.now())
                                                                .status(HttpStatus.NOT_FOUND.value())
                                                                .message(ex.getMessage())
                                                                .build());
        }

        @ExceptionHandler(BadRequestException.class)
        public ResponseEntity<ApiResponse<Void>> handleBadRequest(
                        BadRequestException ex) {

                return ResponseEntity.badRequest()
                                .body(
                                                ApiResponse.<Void>builder()
                                                                .timestamp(Instant.now())
                                                                .status(HttpStatus.BAD_REQUEST.value())
                                                                .message(ex.getMessage())
                                                                .build());
        }

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<ApiResponse<Map<String, String>>> handleValidation(
                        MethodArgumentNotValidException ex) {

                Map<String, String> errors = new LinkedHashMap<>();

                ex.getBindingResult()
                                .getFieldErrors()
                                .forEach(error -> errors.put(
                                                error.getField(),
                                                error.getDefaultMessage()));

                return ResponseEntity.badRequest()
                                .body(
                                                ApiResponse.<Map<String, String>>builder()
                                                                .timestamp(Instant.now())
                                                                .status(HttpStatus.BAD_REQUEST.value())
                                                                .message("Validation failed")
                                                                .data(errors)
                                                                .build());
        }

        @ExceptionHandler(AccessDeniedException.class)
        public ResponseEntity<ApiResponse<Void>> handleAccessDenied(
                        AccessDeniedException ex) {

                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                .body(
                                                ApiResponse.<Void>builder()
                                                                .timestamp(Instant.now())
                                                                .status(HttpStatus.FORBIDDEN.value())
                                                                .message("You do not have permission to access this resource")
                                                                .build());
        }

        @ExceptionHandler(Exception.class)
        public ResponseEntity<ApiResponse<Void>> handleException(
                        Exception ex) {

                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(
                                                ApiResponse.<Void>builder()
                                                                .timestamp(Instant.now())
                                                                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                                                                .message(ex.getMessage())
                                                                .build());
        }

}
