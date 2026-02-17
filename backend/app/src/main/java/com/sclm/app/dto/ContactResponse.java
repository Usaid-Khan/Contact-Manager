package com.sclm.app.dto;

import com.sclm.app.entity.EmailType;
import com.sclm.app.entity.PhoneType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String title;
    private List<EmailAddressDto> emailAddresses;
    private List<PhoneNumberDto> phoneNumbers;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class EmailAddressDto {
        private Long id;
        private String email;
        private EmailType type;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PhoneNumberDto {
        private Long id;
        private String number;
        private PhoneType type;
    }
}
