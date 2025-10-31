    package com.auth.dto;

    import lombok.Getter;
    import lombok.Setter;

    @Getter
    @Setter
    public class ArtisanRegisterRequest {
        private String name;
        private String email;
        private String password;
        private String category;
        private Integer experience;
        private String mobile;
        private String location;
        private String materialsUsed;
    }
