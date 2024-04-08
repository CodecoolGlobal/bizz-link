package com.elproyectegrande.codecool.service;

import com.elproyectegrande.codecool.auth.AuthenticationRequest;
import com.elproyectegrande.codecool.auth.AuthenticationResponse;
import com.elproyectegrande.codecool.repository.UserRepository;
import jakarta.mail.AuthenticationFailedException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;
import java.util.Base64;


@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository repository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse authenticate(AuthenticationRequest request) throws AuthenticationFailedException {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            var user = repository.findByEmail(request.getEmail())
                    .orElseThrow();
            var jwtToken = jwtService.generateToken(user);
            return AuthenticationResponse.builder()
                    .id(user.getId())
                    .email(request.getEmail())
                    .username(user.getUsername())
                    .phone(user.getPhone())
                    .picture(Base64.getEncoder().encodeToString(user.getPicture()))
                    .role(user.getRole())// Add the username to the response
                    .token(jwtToken)
                    .build();

        } catch (AuthenticationException exception) {
            System.out.println("Authentication failed: " + exception.getMessage());
            // Handle the error or return an error response
            throw new AuthenticationFailedException("Authentication failed", exception);
        }
    }

}
