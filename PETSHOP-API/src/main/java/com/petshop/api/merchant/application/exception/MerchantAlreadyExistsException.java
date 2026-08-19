package com.petshop.api.merchant.application.exception;

public class MerchantAlreadyExistsException extends RuntimeException {

    public MerchantAlreadyExistsException() {
        super("User already has a pending or approved merchant application");
    }
}
