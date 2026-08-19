package com.petshop.api.merchant.application.exception;

public class BranchCodeAlreadyExistsException extends RuntimeException {

    public BranchCodeAlreadyExistsException(String code) {
        super("Branch code already exists: " + code);
    }
}
