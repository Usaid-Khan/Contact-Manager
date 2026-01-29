package com.sclm.app.repository;

import com.sclm.app.entity.PhoneNumber;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhoneNumberRepository extends JpaRepository<PhoneNumber, Long> {
    List<PhoneNumber> findByContactId(Long contactId);

    void deleteByContactId(Long contactId);
}
