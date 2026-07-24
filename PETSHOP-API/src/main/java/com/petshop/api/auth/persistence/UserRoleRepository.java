package com.petshop.api.auth.persistence;

import com.petshop.api.auth.domain.UserRole;
import com.petshop.api.auth.domain.UserRoleId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, UserRoleId> {
}
