package com.sclm.app.service;

import com.sclm.app.entity.Contact;
import com.sclm.app.entity.EmailAddress;
import com.sclm.app.entity.PhoneNumber;
import com.sclm.app.entity.User;
import com.sclm.app.repository.ContactRepository;
import com.sclm.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
//@RequiredArgsConstructor
public class ContactService {
    @Autowired
    private ContactRepository contactRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;

    @Transactional
    public ResponseEntity<?> createContact(String userMail, Contact contact) {
        User user = userRepository.findByEmail(userMail)
                .orElseThrow(() -> new UsernameNotFoundException("User not exists"));

        Contact newContact = Contact.builder()
                .firstName(contact.getFirstName())
                .lastName(contact.getLastName())
                .title(contact.getTitle())
                .user(user)
                .build();

        // Add email addresses
        if(contact.getEmailAddresses() != null) {
            contact.getEmailAddresses().forEach(singleEmail -> {
                EmailAddress email = EmailAddress.builder()
                        .email(singleEmail.getEmail())
                        .type(singleEmail.getType())
                        .contact(newContact)
                        .build();

                newContact.getEmailAddresses().add(email);
            });
        }

        // Add phone numbers
        if(contact.getPhoneNumbers() != null) {
            contact.getPhoneNumbers().forEach(singlePhone -> {
                PhoneNumber phone = PhoneNumber.builder()
                        .number(singlePhone.getNumber())
                        .type(singlePhone.getType())
                        .contact(newContact)
                        .build();

                newContact.getPhoneNumbers().add(phone);
            });
        }

        Contact savedContact = contactRepository.save(newContact);

        return new ResponseEntity<>("Contact Saved", HttpStatus.CREATED);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<?> getAllContacts(String userMail, Pageable pageable) {
        User user = userRepository.findByEmail(userMail)
                .orElseThrow(() -> new UsernameNotFoundException("User not exists"));

        Page<Contact> contacts = contactRepository.findByUserId(user.getId(), pageable);

        if(contacts.getNumberOfElements() == 0) {
            return new ResponseEntity<>("You don't have any contacts yet", HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(contacts, HttpStatus.FOUND);
    }

    @Transactional(readOnly = true)
    public Page<Contact> searchContacts(Long userId, String searchTerm, Pageable pageable) {
        Page<Contact> contacts = contactRepository.searchContacts(userId, searchTerm, pageable);
        return contacts;
    }

    @Transactional(readOnly = true)
    public ResponseEntity<?> getContactById(Long contactId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User does not login or exists"));

        Contact contact = contactRepository.findById(contactId)
                .orElseThrow(() -> new RuntimeException("Contact not found"));

        // Check if contact belongs to user
        if(!contact.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You don't have permission to access this contact");
        }

        return new ResponseEntity<>(contact, HttpStatus.OK);
    }

    @Transactional
    public ResponseEntity<?> updateContact(Contact newContact, Long contactId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User does not login or exists"));

        Contact contact = contactRepository.findById(contactId)
                .orElseThrow(() -> new RuntimeException("Contact not found"));

        // Check ownership
        if(!contact.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You don't have permission to update this contact");
        }

        // Update basic fields
        if(newContact.getFirstName() != null) {
            contact.setFirstName(newContact.getFirstName());
        }
        if(newContact.getLastName() != null) {
            contact.setLastName(newContact.getLastName());
        }
        if(newContact.getTitle() != null) {
            contact.setTitle(newContact.getTitle());
        }

        // Clear and update email addresses
        contact.getEmailAddresses().clear();
        if(newContact.getEmailAddresses() != null) {
            newContact.getEmailAddresses().forEach(singleEmail -> {
                EmailAddress email = EmailAddress.builder()
                        .email(singleEmail.getEmail())
                        .type(singleEmail.getType())
                        .contact(contact)
                        .build();

                contact.getEmailAddresses().add(email);
            });
        }

        // Clear and update phone numbers
        contact.getPhoneNumbers().clear();
        if(newContact.getPhoneNumbers() != null) {
            newContact.getPhoneNumbers().forEach(singlePhone -> {
                PhoneNumber phone = PhoneNumber.builder()
                        .number(singlePhone.getNumber())
                        .type(singlePhone.getType())
                        .contact(contact)
                        .build();

                contact.getPhoneNumbers().add(phone);
            });
        }

        Contact updatedContact = contactRepository.save(contact);

        return new ResponseEntity<>(updatedContact, HttpStatus.OK);
    }

    @Transactional
    public ResponseEntity<?> deleteContact(Long contactId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User does not login or exists"));

        Contact contact = contactRepository.findById(contactId)
                .orElseThrow(() -> new RuntimeException("Contact not found"));

        // Check ownership
        if (!contact.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You don't have permission to delete this contact");
        }

        contactRepository.delete(contact);

        return new ResponseEntity<>("Contact is deleted", HttpStatus.OK);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<?> searchContacts(String searchTerm, Pageable pageable) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User does not login or exists"));

        Page<Contact> contacts = contactRepository.searchContacts(currentUser.getId(), searchTerm, pageable);

        if(contacts.getNumberOfElements() == 0) {
            return new ResponseEntity<>("No such contact exists", HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(contacts, HttpStatus.FOUND);
    }
}
