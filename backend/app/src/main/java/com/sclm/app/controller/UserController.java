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
        return userService.registerUser(user);
    }

//    @PostMapping("/login")
//    public ResponseEntity<?> login(@RequestBody User user) {
//        return userService.verifyUser(user);
//    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Authenticated");
    }

    @PutMapping("/change-password/{userId}/{password}")
    public ResponseEntity<?> changePassword(@PathVariable Long userId, @PathVariable String password) {
        return userService.changePassword(userId, password);
    }
}
