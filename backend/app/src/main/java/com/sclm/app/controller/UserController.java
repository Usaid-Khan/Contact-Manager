package com.sclm.app.controller;

import com.sclm.app.entity.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/user")
public class UserController {
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/login/{email}/{password}")
    public ResponseEntity<?> login(@PathVariable String email, @PathVariable String password) {
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/change-password/{password}")
    public ResponseEntity<?> changePassword(@PathVariable String password) {
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
