package com.sclm.app.controller;

import com.sclm.app.dto.ApiResponse;
import com.sclm.app.dto.ContactResponse;
import com.sclm.app.entity.Contact;
import com.sclm.app.service.ContactService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/contacts")
@Slf4j
public class ContactController {
    @Autowired
    private ContactService contactService;

    @PostMapping("/create-contact")
    public ResponseEntity<?> createContact(@RequestBody Contact contact) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return contactService.createContact(auth.getName(), contact);
    }

    @GetMapping("/all-contacts")
    public ResponseEntity<ApiResponse> getAllContactsOfUser(@RequestParam(defaultValue = "0") int page,
                                                  @RequestParam(defaultValue = "10") int size,
                                                  @RequestParam(defaultValue = "firstName") String sortBy,
                                                  @RequestParam(defaultValue = "asc") String sortDir) {
        log.info("Fetching all contacts - Page: {}, Size: {}", page, size);
        Sort sort = sortDir.contentEquals("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Page<ContactResponse> contacts = contactService.getAllContacts(auth.getName(), pageable);

        ApiResponse response = new ApiResponse(true, "Contacts fetched successfully", contacts);
        return ResponseEntity.ok(response);
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
