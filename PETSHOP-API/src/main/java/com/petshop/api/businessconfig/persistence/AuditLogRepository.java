package com.petshop.api.businessconfig.persistence;

import com.petshop.api.entity.system.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {

    Page<AuditLog> findByEntityTypeOrderByCreatedAtDesc(String entityType, Pageable pageable);
}
