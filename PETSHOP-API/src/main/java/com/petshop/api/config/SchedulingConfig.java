package com.petshop.api.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Scheduling configuration.
 * Enables @Scheduled for background jobs.
 * Swap to Quartz for complex scheduling needs.
 */
@Configuration
@EnableScheduling
public class SchedulingConfig {
}
