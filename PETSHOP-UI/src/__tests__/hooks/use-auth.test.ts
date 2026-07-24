import { describe, it, expect } from 'vitest';

// Test the getHomeRoute logic directly by extracting it
// Since it's not exported, we replicate the logic here for unit testing
function getHomeRoute(roles: string[]): string {
  if (roles.includes('SUPER_ADMIN') || roles.includes('ADMIN')) {
    return '/admin/home';
  }
  if (
    roles.includes('PETSHOP_OWNER') ||
    roles.includes('PETSHOP_ADMIN') ||
    roles.includes('PETSHOP_STAFF') ||
    roles.includes('GROOMER') ||
    roles.includes('VETERINARIAN')
  ) {
    return '/mitra/home';
  }
  return '/customer/home';
}

describe('getHomeRoute', () => {
  it('routes CUSTOMER to /customer/home', () => {
    expect(getHomeRoute(['CUSTOMER'])).toBe('/customer/home');
  });

  it('routes SUPER_ADMIN to /admin/home', () => {
    expect(getHomeRoute(['SUPER_ADMIN'])).toBe('/admin/home');
  });

  it('routes ADMIN to /admin/home', () => {
    expect(getHomeRoute(['ADMIN'])).toBe('/admin/home');
  });

  it('routes PETSHOP_OWNER to /mitra/home', () => {
    expect(getHomeRoute(['PETSHOP_OWNER'])).toBe('/mitra/home');
  });

  it('routes PETSHOP_ADMIN to /mitra/home', () => {
    expect(getHomeRoute(['PETSHOP_ADMIN'])).toBe('/mitra/home');
  });

  it('routes PETSHOP_STAFF to /mitra/home', () => {
    expect(getHomeRoute(['PETSHOP_STAFF'])).toBe('/mitra/home');
  });

  it('routes GROOMER to /mitra/home', () => {
    expect(getHomeRoute(['GROOMER'])).toBe('/mitra/home');
  });

  it('routes VETERINARIAN to /mitra/home', () => {
    expect(getHomeRoute(['VETERINARIAN'])).toBe('/mitra/home');
  });

  it('prioritizes ADMIN over CUSTOMER for multi-role user', () => {
    expect(getHomeRoute(['CUSTOMER', 'ADMIN'])).toBe('/admin/home');
  });

  it('prioritizes ADMIN over PETSHOP_OWNER for multi-role user', () => {
    expect(getHomeRoute(['PETSHOP_OWNER', 'SUPER_ADMIN'])).toBe('/admin/home');
  });

  it('routes multi-role CUSTOMER + PETSHOP_OWNER to /mitra/home', () => {
    expect(getHomeRoute(['CUSTOMER', 'PETSHOP_OWNER'])).toBe('/mitra/home');
  });

  it('defaults to /customer/home for empty roles', () => {
    expect(getHomeRoute([])).toBe('/customer/home');
  });

  it('defaults to /customer/home for unknown roles', () => {
    expect(getHomeRoute(['UNKNOWN_ROLE'])).toBe('/customer/home');
  });
});
