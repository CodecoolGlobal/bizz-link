package com.elproyectegrande.codecool.controller;


import com.elproyectegrande.codecool.service.AuthorizationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/dashboard")
public class AuthorizationController {

    private final AuthorizationService authorizationService;


    public AuthorizationController(AuthorizationService authorizationService) {
        this.authorizationService = authorizationService;
    }


    @GetMapping("/**")
    public ResponseEntity<?> userCredentialOK(@RequestHeader Map<String, String> header, @RequestParam String username) {
        String token = header.get("authorization").substring(7);
        return authorizationService.authorize(token, username);
    }
}
