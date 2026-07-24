package com.petshop.api.auth.application;

import com.petshop.api.auth.domain.Role;
import com.petshop.api.auth.domain.RolePermission;
import com.petshop.api.auth.persistence.RoleRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

/**
 * Implementation of {@link RbacService} that loads roles and permissions
 * from the database and maps them to Spring Security granted authorities.
 */
@Service
public class RbacServiceImpl implements RbacService {

    private final RoleRepository roleRepository;

    public RbacServiceImpl(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Set<GrantedAuthority> loadAuthorities(UUID userId) {
        List<Role> roles = roleRepository.findRolesByUserId(userId);

        Set<GrantedAuthority> authorities = new HashSet<>();
        for (Role role : roles) {
            authorities.add(new SimpleGrantedAuthority("ROLE_" + role.getCode()));
            for (RolePermission rp : role.getRolePermissions()) {
                authorities.add(new SimpleGrantedAuthority("PERM_" + rp.getPermission().getCode()));
            }
        }
        return authorities;
    }
}
