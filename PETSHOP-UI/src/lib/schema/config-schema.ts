import { z } from 'zod';
import type { SystemConfig } from '@/features/config/types';
import { MSG_INVALID_NUMBER, requiredString } from './validation';

/**
 * Builds the schema for a single system-configuration value, based on its declared type.
 * UX-only; the backend validates type and range authoritatively.
 */
export function createSystemConfigSchema(valueType: SystemConfig['valueType']) {
  const value = requiredString.refine(
    (v) => {
      switch (valueType) {
        case 'INTEGER':
          return /^-?\d+$/.test(v);
        case 'DECIMAL':
          return !Number.isNaN(Number(v));
        case 'BOOLEAN':
          return v === 'true' || v === 'false';
        default:
          return true;
      }
    },
    { message: MSG_INVALID_NUMBER },
  );

  return z.object({ value });
}

export type SystemConfigFormSchema = z.infer<ReturnType<typeof createSystemConfigSchema>>;
