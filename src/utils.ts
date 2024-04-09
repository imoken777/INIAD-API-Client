import type { AxiosResponse } from 'axios';
import type { ValidatedCardIDm } from './types';

export const dummyDescription = 'Dummy data is displayed for access from outside the INIAD Wi-Fi.';

export const handleErrors = <T>(response: AxiosResponse<T>): T => {
  if (response.status >= 500 && response.status <= 599) {
    const error = {
      status: response.status,
      statusText: response.statusText,
    };
    throw error;
  }
  return response.data;
};

export const makeBasicAuth = (userId: string, password: string): string => {
  const token = `${userId}:${password}`;
  const hash = btoa(token);
  return `Basic ${hash}`;
};

export const validateCardIDm = (input: string): ValidatedCardIDm => {
  if (input.length === 16 && input.match(/^[0-9A-Z]+$/)) {
    return input as ValidatedCardIDm;
  } else {
    throw new Error(
      'The IDm entered is invalid: the IDm must consist of only 16 digits (0-9) and capital letters (A-Z)',
    );
  }
};
