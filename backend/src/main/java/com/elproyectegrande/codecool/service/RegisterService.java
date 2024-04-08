package com.elproyectegrande.codecool.service;

import com.elproyectegrande.codecool.auth.RegisterRequest;
import com.elproyectegrande.codecool.model.Role;
import com.elproyectegrande.codecool.model.User;
import com.elproyectegrande.codecool.repository.UserRepository;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Optional;


@Service
public class RegisterService {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;


    public RegisterService(UserRepository repository, PasswordEncoder passwordEncoder, EmailService emailService) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }


    public ResponseEntity<String> checkUsernameExist(String username) {
        String usernameTaken = "Username already taken,please try another one";
        String usernameFree = "Username free";
        Optional<User> tempUserByUsername = repository.findUserByUsernameIgnoreCase(username);
        if (tempUserByUsername.isPresent()) {
            return new ResponseEntity<>(usernameTaken, HttpStatusCode.valueOf(400));
        }
        return new ResponseEntity<>(usernameFree, HttpStatusCode.valueOf(200));
    }

    public ResponseEntity<String> registerNewUser(RegisterRequest request) {
        String userExistMsg = "User already exist";
        Charset charset = StandardCharsets.UTF_16;
        Optional<User> tempUserByEmail = repository.findByEmail(request.getEmail());
        if (tempUserByEmail.isPresent()) {
            return new ResponseEntity<>(userExistMsg, HttpStatusCode.valueOf(400));
        }
        var createNewUser = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName("")
                .lastName("")
                .facebook("")
                .linkedin("")
                .picture("".getBytes(charset))
                .isActive(false)
                .creationTime(LocalDateTime.now())
                .role(Role.USER)
                .build();

        repository.save(createNewUser);
        emailService.sendEmail(createNewUser);
        return new ResponseEntity<>("Account created", HttpStatusCode.valueOf(200));
    }
}

