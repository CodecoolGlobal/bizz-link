package com.elproyectegrande.codecool.auth;
import lombok.*;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String linkedin;
    private String facebook;
    private String picture;
}
