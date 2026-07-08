package com.petshop.api.exception;

public class ResourceNotFoundExeption extends RuntimeException {

    public ResourceNotFoundExeption(String message){
        super(message);
    }

}
