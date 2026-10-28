import { getAuthErrorMessages } from './auth-errors';
import { getCommonErrorMessages } from './common-errors'; // Contoh file common error

export const getTranslatedErrorMessages = (t: (key: string) => string) => ({
  ...getAuthErrorMessages(t),
  ...getCommonErrorMessages(t),
});
