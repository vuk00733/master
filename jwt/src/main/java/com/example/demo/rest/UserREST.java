package com.example.demo.rest;

import com.example.demo.document.User;
import com.example.demo.repository.UserRepository;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserREST {
    @Autowired
    UserRepository userRepository;

    @GetMapping("/{id}")
    @PreAuthorize("#user.id == #id")
    public ResponseEntity<?> me(@AuthenticationPrincipal User user, @PathVariable String id) {
        Optional<User> dbQuery = userRepository.findById(id);
        Map<String, String> response = new HashMap<String, String>();
        response.put("id", dbQuery.get().getId());
        response.put("username", dbQuery.get().getUsername());
        response.put("email", dbQuery.get().getEmail());
        return ResponseEntity.ok(response);
    }
}
