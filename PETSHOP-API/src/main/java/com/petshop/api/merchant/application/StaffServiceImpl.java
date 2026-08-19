package com.petshop.api.merchant.application;

import com.petshop.api.auth.domain.Role;
import com.petshop.api.auth.domain.User;
import com.petshop.api.auth.domain.UserRole;
import com.petshop.api.auth.persistence.RoleRepository;
import com.petshop.api.auth.persistence.UserRepository;
import com.petshop.api.auth.persistence.UserRoleRepository;
import com.petshop.api.entity.merchant.Merchant;
import com.petshop.api.entity.merchant.MerchantBranch;
import com.petshop.api.entity.staff.MerchantStaff;
import com.petshop.api.entity.staff.MerchantStaffBranch;
import com.petshop.api.entity.staff.VeterinarianProfile;
import com.petshop.api.merchant.api.dto.*;
import com.petshop.api.merchant.application.exception.StaffNotFoundException;
import com.petshop.api.merchant.persistence.MerchantBranchRepository;
import com.petshop.api.merchant.persistence.MerchantRepository;
import com.petshop.api.merchant.persistence.MerchantStaffBranchRepository;
import com.petshop.api.merchant.persistence.MerchantStaffRepository;
import com.petshop.api.merchant.persistence.VeterinarianProfileRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
@Transactional
public class StaffServiceImpl implements StaffService {

    private static final String STATUS_APPROVED = "APPROVED";
    private static final String STATUS_ACTIVE = "ACTIVE";
    private static final String STATUS_INACTIVE = "INACTIVE";
    private static final String ROLE_VETERINARIAN = "VETERINARIAN";

    private static final Set<String> MERCHANT_SCOPE_ROLES = Set.of(
            "PETSHOP_STAFF", "PETSHOP_ADMIN", "GROOMER", "VETERINARIAN"
    );

    private final MerchantRepository merchantRepository;
    private final MerchantStaffRepository staffRepository;
    private final MerchantStaffBranchRepository staffBranchRepository;
    private final MerchantBranchRepository branchRepository;
    private final VeterinarianProfileRepository vetProfileRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;

    public StaffServiceImpl(MerchantRepository merchantRepository,
                            MerchantStaffRepository staffRepository,
                            MerchantStaffBranchRepository staffBranchRepository,
                            MerchantBranchRepository branchRepository,
                            VeterinarianProfileRepository vetProfileRepository,
                            UserRepository userRepository,
                            RoleRepository roleRepository,
                            UserRoleRepository userRoleRepository) {
        this.merchantRepository = merchantRepository;
        this.staffRepository = staffRepository;
        this.staffBranchRepository = staffBranchRepository;
        this.branchRepository = branchRepository;
        this.vetProfileRepository = vetProfileRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userRoleRepository = userRoleRepository;
    }

    // ===== US-MER-008: Manage Staff =====

