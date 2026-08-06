package com.petshop.api.platform.email;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Console/logging implementation of {@link EmailService}.
 * Logs email content to the application logger instead of sending real emails.
 * Suitable for local development and testing.
 */
@Slf4j
@Service
public class ConsoleEmailService implements EmailService {

    @Override
    public void send(String to, String subject, String htmlBody) {
        log.info("=== EMAIL SENT ===");
        log.info("To: {}", to);
        log.info("Subject: {}", subject);
        log.info("Body:\n{}", htmlBody);
        log.info("=== END EMAIL ===");
    }

    @Override
    public void sendTemplate(String to, String templateName, Map<String, Object> variables) {
        log.info("=== TEMPLATE EMAIL SENT ===");
        log.info("To: {}", to);
        log.info("Template: {}", templateName);
        log.info("Variables: {}", variables);
        log.info("=== END TEMPLATE EMAIL ===");
    }
}
