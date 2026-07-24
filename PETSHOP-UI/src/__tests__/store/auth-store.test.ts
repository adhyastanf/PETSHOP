import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '@/store/auth-store';

describe('auth-store', () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      isHydrated: false,
    });
  });

  it('starts with unauthenticated state', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(state.user).toBeNull();
  });

  it('setTokens sets tokens and marks authenticated', () => {
    useAuthStore.getState().setTokens('access-123', 'refresh-456');
    const state = useAuthStore.getState();

    expect(state.accessToken).toBe('access-123');
    expect(state.refreshToken).toBe('refresh-456');
    expect(state.isAuthenticated).toBe(true);
  });

  it('setUser sets user profile', () => {
    const user = {
      id: 'uuid-1',
      fullName: 'John Doe',
      email: 'john@test.com',
      phoneNumber: '+6281234567890',
      status: 'ACTIVE',
      roles: ['CUSTOMER'],
    };

    useAuthStore.getState().setUser(user);
    expect(useAuthStore.getState().user).toEqual(user);
  });

  it('clearAuth resets all state', () => {
    useAuthStore.getState().setTokens('access', 'refresh');
    useAuthStore.getState().setUser({
      id: '1',
      fullName: 'Test',
      email: 'test@test.com',
      phoneNumber: null,
      status: 'ACTIVE',
      roles: ['CUSTOMER'],
    });

    useAuthStore.getState().clearAuth();
    const state = useAuthStore.getState();

    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
