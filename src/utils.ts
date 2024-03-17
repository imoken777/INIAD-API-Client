import type { AxiosResponse } from 'axios';

export const dummyDescription = 'Dummy data is displayed for access from outside the INIAD Wi-Fi.';

export function handleErrors<T>(response: AxiosResponse<T>): T {
  if (response.status >= 500 && response.status <= 599) {
    const error = {
      status: response.status,
      statusText: response.statusText,
    };
    throw error;
  }
  return response.data;
}

export function makeBasicAuth(userId: string, password: string): string {
  const token = `${userId}:${password}`;
  const hash = btoa(token);
  return `Basic ${hash}`;
}
