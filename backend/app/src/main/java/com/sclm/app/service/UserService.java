package com.sclm.app.service;

import com.sclm.app.entity.User;
import com.sclm.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
//@RequiredArgsConstructor
public class UserService {
    @Autowired
    private UserRepository userRepository;
    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @Transactional
    public ResponseEntity<?> registerUser(User user) {
        // Check if email already exists
        System.out.println("before email check");
        if(userRepository.existsByEmail(user.getEmail())) {
            System.out.println("Email already in use");
            return new ResponseEntity<>("Email already in use", HttpStatus.ALREADY_REPORTED);
        }
        System.out.println("after email check");

        // Create new user
        System.out.println("before creating user");
        User newUser = User.builder()
                .email(user.getEmail())
                .phoneNumber(
                        (user.getPhoneNumber() == null || user.getPhoneNumber().isBlank())
                                ? null
                                : user.getPhoneNumber()
                )
                .password(encoder.encode(user.getPassword()))
                .build();
        System.out.println("after creating user");

        userRepository.save(newUser);

        System.out.println("User is registered");
        return new ResponseEntity<>("User is registered", HttpStatus.OK);
    }

    public ResponseEntity<?> verifyUser(User user) {
        if((userRepository.existsByEmail(user.getEmail())) || (user.getPhoneNumber() != null && userRepository.existsByPhoneNumber(user.getPhoneNumber()))) {
            User userInDB = userRepository.findByEmail(user.getEmail())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            if(encoder.matches(user.getPassword(), userInDB.getPassword())) {
                System.out.println("Successfully logged in");
                return new ResponseEntity<>("User is successfully logged in", HttpStatus.OK);
            }
        }
        return new ResponseEntity<>("User is not found", HttpStatus.NOT_FOUND);
    }

    @Transactional
    public ResponseEntity<?> changePassword(String newPassword) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(newPassword);
        userRepository.save(user);

        return new ResponseEntity<>("Password is changed", HttpStatus.OK);
    }

    public User findById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public int getContactCount(User user) {
        int size = user.getContacts().size();
        return size;
    }

    public boolean verifyPassword(User user, String rawPassword) {
        if(encoder.matches(user.getPassword(), rawPassword)) {
            return true;
        } else {
            return false;
        }
    }

    public void updatePassword(User user, String newPassword) {
        user.setPassword(encoder.encode(newPassword));
        userRepository.save(user);
    }
}
