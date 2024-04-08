package com.elproyectegrande.codecool.service;

import com.elproyectegrande.codecool.auth.QRCodeResponse;
import com.elproyectegrande.codecool.model.User;
import com.elproyectegrande.codecool.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.util.Base64;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class QRCodeService {
    private final UserRepository repository;
    private final JwtService jwtService;

    public ResponseEntity<QRCodeResponse> generate(String userId) {
        System.out.println("qr code request made");
        Optional<User> user = repository.findUserById(userId);
        if(user.isPresent()) {
            User actualUser = user.get();
            QRCodeResponse response = new QRCodeResponse();
            response.setUsername(actualUser.getUsername());
            response.setFirstname(actualUser.getFirstName());
            response.setLastname(actualUser.getLastName());
            response.setPhone(actualUser.getPhone());
            response.setEmail(actualUser.getEmail());
            response.setPicture(Base64.getEncoder().encodeToString(actualUser.getPicture()));
            response.setLinkedin(actualUser.getLinkedin());
            response.setFacebook(actualUser.getFacebook());

            String token = jwtService.generateToken(actualUser);
            response.setToken(token);

            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        return new ResponseEntity<>(new QRCodeResponse(),HttpStatus.NOT_FOUND);
    }
}
