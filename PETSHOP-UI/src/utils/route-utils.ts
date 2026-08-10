export function getHomeRoute(roles: string[]): string {
  if (roles.includes('SUPER_ADMIN') || roles.includes('ADMIN')) {
    return '/admin';
  }
  if (roles.includes('PETSHOP_OWNER') || roles.includes('PETSHOP_ADMIN') || roles.includes('PETSHOP_STAFF') || roles.includes('GROOMER') || roles.includes('VETERINARIAN')) {
    return '/mitra';
  }
  return '/';
}
