package com.petshop.api.platform.email;

import java.util.Map;

/**
 * Platform abstraction for email delivery.
 * Business modules depend on this interface, never on vendor SDKs.
 */
public interface EmailService {

    /**
     * Send a raw HTML email.
     *
     * @param to       recipient email address
     * @param subject  email subject
     * @param htmlBody HTML content body
     */
    void send(String to, String subject, String htmlBody);

    /**
     * Send a templated email.
     *
     * @param to           recipient email address
     * @param templateName logical template identifier
     * @param variables    template variable bindings
     */
    void sendTemplate(String to, String templateName, Map<String, Object> variables);
}
