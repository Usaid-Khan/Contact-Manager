package com.sclm.app.controller;

import com.sclm.app.entity.Contact;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/contacts")
public class ContactController {
    @PostMapping("/{username}")
    public ResponseEntity<Object> createContact(@RequestBody Contact contact, @PathVariable String username) {
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/{username}")
    public ResponseEntity<?> getAllContactsOfUser(@PathVariable String username) {
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getContactById(@PathVariable Long id) {
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/{username}/{id}")
    public ResponseEntity<?> updateContact(@PathVariable Long id, @RequestBody Contact newContact, @PathVariable String userName) {
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/{username}/{id}")
    public ResponseEntity<?> deleteContact(@PathVariable Long id, @PathVariable String username) {
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/search/{title}")
    public ResponseEntity<?> searchContactByTitle(@PathVariable String title) {
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/search/{firstName}/{lastName}")
    public ResponseEntity<?> searchContactByName(@PathVariable String firstName, @PathVariable String lastName) {
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
