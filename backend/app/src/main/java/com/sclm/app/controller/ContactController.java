package com.sclm.app.controller;

import com.sclm.app.entity.Contact;
import com.sclm.app.service.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/contacts")
public class ContactController {
    @Autowired
    private ContactService contactService;

    @PostMapping("/create-contact")
    public ResponseEntity<?> createContact(@RequestBody Contact contact) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return contactService.createContact(auth.getName(), contact);
    }

    @GetMapping("/all-contacts")
    public ResponseEntity<?> getAllContactsOfUser(Pageable pageable) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return contactService.getAllContacts(auth.getName(), pageable);
    }

    @GetMapping("/{contactId}")
    public ResponseEntity<?> getContactById(@PathVariable Long contactId) {
        return contactService.getContactById(contactId);
    }

    @PutMapping("/{contactId}")
    public ResponseEntity<?> updateContact(@RequestBody Contact newContact, @PathVariable Long contactId) {
        return contactService.updateContact(newContact, contactId);
    }

    @DeleteMapping("/{contactId}")
    public ResponseEntity<?> deleteContact(@PathVariable Long contactId) {
        return contactService.deleteContact(contactId);
    }

    @GetMapping("/search/{title}")
    public ResponseEntity<?> searchContactByTitle(@PathVariable String title) {
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/search/{firstName}/{lastName}")
    public ResponseEntity<?> searchContactByName(@PathVariable String firstName, @PathVariable String lastName) {
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<?> searchContacts(@RequestParam String searchTerm, Pageable pageable) {
        return contactService.searchContacts(searchTerm, pageable);
    }
}
