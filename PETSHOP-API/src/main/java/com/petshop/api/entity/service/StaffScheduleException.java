package com.petshop.api.entity.service;

import com.petshop.api.entity.base.BaseEntity;
import com.petshop.api.entity.merchant.MerchantBranch;
import com.petshop.api.entity.staff.MerchantStaff;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "staff_schedule_exceptions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffScheduleException extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id", nullable = false)
    private MerchantStaff staff;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    private MerchantBranch branch;

    @Column(name = "exception_date", nullable = false)
    private LocalDate exceptionDate;

    @Column(name = "is_available", nullable = false)
    private Boolean isAvailable;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @Column(name = "reason", length = 255)
    private String reason;
}
