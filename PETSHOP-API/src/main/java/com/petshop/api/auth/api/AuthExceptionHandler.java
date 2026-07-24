package com.petshop.api.auth.api;

import com.petshop.api.auth.api.dto.ErrorResponse;
import com.petshop.api.auth.application.exception.AccountBlockedException;
import com.petshop.api.auth.application.exception.AccountInactiveException;
import com.petshop.api.auth.application.exception.AccountSuspendedException;
import com.petshop.api.auth.application.exception.DuplicateEmailException;
import com.petshop.api.auth.application.exception.DuplicatePhoneException;
import com.petshop.api.auth.application.exception.InvalidCredentialsException;
import com.petshop.api.auth.application.exception.InvalidTokenException;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;
import java.util.Optional;

/**
 * Global exception handler for the auth module.
 * Maps domain exceptions to standard API error responses per API_CONTRACT.md.
 */
@RestControllerAdvice
public class AuthExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(AuthExceptionHandler.class);

    // --- 401 Handlers ---

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleInvalidCredentials(
            InvalidCredentialsException ex, HttpServletRequest request) {
        log.debug("Invalid credentials attempt");
        ErrorResponse body = ErrorResponse.of(
                "UNAUTHENTICATED",
                ex.getMessage(),
                getTraceId(request)
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
    }

    @ExceptionHandler(InvalidTokenException.class)
    public ResponseEntity<ErrorResponse> handleInvalidToken(
            InvalidTokenException ex, HttpServletRequest request) {
        log.debug("Invalid refresh token presented");
        ErrorResponse body = ErrorResponse.of(
                "INVALID_REFRESH_TOKEN",
                ex.getMessage(),
                getTraceId(request)
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
    }

    // --- 403 Handlers ---

    @ExceptionHandler(AccountSuspendedException.class)
    public ResponseEntity<ErrorResponse> handleAccountSuspended(
            AccountSuspendedException ex, HttpServletRequest request) {
        log.debug("Login attempt on suspended account");
        ErrorResponse body = ErrorResponse.of(
                "ACCOUNT_SUSPENDED",
                ex.getMessage(),
                getTraceId(request)
        );
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(body);
    }

    @ExceptionHandler(AccountInactiveException.class)
    public ResponseEntity<ErrorResponse> handleAccountInactive(
            AccountInactiveException ex, HttpServletRequest request) {
        log.debug("Login attempt on inactive account");
        ErrorResponse body = ErrorResponse.of(
                "ACCOUNT_INACTIVE",
                ex.getMessage(),
                getTraceId(request)
        );
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(body);
    }

    @ExceptionHandler(AccountBlockedException.class)
    public ResponseEntity<ErrorResponse> handleAccountBlocked(
            AccountBlockedException ex, HttpServletRequest request) {
        log.debug("Login attempt on blocked account");
        ErrorResponse body = ErrorResponse.of(
                "ACCOUNT_BLOCKED",
                ex.getMessage(),
                getTraceId(request)
        );
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(body);
    }

    // --- 409 Handlers ---

    @ExceptionHandler(DuplicateEmailException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateEmail(
            DuplicateEmailException ex, HttpServletRequest request) {
        log.debug("Duplicate email registration attempt");
        ErrorResponse body = ErrorResponse.of(
                "EMAIL_ALREADY_EXISTS",
                ex.getMessage(),
                getTraceId(request)
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
    }

    @ExceptionHandler(DuplicatePhoneException.class)
    public ResponseEntity<ErrorResponse> handleDuplicatePhone(
            DuplicatePhoneException ex, HttpServletRequest request) {
        log.debug("Duplicate phone registration attempt");
        ErrorResponse body = ErrorResponse.of(
                "PHONE_ALREADY_EXISTS",
                ex.getMessage(),
                getTraceId(request)
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
    }

    // --- 400 Validation Handler ---

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationErrors(
            MethodArgumentNotValidException ex, HttpServletRequest request) {

        List<ErrorResponse.FieldError> fieldErrors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(fe -> new ErrorResponse.FieldError(fe.getField(), fe.getDefaultMessage()))
                .toList();

        ErrorResponse body = ErrorResponse.ofValidation(
                "Request validation failed",
                fieldErrors,
                getTraceId(request)
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    // --- Helpers ---

    private String getTraceId(HttpServletRequest request) {
        return Optional.ofNullable(request.getHeader("X-Trace-Id")).orElse("");
    }
}
