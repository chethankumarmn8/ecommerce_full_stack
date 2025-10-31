// New DTO: ArtisanUpdateRequest.java
package com.auth.dto;

import lombok.Getter;
import lombok.Setter;
//import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class ArtisanUpdateRequest {
    private String name;
    private String email;
    private String category;
    private Integer experience;
    private String mobile;
    private String location;
    private String materialsUsed;
    private String password;
    private String confirmPassword;
}