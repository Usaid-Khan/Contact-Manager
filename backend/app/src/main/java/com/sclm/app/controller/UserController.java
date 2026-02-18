package com.sclm.app.controller;

import com.sclm.app.entity.User;
import com.sclm.app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        return userService.registerUser(user);
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Authenticated");
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();

            String email = auth.getName();
            User user = userService.findByEmail(email);

            // Count user's contacts
            int contactCount = userService.getContactCount(user);

            Map<String, Object> userProfile = new HashMap<>();
            userProfile.put("userId", user.getId());
            userProfile.put("email", user.getEmail());
            userProfile.put("phoneNumber", user.getPhoneNumber());
            userProfile.put("contactCount", contactCount);
            userProfile.put("createdAt", user.getCreatedAt());

            return ResponseEntity.ok(userProfile);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching user profile");
        }
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> passwordData) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();

            String currentPassword = passwordData.get("currentPassword");
            String newPassword = passwordData.get("newPassword");

            User user = userService.findByEmail(email);

            // Verify current password
            if (!userService.verifyPassword(user, currentPassword)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("success", false, "message", "Current password is incorrect"));
            }

            // Update password
            userService.updatePassword(user, newPassword);

            return ResponseEntity.ok(Map.of("success", true, "message", "Password changed successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "Error changing password: " + e.getMessage()));
        }
    }
}
