package com.sclm.app.repository;

import com.sclm.app.entity.EmailAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmailAddressRepository extends JpaRepository<EmailAddress, Long> {
    List<EmailAddress> findByContactId(Long contactId);

    void deleteByContactId(Long contactId);
}
