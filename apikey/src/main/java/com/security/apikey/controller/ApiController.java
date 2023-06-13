package com.security.apikey.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.security.apikey.auth.ApiKeyService;

@RestController
public class ApiController {

    private ApiKeyService apiKeyService;

    @Autowired
    public ApiController(ApiKeyService apiKeyService) {
        this.apiKeyService = apiKeyService;
    }

    @GetMapping("/api/data")
    public String getData(@RequestHeader("X-API-Key") String apiKey) {
        if (apiKeyService.isValidApiKey(apiKey)) {
            return "Valid API Key. Access granted!";
        } else {
            return "Invalid API Key. Access denied!";
        }
    }
}