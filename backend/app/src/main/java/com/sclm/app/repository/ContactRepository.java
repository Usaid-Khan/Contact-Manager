package com.sclm.app.repository;

import com.sclm.app.entity.Contact;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {
    // Find all contacts for a specific user with pagination
    Page<Contact> findByUserId(Long userId, Pageable pageable);

    // Search contacts by first name, last name, or title
    @Query("SELECT c FROM Contact c WHERE c.user.id = :userId AND " +
            "(LOWER(c.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(c.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(c.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Contact> searchContacts(@Param("userId") Long userId,
                                 @Param("searchTerm") String searchTerm,
                                 Pageable pageable);

    // Check if contact exists for user
    Boolean existsByIdAndUserId(Long contactId, Long userId);
}