    @Override
    public StaffResponse addStaff(UUID userId, AddStaffRequest request) {
        Merchant merchant = getAuthorizedMerchant(userId);

        // Validate role is merchant-scope
        if (!MERCHANT_SCOPE_ROLES.contains(request.roleCode())) {
            throw new IllegalArgumentException(
                    "Invalid role code. Must be one of: " + MERCHANT_SCOPE_ROLES);
        }

        // Verify target user exists by email
        User targetUser = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + request.email()));

        // Verify role exists
        Role role = roleRepository.findByCode(request.roleCode())
                .orElseThrow(() -> new IllegalStateException("Role not found: " + request.roleCode()));

        // Check staff doesn't already exist for this merchant+user
        if (staffRepository.existsByMerchant_IdAndUser_IdAndDeletedAtIsNull(merchant.getId(), targetUser.getId())) {
            throw new IllegalStateException("Staff record already exists for this user in this merchant");
        }

        // Create staff record
        MerchantStaff staff = MerchantStaff.builder()
                .merchant(merchant)
                .user(targetUser)
                .role(role)
                .employeeCode(request.employeeCode())
                .displayName(request.displayName())
                .status(STATUS_ACTIVE)
                .joinedAt(LocalDate.now())
                .build();

        staff = staffRepository.save(staff);

        // Assign role to user if not already assigned
        assignRoleToUser(targetUser, role);

        // If veterinarian, create a pending vet profile
        if (ROLE_VETERINARIAN.equals(request.roleCode())) {
            createPendingVetProfile(staff);
        }

        return toStaffResponse(staff);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StaffResponse> listStaff(UUID userId) {
        Merchant merchant = getAuthorizedMerchantOrStaffMerchant(userId);
        return staffRepository.findByMerchant_IdAndDeletedAtIsNullOrderByCreatedAtDesc(merchant.getId())
                .stream()
                .map(this::toStaffResponse)
                .toList();
    }

    @Override
    public StaffResponse updateStaff(UUID userId, UUID staffId, UpdateStaffRequest request) {
        Merchant merchant = getAuthorizedMerchant(userId);
        MerchantStaff staff = getAuthorizedStaff(merchant, staffId);

        if (request.status() != null) {
            if (!STATUS_ACTIVE.equals(request.status()) && !STATUS_INACTIVE.equals(request.status())) {
                throw new IllegalArgumentException("Status must be ACTIVE or INACTIVE");
            }
            staff.setStatus(request.status());
        }
        if (request.displayName() != null) {
            staff.setDisplayName(request.displayName());
        }

        staff = staffRepository.save(staff);
        return toStaffResponse(staff);
    }

    @Override
    public void deleteStaff(UUID userId, UUID staffId) {
        Merchant merchant = getAuthorizedMerchant(userId);
        MerchantStaff staff = getAuthorizedStaff(merchant, staffId);

        // Soft-delete
        staff.setDeletedAt(Instant.now());
        staff.setStatus(STATUS_INACTIVE);
        staffRepository.save(staff);
    }

    // ===== US-MER-009: Staff Branch Assignment =====

    @Override
    public StaffBranchResponse assignBranch(UUID userId, UUID staffId, AssignBranchRequest request) {
        Merchant merchant = getAuthorizedMerchant(userId);
        MerchantStaff staff = getAuthorizedStaff(merchant, staffId);

        // Verify branch exists and belongs to same merchant
        MerchantBranch branch = branchRepository.findByIdAndDeletedAtIsNull(request.branchId())
                .orElseThrow(() -> new IllegalArgumentException("Branch not found: " + request.branchId()));

        if (!branch.getMerchant().getId().equals(merchant.getId())) {
            throw new AccessDeniedException("Branch does not belong to this merchant");
        }

        // Check if assignment already exists
        if (staffBranchRepository.existsByStaff_IdAndBranch_Id(staffId, request.branchId())) {
            throw new IllegalStateException("Staff is already assigned to this branch");
        }

        MerchantStaffBranch staffBranch = MerchantStaffBranch.builder()
                .staff(staff)
                .branch(branch)
                .build();

        staffBranchRepository.save(staffBranch);

        return toStaffBranchResponse(staffBranch);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StaffBranchResponse> listStaffBranches(UUID userId, UUID staffId) {
        Merchant merchant = getAuthorizedMerchantOrStaffMerchant(userId);
        getAuthorizedStaff(merchant, staffId);

        return staffBranchRepository.findByStaff_Id(staffId)
                .stream()
                .map(this::toStaffBranchResponse)
                .toList();
    }

    @Override
    public void removeBranchAssignment(UUID userId, UUID staffId, UUID branchId) {
        Merchant merchant = getAuthorizedMerchant(userId);
        getAuthorizedStaff(merchant, staffId);

        if (!staffBranchRepository.existsByStaff_IdAndBranch_Id(staffId, branchId)) {
            throw new IllegalArgumentException("Staff branch assignment not found");
        }

        staffBranchRepository.deleteByStaff_IdAndBranch_Id(staffId, branchId);
    }

    // ===== US-MER-010: Veterinarian Verification =====

    @Override
    public void verifyVeterinarian(UUID adminUserId, UUID staffId, VerifyVetRequest request) {
        MerchantStaff staff = staffRepository.findByIdAndDeletedAtIsNull(staffId)
                .orElseThrow(() -> new StaffNotFoundException(staffId));

        // Verify staff has VETERINARIAN role
        if (!ROLE_VETERINARIAN.equals(staff.getRole().getCode())) {
            throw new IllegalArgumentException("Staff member is not a veterinarian");
        }

        String decision = request.decision().toUpperCase();
        if (!"VERIFIED".equals(decision) && !"REJECTED".equals(decision)) {
            throw new IllegalArgumentException("Decision must be VERIFIED or REJECTED");
        }

        User adminUser = userRepository.findById(adminUserId)
                .orElseThrow(() -> new IllegalStateException("Admin user not found"));

        // Find or create vet profile
        VeterinarianProfile profile = vetProfileRepository.findByStaffId(staffId)
                .orElseGet(() -> {
                    VeterinarianProfile newProfile = VeterinarianProfile.builder()
                            .staff(staff)
                            .verificationStatus("PENDING")
                            .build();
                    return vetProfileRepository.save(newProfile);
                });

        profile.setVerificationStatus(decision);
        profile.setNotes(request.notes());

        if ("VERIFIED".equals(decision)) {
            profile.setVerifiedAt(Instant.now());
            profile.setVerifiedBy(adminUser);
        } else {
            profile.setVerifiedAt(null);
            profile.setVerifiedBy(null);
        }

        vetProfileRepository.save(profile);
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

    private MerchantStaff getAuthorizedStaff(Merchant merchant, UUID staffId) {
        MerchantStaff staff = staffRepository.findByIdAndDeletedAtIsNull(staffId)
                .orElseThrow(() -> new StaffNotFoundException(staffId));

        if (!staff.getMerchant().getId().equals(merchant.getId())) {
            throw new AccessDeniedException("Staff member does not belong to your merchant");
        }
        return staff;
    }

    private void assignRoleToUser(User user, Role role) {
        boolean alreadyHasRole = user.getUserRoles().stream()
                .anyMatch(ur -> ur.getRole().getCode().equals(role.getCode()));

        if (!alreadyHasRole) {
            UserRole userRole = UserRole.builder()
                    .user(user)
                    .role(role)
                    .build();
            userRoleRepository.save(userRole);
        }
    }

    private void createPendingVetProfile(MerchantStaff staff) {
        if (vetProfileRepository.findByStaffId(staff.getId()).isEmpty()) {
            VeterinarianProfile profile = VeterinarianProfile.builder()
                    .staff(staff)
                    .verificationStatus("PENDING")
                    .build();
            vetProfileRepository.save(profile);
        }
    }

    // ===== Admin: All Veterinarians =====

    @Override
    @Transactional(readOnly = true)
    public List<StaffResponse> listAllVeterinarians() {
        return staffRepository.findByRole_CodeAndDeletedAtIsNullOrderByCreatedAtDesc(ROLE_VETERINARIAN)
                .stream()
                .map(this::toStaffResponse)
                .toList();
    }

    // ===== Response Mappers =====

    private StaffResponse toStaffResponse(MerchantStaff staff) {
        return new StaffResponse(
                staff.getId(),
                staff.getMerchant().getId(),
                staff.getUser().getId(),
                staff.getUser().getFullName(),
                staff.getRole().getCode(),
                staff.getRole().getName(),
                staff.getEmployeeCode(),
                staff.getDisplayName(),
                staff.getStatus(),
                staff.getJoinedAt(),
                staff.getCreatedAt(),
                staff.getUpdatedAt()
        );
    }

    private StaffBranchResponse toStaffBranchResponse(MerchantStaffBranch staffBranch) {
        return new StaffBranchResponse(
                staffBranch.getStaff().getId(),
                staffBranch.getBranch().getId(),
                staffBranch.getBranch().getName(),
                staffBranch.getBranch().getCode()
        );
    }
}
