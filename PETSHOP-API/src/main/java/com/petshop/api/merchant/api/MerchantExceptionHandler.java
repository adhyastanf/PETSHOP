package com.petshop.api.merchant.api;

import com.petshop.api.auth.api.dto.ErrorResponse;
import com.petshop.api.merchant.application.exception.BranchCodeAlreadyExistsException;
import com.petshop.api.merchant.application.exception.BranchNotFoundException;
import com.petshop.api.merchant.application.exception.MerchantAlreadyExistsException;
import com.petshop.api.merchant.application.exception.MerchantNotFoundException;
import com.petshop.api.merchant.application.exception.StaffNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(basePackages = "com.petshop.api.merchant")
public class MerchantExceptionHandler {

    @ExceptionHandler(MerchantNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(MerchantNotFoundException ex) {
        ErrorResponse error = ErrorResponse.of("MERCHANT_NOT_FOUND", ex.getMessage(), "");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(BranchNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleBranchNotFound(BranchNotFoundException ex) {
        ErrorResponse error = ErrorResponse.of("BRANCH_NOT_FOUND", ex.getMessage(), "");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(StaffNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleStaffNotFound(StaffNotFoundException ex) {
        ErrorResponse error = ErrorResponse.of("STAFF_NOT_FOUND", ex.getMessage(), "");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(MerchantAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleAlreadyExists(MerchantAlreadyExistsException ex) {
        ErrorResponse error = ErrorResponse.of("MERCHANT_ALREADY_EXISTS", ex.getMessage(), "");
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }

    @ExceptionHandler(BranchCodeAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleBranchCodeAlreadyExists(BranchCodeAlreadyExistsException ex) {
        ErrorResponse error = ErrorResponse.of("BRANCH_CODE_ALREADY_EXISTS", ex.getMessage(), "");
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex) {
        ErrorResponse error = ErrorResponse.of("FORBIDDEN", ex.getMessage(), "");
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ErrorResponse> handleIllegalState(IllegalStateException ex) {
        ErrorResponse error = ErrorResponse.of("INVALID_STATE", ex.getMessage(), "");
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(error);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException ex) {
        ErrorResponse error = ErrorResponse.of("BAD_REQUEST", ex.getMessage(), "");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
}
