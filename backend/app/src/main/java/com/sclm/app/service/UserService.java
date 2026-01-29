package com.sclm.app.service;

import com.sclm.app.entity.User;
import com.sclm.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
//@RequiredArgsConstructor
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Transactional
    public User registerUser(String username, String email, String phoneNum, String password) {
        // Check if email already exists
        if(userRepository.existsByEmail(email)) {
            System.out.println("Email already in use");
        }

        // Check if phone number already exists (if provided)
        if(phoneNum != null && userRepository.existsByPhoneNumber(phoneNum)) {
            System.out.println("Phone number already exists");
        }

        // Create new user
        User user = User.builder()
                .email(email)
                .phoneNumber(phoneNum)
                .password(password)
                .build();

        return userRepository.save(user);
    }

    public ResponseEntity<?> verifyUser(String email, String phoneNum, String password) {
        if((userRepository.existsByEmail(email)) || (phoneNum != null && userRepository.existsByPhoneNumber(phoneNum))) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @Transactional
    public void changePassword(Long userId, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(newPassword);
        userRepository.save(user);
    }

    public User findById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
