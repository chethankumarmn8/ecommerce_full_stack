// ReviewDTO.java
package com.auth.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter @Setter
public class ReviewDTO {
    private Long id;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
    private String userName;
    private Long productId;

    public ReviewDTO() {}
}