package com.fa.auth;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Allows CORS for all endpoints
                .allowedOrigins("*") // Adjust this based on your requirements
                .allowedMethods("GET", "POST", "PUT", "DELETE") // Adjust the allowed HTTP methods
                .allowedHeaders("*"); // Adjust the allowed headers if needed
    }
}
