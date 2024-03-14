import { AxiosResponse } from "axios";

export function handleErrors<T>(response: AxiosResponse<T>): T {
  if (response.status >= 500 && response.status <= 599) {
    let error = {
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
