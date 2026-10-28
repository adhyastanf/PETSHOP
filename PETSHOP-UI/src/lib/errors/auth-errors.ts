export const AUTH_ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Email atau password salah.',
  UNAUTHENTICATED: 'Email atau password salah.',
  ACCOUNT_BLOCKED: 'Akun Anda diblokir. Hubungi dukungan.',
  ACCOUNT_INACTIVE: 'Akun Anda tidak aktif.',
  ACCOUNT_SUSPENDED: 'Akun Anda ditangguhkan.',
  TOKEN_EXPIRED: 'Sesi Anda telah berakhir. Silakan login kembali.',
  INVALID_TOKEN: 'Sesi tidak valid. Silakan login kembali.',
  REFRESH_TOKEN_EXPIRED: 'Sesi Anda telah berakhir. Silakan login kembali.',
  INVALID_REFRESH_TOKEN: 'Sesi Anda telah berakhir. Silakan login kembali.',
  UNAUTHORIZED: 'Silakan login untuk melanjutkan.',
  FORBIDDEN: 'Anda tidak memiliki akses.',
  DUPLICATE_EMAIL: 'Email sudah terdaftar',
} as const;

export const getAuthErrorMessages = (t: (key: string) => string) =>
  ({
    INVALID_CREDENTIALS: t('auth.login.invalidCredentials'),
    UNAUTHENTICATED: t('auth.login.invalidCredentials'),
    ACCOUNT_BLOCKED: t('auth.login.accountBlocked'),
    ACCOUNT_INACTIVE: t('auth.login.accountInactive'),
    ACCOUNT_SUSPENDED: t('auth.login.accountSuspended'),
    TOKEN_EXPIRED: t('error.sessionExpired'),
    INVALID_TOKEN: t('error.sessionExpired'),
    REFRESH_TOKEN_EXPIRED: t('error.sessionExpired'),
    INVALID_REFRESH_TOKEN: t('error.sessionExpired'),
    UNAUTHORIZED: 'Silakan login untuk melanjutkan.',
    FORBIDDEN: 'Anda tidak memiliki akses.',
    DUPLICATE_EMAIL: 'Email sudah terdaftar',
  }) as const;
