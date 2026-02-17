package com.sclm.app.dto;

import com.sclm.app.entity.EmailType;
import com.sclm.app.entity.PhoneType;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactUpdateRequest {
    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    private String title;

    private List<EmailAddressDto> emailAddresses;
    private List<PhoneNumberDto> phoneNumbers;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EmailAddressDto {
        private String email;
        private EmailType type;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PhoneNumberDto {
        private String number;
        private PhoneType type;
    }
}
