export function hasPermission(authorities: string[] | undefined, permission: string): boolean {
  if (!authorities) return false;
  return authorities.includes(permission);
}

export function hasAnyPermission(authorities: string[] | undefined, permissions: string[]): boolean {
  if (!authorities) return false;
  return permissions.some((p) => authorities.includes(p));
}

export function hasAllPermissions(authorities: string[] | undefined, permissions: string[]): boolean {
  if (!authorities) return false;
  return permissions.every((p) => authorities.includes(p));
}
    
export function hasRole(authorities: string[] | undefined, role: string): boolean {
  if (!authorities) return false;
  return authorities.includes(role);
}

export function isSuperAdmin(authorities: string[] | undefined): boolean {
  return hasRole(authorities, 'ROLE_SUPER_ADMIN');
}
