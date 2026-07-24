import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import ProtectedRoute from '@/components/Provider/ProtectedRoute';
import { useAuthStore } from '@/store/auth-store';

// Mock the router
const mockReplace = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: mockReplace,
    back: vi.fn(),
  }),
}));

describe('ProtectedRoute', () => {
  beforeEach(() => {
    mockReplace.mockClear();
    // Reset store to default state
    useAuthStore.setState({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      isHydrated: true,
    });
  });

  it('redirects unauthenticated users to /login', () => {
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(mockReplace).toHaveBeenCalledWith('/login');
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('shows children when authenticated without role requirement', () => {
    useAuthStore.setState({
      accessToken: 'token',
      refreshToken: 'rt',
      user: { id: '1', fullName: 'Test', email: 'test@test.com', phoneNumber: null, status: 'ACTIVE', roles: ['CUSTOMER'] },
      isAuthenticated: true,
      isHydrated: true,
    });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('shows children when user has an allowed role', () => {
    useAuthStore.setState({
      accessToken: 'token',
      refreshToken: 'rt',
      user: { id: '1', fullName: 'Test', email: 'test@test.com', phoneNumber: null, status: 'ACTIVE', roles: ['CUSTOMER'] },
      isAuthenticated: true,
      isHydrated: true,
    });

    render(
      <ProtectedRoute allowedRoles={['CUSTOMER']}>
        <div>Customer Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Customer Content')).toBeInTheDocument();
  });

  it('shows 403 when user lacks the required role', () => {
    useAuthStore.setState({
      accessToken: 'token',
      refreshToken: 'rt',
      user: { id: '1', fullName: 'Test', email: 'test@test.com', phoneNumber: null, status: 'ACTIVE', roles: ['CUSTOMER'] },
      isAuthenticated: true,
      isHydrated: true,
    });

    render(
      <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
        <div>Admin Content</div>
      </ProtectedRoute>
    );

    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
    expect(screen.getByText('Akses Ditolak')).toBeInTheDocument();
  });

  it('allows access for multi-role user if any role matches', () => {
    useAuthStore.setState({
      accessToken: 'token',
      refreshToken: 'rt',
      user: { id: '1', fullName: 'Owner', email: 'owner@test.com', phoneNumber: null, status: 'ACTIVE', roles: ['CUSTOMER', 'PETSHOP_OWNER'] },
      isAuthenticated: true,
      isHydrated: true,
    });

    render(
      <ProtectedRoute allowedRoles={['PETSHOP_OWNER', 'PETSHOP_ADMIN', 'PETSHOP_STAFF', 'GROOMER', 'VETERINARIAN']}>
        <div>Mitra Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Mitra Content')).toBeInTheDocument();
  });

  it('shows 403 for CUSTOMER trying to access admin routes', () => {
    useAuthStore.setState({
      accessToken: 'token',
      refreshToken: 'rt',
      user: { id: '1', fullName: 'Customer', email: 'cust@test.com', phoneNumber: null, status: 'ACTIVE', roles: ['CUSTOMER'] },
      isAuthenticated: true,
      isHydrated: true,
    });

    render(
      <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
        <div>Admin Content</div>
      </ProtectedRoute>
    );

    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
    expect(screen.getByText('Akses Ditolak')).toBeInTheDocument();
  });

  it('shows 403 for CUSTOMER trying to access mitra routes', () => {
    useAuthStore.setState({
      accessToken: 'token',
      refreshToken: 'rt',
      user: { id: '1', fullName: 'Customer', email: 'cust@test.com', phoneNumber: null, status: 'ACTIVE', roles: ['CUSTOMER'] },
      isAuthenticated: true,
      isHydrated: true,
    });

    render(
      <ProtectedRoute allowedRoles={['PETSHOP_OWNER', 'PETSHOP_ADMIN', 'PETSHOP_STAFF', 'GROOMER', 'VETERINARIAN']}>
        <div>Mitra Content</div>
      </ProtectedRoute>
    );

    expect(screen.queryByText('Mitra Content')).not.toBeInTheDocument();
    expect(screen.getByText('Akses Ditolak')).toBeInTheDocument();
  });

  it('shows spinner while hydrating', () => {
    useAuthStore.setState({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      isHydrated: false,
    });

    const { container } = render(
      <ProtectedRoute>
        <div>Content</div>
      </ProtectedRoute>
    );

    expect(screen.queryByText('Content')).not.toBeInTheDocument();
    // Should show spinner
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('shows spinner while session restore is in progress', () => {
    useAuthStore.setState({
      accessToken: null,
      refreshToken: 'rt-to-restore',
      user: null,
      isAuthenticated: false,
      isHydrated: true,
    });

    const { container } = render(
      <ProtectedRoute>
        <div>Content</div>
      </ProtectedRoute>
    );

    expect(screen.queryByText('Content')).not.toBeInTheDocument();
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('allows ADMIN to access admin routes', () => {
    useAuthStore.setState({
      accessToken: 'token',
      refreshToken: 'rt',
      user: { id: '1', fullName: 'Admin', email: 'admin@test.com', phoneNumber: null, status: 'ACTIVE', roles: ['ADMIN'] },
      isAuthenticated: true,
      isHydrated: true,
    });

    render(
      <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
        <div>Admin Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });

  it('allows GROOMER to access mitra routes', () => {
    useAuthStore.setState({
      accessToken: 'token',
      refreshToken: 'rt',
      user: { id: '1', fullName: 'Groomer', email: 'groomer@test.com', phoneNumber: null, status: 'ACTIVE', roles: ['GROOMER'] },
      isAuthenticated: true,
      isHydrated: true,
    });

    render(
      <ProtectedRoute allowedRoles={['PETSHOP_OWNER', 'PETSHOP_ADMIN', 'PETSHOP_STAFF', 'GROOMER', 'VETERINARIAN']}>
        <div>Mitra Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Mitra Content')).toBeInTheDocument();
  });
});
