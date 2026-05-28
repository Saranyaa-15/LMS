package com.library.exception;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public static ResourceNotFoundException forBook(Long id) {
        return new ResourceNotFoundException("Book not found with id: " + id);
    }

    public static ResourceNotFoundException forMember(Long id) {
        return new ResourceNotFoundException("Member not found with id: " + id);
    }

    public static ResourceNotFoundException forTransaction(Long id) {
        return new ResourceNotFoundException("Transaction not found with id: " + id);
    }
}
