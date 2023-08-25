package com.elproyectegrande.codecool.controller;

import com.elproyectegrande.codecool.auth.QRCodeResponse;
import com.elproyectegrande.codecool.service.QRCodeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

@RestController
@RequestMapping("/business-card")
public class QRCodeController {
    private final QRCodeService service;

    public QRCodeController(QRCodeService service) {
        this.service = service;
    }

    @GetMapping("")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<QRCodeResponse> getBusinessCardData(@RequestParam String username) throws NoSuchAlgorithmException {
        String decryptedUsername = decryptData(username.replaceAll(" ", "+"));
        System.out.println(decryptedUsername);
        return service.generate(decryptedUsername);
    }


    public String decryptData(String encryptedUsername) throws NoSuchAlgorithmException {
        try {
            byte[] keyBytes = secretKey.getBytes("UTF-8");
            SecretKeySpec secretKeySpec = new SecretKeySpec(keyBytes, "AES");

            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
            cipher.init(Cipher.DECRYPT_MODE, secretKeySpec);

            // Base64 decode the encrypted data
            byte[] decryptedBytes = cipher.doFinal(Base64.getDecoder().decode(encryptedUsername));

            // Decrypt the data


            System.out.println("Decrypted Username: " + new String(decryptedBytes,"UTF-8"));

            return new String(decryptedBytes,"UTF-8");
        } catch (Exception e) {
            return "Error";
        }

    }

        public String generateKeyFromOriginalKey(String originalKey) throws NoSuchAlgorithmException {
            MessageDigest sha = MessageDigest.getInstance("SHA-256");
            byte[] keyBytes = sha.digest(originalKey.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(keyBytes);
        }
    }
