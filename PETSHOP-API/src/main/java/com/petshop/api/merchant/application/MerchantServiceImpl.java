package com.petshop.api.merchant.application;

import com.petshop.api.auth.domain.Role;
import com.petshop.api.auth.domain.User;
import com.petshop.api.auth.domain.UserRole;
import com.petshop.api.auth.persistence.RoleRepository;
import com.petshop.api.auth.persistence.UserRepository;
import com.petshop.api.auth.persistence.UserRoleRepository;
import com.petshop.api.entity.merchant.Merchant;
import com.petshop.api.entity.merchant.MerchantBranch;
import com.petshop.api.entity.merchant.MerchantBusinessHour;
import com.petshop.api.entity.merchant.MerchantVerificationHistory;
import com.petshop.api.merchant.api.dto.*;
import com.petshop.api.merchant.application.exception.BranchCodeAlreadyExistsException;
import com.petshop.api.merchant.application.exception.BranchNotFoundException;
import com.petshop.api.merchant.application.exception.MerchantAlreadyExistsException;
import com.petshop.api.merchant.application.exception.MerchantNotFoundException;
import com.petshop.api.merchant.persistence.MerchantBranchRepository;
import com.petshop.api.merchant.persistence.MerchantBusinessHoursRepository;
import com.petshop.api.merchant.persistence.MerchantRepository;
import com.petshop.api.merchant.persistence.MerchantStaffRepository;
import com.petshop.api.merchant.persistence.MerchantVerificationHistoryRepository;
import com.petshop.api.entity.staff.MerchantStaff;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class MerchantServiceImpl implements MerchantService {

    private static final String STATUS_SUBMITTED = "SUBMITTED";
    private static final String STATUS_UNDER_REVIEW = "UNDER_REVIEW";
    private static final String STATUS_APPROVED = "APPROVED";
    private static final String STATUS_REJECTED = "REJECTED";
    private static final String ROLE_PETSHOP_OWNER = "PETSHOP_OWNER";

    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("HH:mm");

    private final MerchantRepository merchantRepository;
    private final MerchantVerificationHistoryRepository verificationHistoryRepository;
    private final MerchantBranchRepository branchRepository;
    private final MerchantBusinessHoursRepository businessHoursRepository;
    private final MerchantStaffRepository staffRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;

    public MerchantServiceImpl(MerchantRepository merchantRepository,
                               MerchantVerificationHistoryRepository verificationHistoryRepository,
                               MerchantBranchRepository branchRepository,
                               MerchantBusinessHoursRepository businessHoursRepository,
                               MerchantStaffRepository staffRepository,
                               UserRepository userRepository,
                               RoleRepository roleRepository,
                               UserRoleRepository userRoleRepository) {
        this.merchantRepository = merchantRepository;
        this.verificationHistoryRepository = verificationHistoryRepository;
        this.branchRepository = branchRepository;
        this.businessHoursRepository = businessHoursRepository;
        this.staffRepository = staffRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userRoleRepository = userRoleRepository;
    }

    @Override
    public MerchantApplicationResponse applyMerchant(UUID userId, ApplyMerchantRequest request) {
        // Check user doesn't already have a PENDING (SUBMITTED/UNDER_REVIEW) or APPROVED application
        boolean alreadyExists = merchantRepository.existsByOwnerUser_IdAndVerificationStatusInAndDeletedAtIsNull(
                userId, List.of(STATUS_SUBMITTED, STATUS_UNDER_REVIEW, STATUS_APPROVED));

        if (alreadyExists) {
            throw new MerchantAlreadyExistsException();
        }

        User ownerUser = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found"));

        Merchant merchant = Merchant.builder()
                .ownerUser(ownerUser)
                .businessName(request.businessName())
                .displayName(request.displayName())
                .description(request.description())
                .email(request.email())
                .phoneNumber(request.phoneNumber())
                .whatsappNumber(request.whatsappNumber())
                .nib(request.nib())
                .npwp(request.npwp())
                .verificationStatus(STATUS_SUBMITTED)
                .ratingCount(0)
                .build();

        merchant = merchantRepository.save(merchant);

        // Create verification history: null → SUBMITTED
        MerchantVerificationHistory history = MerchantVerificationHistory.builder()
                .merchant(merchant)
                .fromStatus(null)
                .toStatus(STATUS_SUBMITTED)
                .notes("Application submitted by user")
                .actedBy(ownerUser)
                .build();

        verificationHistoryRepository.save(history);

        return toApplicationResponse(merchant);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MerchantApplicationResponse> getMyApplications(UUID userId) {
        return merchantRepository.findByOwnerUser_IdAndDeletedAtIsNullOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toApplicationResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MerchantApplicationResponse> getAllApplications() {
        return merchantRepository.findByDeletedAtIsNullOrderByCreatedAtDesc()
                .stream()
                .map(this::toApplicationResponse)
                .toList();
    }

    @Override
    public MerchantSummaryResponse verifyMerchant(UUID adminUserId, UUID merchantId, VerifyMerchantRequest request) {
        Merchant merchant = merchantRepository.findById(merchantId)
                .orElseThrow(() -> new MerchantNotFoundException(merchantId));

        String currentStatus = merchant.getVerificationStatus();

        // Only SUBMITTED or UNDER_REVIEW merchants can be verified
        if (!STATUS_SUBMITTED.equals(currentStatus) && !STATUS_UNDER_REVIEW.equals(currentStatus)) {
            throw new IllegalStateException(
                    "Merchant cannot be verified in current status: " + currentStatus);
        }

        String decision = request.decision().toUpperCase();
        if (!STATUS_APPROVED.equals(decision) && !STATUS_REJECTED.equals(decision)) {
            throw new IllegalArgumentException("Decision must be APPROVED or REJECTED");
        }

        User adminUser = userRepository.findById(adminUserId)
                .orElseThrow(() -> new IllegalStateException("Admin user not found"));

        // Update merchant status
        merchant.setVerificationStatus(decision);

        if (STATUS_APPROVED.equals(decision)) {
            merchant.setVerifiedAt(Instant.now());
            merchant.setVerifiedBy(adminUser);

            // Assign PETSHOP_OWNER role to the merchant's owner
            assignPetshopOwnerRole(merchant.getOwnerUser());
        }

        merchant = merchantRepository.save(merchant);

        // Create verification history record
        MerchantVerificationHistory history = MerchantVerificationHistory.builder()
                .merchant(merchant)
                .fromStatus(currentStatus)
                .toStatus(decision)
                .notes(request.notes())
                .actedBy(adminUser)
                .build();

        verificationHistoryRepository.save(history);

        return toSummaryResponse(merchant);
    }

    private void assignPetshopOwnerRole(User owner) {
        Role petshopOwnerRole = roleRepository.findByCode(ROLE_PETSHOP_OWNER)
                .orElseThrow(() -> new IllegalStateException("Role PETSHOP_OWNER not found in database"));

        // Check if user already has this role
        boolean alreadyHasRole = owner.getUserRoles().stream()
                .anyMatch(ur -> ROLE_PETSHOP_OWNER.equals(ur.getRole().getCode()));

        if (!alreadyHasRole) {
            UserRole userRole = UserRole.builder()
                    .user(owner)
                    .role(petshopOwnerRole)
                    .build();
            userRoleRepository.save(userRole);
        }
    }

    // ===== US-MER-004: Profile Management =====

    @Override
    @Transactional(readOnly = true)
    public MerchantProfileResponse getProfile(UUID userId) {
        // Try as owner first
        Optional<Merchant> merchantOpt = merchantRepository.findByOwnerUser_IdAndVerificationStatusAndDeletedAtIsNull(userId, STATUS_APPROVED);
        if (merchantOpt.isPresent()) {
            return toProfileResponse(merchantOpt.get());
        }
        // Try as staff
        MerchantStaff staff = staffRepository.findFirstByUser_IdAndDeletedAtIsNull(userId)
                .orElseThrow(() -> new AccessDeniedException("No approved merchant found"));
        return toProfileResponse(staff.getMerchant());
    }

    @Override
    public MerchantProfileResponse updateProfile(UUID userId, UpdateMerchantProfileRequest request) {
        Merchant merchant = getAuthorizedMerchant(userId);

        if (request.displayName() != null) {
            merchant.setDisplayName(request.displayName());
        }
        if (request.description() != null) {
            merchant.setDescription(request.description());
        }
        if (request.email() != null) {
            merchant.setEmail(request.email());
        }
        if (request.phoneNumber() != null) {
            merchant.setPhoneNumber(request.phoneNumber());
        }
        if (request.whatsappNumber() != null) {
            merchant.setWhatsappNumber(request.whatsappNumber());
        }

        merchant = merchantRepository.save(merchant);
        return toProfileResponse(merchant);
    }

    // ===== US-MER-005: Create Branch =====

    @Override
    public BranchResponse createBranch(UUID userId, CreateBranchRequest request) {
        Merchant merchant = getAuthorizedMerchant(userId);

        // Generate branch code: BRN-001, BRN-002, etc.
        long branchCount = branchRepository.countByMerchant_IdAndDeletedAtIsNull(merchant.getId());
        String code = String.format("BRN-%03d", branchCount + 1);

        MerchantBranch branch = MerchantBranch.builder()
                .merchant(merchant)
                .code(code)
                .name(request.name())
                .phoneNumber(request.phoneNumber())
                .email(request.email())
                .provinceName(request.provinceName())
                .cityName(request.cityName())
                .districtName(request.districtName())
                .subdistrictName(request.subdistrictName())
                .postalCode(request.postalCode())
                .addressLine(request.addressLine())
                .latitude(request.latitude())
                .longitude(request.longitude())
                .isActive(true)
                .build();

        branch = branchRepository.save(branch);
        return toBranchResponse(branch);
    }

    // ===== US-MER-006: Manage Branches =====

    @Override
    @Transactional(readOnly = true)
    public List<BranchResponse> listBranches(UUID userId) {
        // Try as owner first
        Optional<Merchant> merchantOpt = merchantRepository.findByOwnerUser_IdAndVerificationStatusAndDeletedAtIsNull(userId, STATUS_APPROVED);
        if (merchantOpt.isPresent()) {
            return branchRepository.findByMerchant_IdAndDeletedAtIsNullOrderByCreatedAtDesc(merchantOpt.get().getId())
                    .stream().map(this::toBranchResponse).toList();
        }
        // Try as staff
        return listBranchesForStaff(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BranchResponse> listBranchesForStaff(UUID userId) {
        MerchantStaff staff = staffRepository.findFirstByUser_IdAndDeletedAtIsNull(userId)
                .orElseThrow(() -> new AccessDeniedException("User is not a staff member of any merchant"));
        return branchRepository.findByMerchant_IdAndDeletedAtIsNullOrderByCreatedAtDesc(staff.getMerchant().getId())
                .stream()
                .map(this::toBranchResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public BranchResponse getBranch(UUID userId, UUID branchId) {
        Merchant merchant = getAuthorizedMerchantOrStaffMerchant(userId);
        MerchantBranch branch = getAuthorizedBranch(merchant, branchId);
        return toBranchResponse(branch);
    }

    @Override
    public BranchResponse updateBranch(UUID userId, UUID branchId, UpdateBranchRequest request) {
        Merchant merchant = getAuthorizedMerchant(userId);
        MerchantBranch branch = getAuthorizedBranch(merchant, branchId);

        if (request.name() != null) {
            branch.setName(request.name());
        }
        if (request.phoneNumber() != null) {
            branch.setPhoneNumber(request.phoneNumber());
        }
        if (request.email() != null) {
            branch.setEmail(request.email());
        }
        if (request.provinceName() != null) {
            branch.setProvinceName(request.provinceName());
        }
        if (request.cityName() != null) {
            branch.setCityName(request.cityName());
        }
        if (request.districtName() != null) {
            branch.setDistrictName(request.districtName());
        }
        if (request.subdistrictName() != null) {
            branch.setSubdistrictName(request.subdistrictName());
        }
        if (request.postalCode() != null) {
            branch.setPostalCode(request.postalCode());
        }
        if (request.addressLine() != null) {
            branch.setAddressLine(request.addressLine());
        }
        if (request.latitude() != null) {
            branch.setLatitude(request.latitude());
        }
        if (request.longitude() != null) {
            branch.setLongitude(request.longitude());
        }
        if (request.isActive() != null) {
            branch.setIsActive(request.isActive());
        }

        branch = branchRepository.save(branch);
        return toBranchResponse(branch);
    }

    // ===== US-MER-007: Branch Hours =====

    @Override
    @Transactional(readOnly = true)
    public BranchHoursResponse getBranchHours(UUID userId, UUID branchId) {
        Merchant merchant = getAuthorizedMerchantOrStaffMerchant(userId);
        MerchantBranch branch = getAuthorizedBranch(merchant, branchId);

        List<MerchantBusinessHour> hours = businessHoursRepository.findByBranch_IdOrderByDayOfWeekAsc(branchId);
        return toBranchHoursResponse(branch.getId(), hours);
    }

    @Override
    public BranchHoursResponse setBranchHours(UUID userId, UUID branchId, SetBranchHoursRequest request) {
        Merchant merchant = getAuthorizedMerchant(userId);
        MerchantBranch branch = getAuthorizedBranch(merchant, branchId);

        // Delete existing hours and replace
        businessHoursRepository.deleteByBranch_Id(branchId);

        List<MerchantBusinessHour> newHours = request.hours().stream()
                .map(dayHours -> MerchantBusinessHour.builder()
                        .branch(branch)
                        .dayOfWeek((short) dayHours.dayOfWeek())
                        .openTime(dayHours.openTime() != null ? LocalTime.parse(dayHours.openTime(), TIME_FORMAT) : null)
                        .closeTime(dayHours.closeTime() != null ? LocalTime.parse(dayHours.closeTime(), TIME_FORMAT) : null)
                        .isClosed(dayHours.isClosed())
                        .build())
                .toList();

        List<MerchantBusinessHour> saved = businessHoursRepository.saveAll(newHours);
        return toBranchHoursResponse(branch.getId(), saved);
    }

    // ===== Authorization Helpers =====

    private Merchant getAuthorizedMerchant(UUID userId) {
        return merchantRepository.findByOwnerUser_IdAndVerificationStatusAndDeletedAtIsNull(userId, STATUS_APPROVED)
                .orElseThrow(() -> new AccessDeniedException("No approved merchant found for this user"));
    }

    private Merchant getAuthorizedMerchantOrStaffMerchant(UUID userId) {
        Optional<Merchant> merchantOpt = merchantRepository.findByOwnerUser_IdAndVerificationStatusAndDeletedAtIsNull(userId, STATUS_APPROVED);
        if (merchantOpt.isPresent()) {
            return merchantOpt.get();
        }
        MerchantStaff staff = staffRepository.findFirstByUser_IdAndDeletedAtIsNull(userId)
                .orElseThrow(() -> new AccessDeniedException("No approved merchant found for this user"));
        return staff.getMerchant();
    }

    private MerchantBranch getAuthorizedBranch(Merchant merchant, UUID branchId) {
        MerchantBranch branch = branchRepository.findByIdAndDeletedAtIsNull(branchId)
                .orElseThrow(() -> new BranchNotFoundException(branchId));

        if (!branch.getMerchant().getId().equals(merchant.getId())) {
            throw new AccessDeniedException("Branch does not belong to your merchant");
        }
        return branch;
    }

    // ===== Response Mappers =====

    private MerchantProfileResponse toProfileResponse(Merchant merchant) {
        return new MerchantProfileResponse(
                merchant.getId(),
                merchant.getBusinessName(),
                merchant.getDisplayName(),
                merchant.getDescription(),
                merchant.getEmail(),
                merchant.getPhoneNumber(),
                merchant.getWhatsappNumber(),
                merchant.getNib(),
                merchant.getNpwp(),
                merchant.getLogoFileId(),
                merchant.getBannerFileId(),
                merchant.getVerificationStatus(),
                merchant.getRatingAverage(),
                merchant.getRatingCount(),
                merchant.getVerifiedAt(),
                merchant.getCreatedAt(),
                merchant.getUpdatedAt()
        );
    }

    private BranchResponse toBranchResponse(MerchantBranch branch) {
        return new BranchResponse(
                branch.getId(),
                branch.getMerchant().getId(),
                branch.getCode(),
                branch.getName(),
                branch.getPhoneNumber(),
                branch.getEmail(),
                branch.getProvinceName(),
                branch.getCityName(),
                branch.getDistrictName(),
                branch.getSubdistrictName(),
                branch.getPostalCode(),
                branch.getAddressLine(),
                branch.getLatitude(),
                branch.getLongitude(),
                branch.getIsActive(),
                branch.getCreatedAt(),
                branch.getUpdatedAt()
        );
    }

    private BranchHoursResponse toBranchHoursResponse(UUID branchId, List<MerchantBusinessHour> hours) {
        List<BranchHoursResponse.DayHoursResponse> dayHoursList = hours.stream()
                .map(h -> new BranchHoursResponse.DayHoursResponse(
                        h.getId(),
                        h.getDayOfWeek(),
                        h.getOpenTime() != null ? h.getOpenTime().format(TIME_FORMAT) : null,
                        h.getCloseTime() != null ? h.getCloseTime().format(TIME_FORMAT) : null,
                        h.getIsClosed()
                ))
                .toList();
        return new BranchHoursResponse(branchId, dayHoursList);
    }

    private MerchantApplicationResponse toApplicationResponse(Merchant merchant) {
        return new MerchantApplicationResponse(
                merchant.getId(),
                merchant.getBusinessName(),
                merchant.getDisplayName(),
                merchant.getVerificationStatus(),
                merchant.getCreatedAt()
        );
    }

    private MerchantSummaryResponse toSummaryResponse(Merchant merchant) {
        return new MerchantSummaryResponse(
                merchant.getId(),
                merchant.getBusinessName(),
                merchant.getDisplayName(),
                merchant.getDescription(),
                merchant.getEmail(),
                merchant.getPhoneNumber(),
                merchant.getWhatsappNumber(),
                merchant.getNib(),
                merchant.getNpwp(),
                merchant.getVerificationStatus(),
                merchant.getVerifiedAt(),
                merchant.getCreatedAt(),
                merchant.getUpdatedAt()
        );
    }
}
