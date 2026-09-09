/**
 * Locale resource loader.
 * Loads all namespaces for a given locale.
 */

import enCommon from './en/common.json';
import enAuth from './en/auth.json';
import enCustomer from './en/customer.json';
import enPet from './en/pet.json';
import enAddress from './en/address.json';
import enError from './en/error.json';
import enMerchant from './en/merchant.json';
import enConfig from './en/config.json';

import idCommon from './id/common.json';
import idAuth from './id/auth.json';
import idCustomer from './id/customer.json';
import idPet from './id/pet.json';
import idAddress from './id/address.json';
import idError from './id/error.json';
import idMerchant from './id/merchant.json';
import idConfig from './id/config.json';

export type Locale = 'en' | 'id';

export const SUPPORTED_LOCALES: Locale[] = ['en', 'id'];
export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  id: 'Bahasa Indonesia',
};

type Messages = Record<string, unknown>;

const messages: Record<Locale, Messages> = {
  en: {
    common: enCommon,
    auth: enAuth,
    customer: enCustomer,
    pet: enPet,
    address: enAddress,
    error: enError,
    merchant: enMerchant,
    config: enConfig,
  },
  id: {
    common: idCommon,
    auth: idAuth,
    customer: idCustomer,
    pet: idPet,
    address: idAddress,
    error: idError,
    merchant: idMerchant,
    config: idConfig,
  },
};

export function getMessages(locale: Locale): Messages {
  return messages[locale] ?? messages[DEFAULT_LOCALE];
}
