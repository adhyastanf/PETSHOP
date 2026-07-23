package com.petshop.api.entity.system;

import com.petshop.api.entity.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "files")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FileEntity extends BaseEntity {

    @Column(name = "storage_provider", nullable = false, length = 50)
    private String storageProvider;

    @Column(name = "bucket_name", nullable = false, length = 255)
    private String bucketName;

    @Column(name = "object_key", nullable = false, unique = true, length = 500)
    private String objectKey;

    @Column(name = "original_filename", length = 255)
    private String originalFilename;

    @Column(name = "content_type", length = 100)
    private String contentType;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "checksum", length = 128)
    private String checksum;

    @Column(name = "uploaded_by")
    private UUID uploadedBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "deleted_at")
    private Instant deletedAt;
}
