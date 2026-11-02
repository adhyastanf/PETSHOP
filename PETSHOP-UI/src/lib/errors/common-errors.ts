export const getCommonErrorMessages = (t: (key: string) => string) =>
  ({
    NETWORK_ERROR: t('common.networkError'),
    INTERNAL_SERVER_ERROR: t('common.networkError'),
  }) as const;
