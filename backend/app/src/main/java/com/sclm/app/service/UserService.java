package com.sclm.app.service;

import com.sclm.app.entity.User;
import com.sclm.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
//@RequiredArgsConstructor
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Transactional
    public ResponseEntity<?> registerUser(User user) {
        // Check if email already exists
        if(userRepository.existsByEmail(user.getEmail())) {
            System.out.println("Email already in use");
            return new ResponseEntity<>("Email already in use", HttpStatus.ALREADY_REPORTED);
        }

        // Check if phone number already exists (if provided)
        if(user.getPhoneNumber() != null && userRepository.existsByPhoneNumber(user.getPhoneNumber())) {
            System.out.println("Phone number already exists");
            return new ResponseEntity<>("Phone Number already exists", HttpStatus.ALREADY_REPORTED);
        }

        // Create new user
        User newUser = User.builder()
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .password(user.getPassword())
                .build();

        userRepository.save(newUser);

        System.out.println("User is registered");
        return new ResponseEntity<>("User is registered", HttpStatus.OK);
    }

    public ResponseEntity<?> verifyUser(User user) {
        if((userRepository.existsByEmail(user.getEmail())) || (user.getPhoneNumber() != null && userRepository.existsByPhoneNumber(user.getPhoneNumber()))) {
            User userInDB = userRepository.findByEmail(user.getEmail())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            if(userInDB.getPassword().equals(user.getPassword())) {
                System.out.println("Successfully logged in");
                return new ResponseEntity<>("User is successfully logged in", HttpStatus.OK);
            }
        }
        return new ResponseEntity<>("User is not found", HttpStatus.NOT_FOUND);

//        Authentication authentication = authManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
//        if(authentication.isAuthenticated())
//            return jwtService.generateToken(user.getUsername());
//        return "Fail";
//        return new ResponseEntity<>("Successfully logged in", HttpStatus.OK);
    }

    @Transactional
    public ResponseEntity<?> changePassword(Long userId, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if userId belongs to user
        if(!user.getId().equals(userId)) {
            return new ResponseEntity<>("You don't have permission to access this account", HttpStatus.FORBIDDEN);
        }

        user.setPassword(newPassword);
        userRepository.save(user);

        return new ResponseEntity<>("Password is changed", HttpStatus.OK);
    }

    public User findById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
