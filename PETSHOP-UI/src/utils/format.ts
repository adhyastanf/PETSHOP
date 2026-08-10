import { JWTPayload } from '@/types/auth';
import { jwtDecode } from 'jwt-decode';

export function formatCurrency(value: number) {
  return `Rp${new Intl.NumberFormat('id-ID').format(value)}`;
}

export function jwtDecodeUtils(token: string): JWTPayload {
  const decoded = jwtDecode<JWTPayload>(token);
  return decoded;
}
