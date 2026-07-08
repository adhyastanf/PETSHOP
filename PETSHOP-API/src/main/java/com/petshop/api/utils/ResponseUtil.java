package com.petshop.api.utils;

import java.time.Instant;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public final class ResponseUtil {

    private ResponseUtil() {
    }

    public static <T> ResponseEntity<ApiResponse<T>> ok(T data) {
        return ResponseEntity.ok(
                ApiResponse.<T>builder()
                        .status(HttpStatus.OK.value())
                        .message("Success")
                        .data(data)
                        .timestamp(Instant.now())
                        .build()
        );
    }

    public static <T> ResponseEntity<ApiResponse<T>> ok(String message, T data) {
        return ResponseEntity.ok(
                ApiResponse.<T>builder()
                        .status(HttpStatus.OK.value())
                        .message(message)
                        .data(data)
                        .timestamp(Instant.now())
                        .build()
        );
    }

    public static <T> ResponseEntity<ApiResponse<T>> created(String message, T data) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                        ApiResponse.<T>builder()
                                .status(HttpStatus.CREATED.value())
                                .message(message)
                                .data(data)
                                .timestamp(Instant.now())
                                .build()
                );
    }

    public static ResponseEntity<ApiResponse<Void>> noContent() {
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                .body(
                        ApiResponse.<Void>builder()
                                .status(HttpStatus.NO_CONTENT.value())
                                .message("No Content")
                                .timestamp(Instant.now())
                                .build()
                );
    }

    public static ResponseEntity<ApiResponse<Void>> badRequest(String message) {
        return ResponseEntity.badRequest()
                .body(
                        ApiResponse.<Void>builder()
                                .status(HttpStatus.BAD_REQUEST.value())
                                .message(message)
                                .timestamp(Instant.now())
                                .build()
                );
    }

    public static ResponseEntity<ApiResponse<Void>> notFound(String message) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(
                        ApiResponse.<Void>builder()
                                .status(HttpStatus.NOT_FOUND.value())
                                .message(message)
                                .timestamp(Instant.now())
                                .build()
                );
    }

    public static ResponseEntity<ApiResponse<Void>> unauthorized(String message) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(
                        ApiResponse.<Void>builder()
                                .status(HttpStatus.UNAUTHORIZED.value())
                                .message(message)
                                .timestamp(Instant.now())
                                .build()
                );
    }

    public static ResponseEntity<ApiResponse<Void>> forbidden(String message) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(
                        ApiResponse.<Void>builder()
                                .status(HttpStatus.FORBIDDEN.value())
                                .message(message)
                                .timestamp(Instant.now())
                                .build()
                );
    }

    public static ResponseEntity<ApiResponse<Void>> internalServerError(String message) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(
                        ApiResponse.<Void>builder()
                                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                                .message(message)
                                .timestamp(Instant.now())
                                .build()
                );
    }
}