package com.sclm.app.service;

import com.sclm.app.entity.User;
import com.sclm.app.entity.UserPrincipal;
import com.sclm.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailsService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found by this email"));

//        if(user == null) {
//            System.out.println("User not found.");
//            throw new UsernameNotFoundException("User not found");
//        }

        return new UserPrincipal(user);
    }
}
