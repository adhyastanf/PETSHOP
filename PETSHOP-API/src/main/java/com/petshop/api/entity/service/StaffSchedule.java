package com.petshop.api.entity.service;

import com.petshop.api.entity.base.BaseEntity;
import com.petshop.api.entity.merchant.MerchantBranch;
import com.petshop.api.entity.staff.MerchantStaff;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalTime;

@Entity
@Table(name = "staff_schedules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffSchedule extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id", nullable = false)
    private MerchantStaff staff;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    private MerchantBranch branch;

    @Column(name = "day_of_week", nullable = false)
    private Short dayOfWeek;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(name = "capacity", nullable = false)
    private Integer capacity;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;
}
