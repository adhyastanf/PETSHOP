package com.petshop.api.merchant.application.exception;

import java.util.UUID;

public class BranchNotFoundException extends RuntimeException {

    public BranchNotFoundException(UUID branchId) {
        super("Branch not found: " + branchId);
    }
}
