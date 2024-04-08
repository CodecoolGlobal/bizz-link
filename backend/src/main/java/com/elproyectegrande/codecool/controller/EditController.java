package com.elproyectegrande.codecool.controller;

import com.elproyectegrande.codecool.auth.EditRequest;
import com.elproyectegrande.codecool.auth.EditResponse;
import com.elproyectegrande.codecool.auth.UserResponse;
import com.elproyectegrande.codecool.service.EditService;
import com.elproyectegrande.codecool.service.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/edit-user")
public class EditController {

    private final EditService editService;
    private final JwtService jwtService;

    public EditController(EditService editService, JwtService jwtService) {
        this.editService = editService;
        this.jwtService = jwtService;
    }

    @GetMapping("/**")
    public ResponseEntity<UserResponse> getUserData(@RequestHeader Map<String, String> header, @RequestParam String username, @RequestParam String email) throws IOException {
        String token = header.get("authorization").substring(7);
        String usernameFromToken = jwtService.extractUsername(token);
        return editService.getUserData(usernameFromToken, username, email);
    }

    @PutMapping("/**")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<EditResponse> edit(@RequestBody EditRequest request, @RequestParam String email) {
        return editService.updateUser(request, email);
    }
}


