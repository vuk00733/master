package com.fa.auth;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import com.warrenstrange.googleauth.GoogleAuthenticatorQRGenerator;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserRepository userRepository;

    private GoogleAuthenticator googleAuthenticator;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.googleAuthenticator = new GoogleAuthenticator();
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserDTO userDTO) {
        User existingUser = userRepository.findByUsername(userDTO.getUsername());
        if (existingUser != null) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        User newUser = new User();
        newUser.setUsername(userDTO.getUsername());

        newUser.setPassword(userDTO.getPassword());

        GoogleAuthenticatorKey key = googleAuthenticator.createCredentials();
        newUser.setSecretKey(key.getKey());

        userRepository.save(newUser);

        return ResponseEntity.ok(newUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody UserDTO userDTO) {
        User user = userRepository.findByUsername(userDTO.getUsername());
        if (user == null || !user.getPassword().equals(userDTO.getPassword())) {
            return ResponseEntity.badRequest().body("Invalid username or password");
        }

        return ResponseEntity.ok(user);
    }

    @GetMapping("/generate-qr/{username}")
    public ResponseEntity<?> generateQRCode(@PathVariable String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        GoogleAuthenticatorKey key = googleAuthenticator.createCredentials();
        user.setSecretKey(key.getKey());

        String qrCodeData = GoogleAuthenticatorQRGenerator.getOtpAuthURL("MyApp", username, key);
        userRepository.save(user);

        Map<String, String> response = new HashMap<>();
        response.put("code", qrCodeData);
        response.put("username", username);

        return new ResponseEntity<Map<String, String>>(response, HttpStatus.OK);

    }

    // radice jedan u nazad dok se ne refreshuje na drugi
    @PostMapping(path = "/verify-2fa")
    public ResponseEntity<?> verify2FA(@RequestBody VerificationDTO verificationDTO) {
        User user = userRepository.findByUsername(verificationDTO.getUsername());
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        String codeString = verificationDTO.getCode();
        int code;
        try {
            code = Integer.parseInt(codeString);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Invalid 2FA code format");
        }
        boolean isValid = googleAuthenticator.authorize(user.getSecretKey(), code);
        Map<String, String> response = new HashMap<>();
        if (isValid) {
            response.put("message", "Valid 2FA code");
            return new ResponseEntity<Map<String, String>>(response, HttpStatus.OK);
        } else {
            response.put("message", "Invalid 2FA code");
            return new ResponseEntity<Map<String, String>>(response, HttpStatus.BAD_REQUEST);
        }
    }

}
