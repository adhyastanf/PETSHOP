import { JWTPayload } from '@/types/auth';
import { jwtDecode } from 'jwt-decode';

export function formatCurrency(value: number) {
  return `Rp${new Intl.NumberFormat('id-ID').format(value)}`;
}

export function jwtDecodeUtils(token: string): JWTPayload {
  const decoded = jwtDecode<JWTPayload>(token);
  return decoded;
}

export function onlyNumbers(value: string) {
  return value.replace(/\D/g, '');
}

export function toSelectOptions<T, TLabelKey extends keyof T, TValueKey extends keyof T>(items: T[] | undefined, labelKey: TLabelKey, valueKey: TValueKey): SelectOption<T[TValueKey]>[] {
  return (
    items?.map((item) => ({
      label: String(item[labelKey]),
      value: item[valueKey],
    })) ?? []
  );
}

type SelectOption<TValue> = {
  label: string;
  value: TValue;
};
