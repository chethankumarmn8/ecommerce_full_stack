package com.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

// ProxyController.java
@RestController
@RequestMapping("/proxy")
public class ProxyController {

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/aitopia")
    public ResponseEntity<String> proxyAitopiaRequest(@RequestBody String body) {
        return restTemplate.postForEntity(
                "https://extensions.aitopia.ai/...",
                body,
                String.class
        );
    }
}