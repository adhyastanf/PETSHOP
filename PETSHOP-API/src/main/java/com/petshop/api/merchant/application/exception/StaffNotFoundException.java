package com.petshop.api.merchant.application.exception;

import java.util.UUID;

public class StaffNotFoundException extends RuntimeException {

    public StaffNotFoundException(UUID staffId) {
        super("Staff member not found: " + staffId);
    }
}
