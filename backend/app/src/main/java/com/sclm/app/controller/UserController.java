package com.sclm.app.controller;

import com.sclm.app.entity.User;
import com.sclm.app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        System.out.println("Successfully logged in");
        userService.verifyUser(user);
        return new ResponseEntity<>("Successfully logged in", HttpStatus.OK);
    }

    @PutMapping("/change-password/{password}")
    public ResponseEntity<?> changePassword(@PathVariable String password) {
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
