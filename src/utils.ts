import type { ValidatedCardIDm } from './types/internal';
import type { StatusInfo } from './types/public';

export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

export class HttpError extends Error {
  public readonly status: number;

  public readonly statusText: string;

  constructor(status: number, statusText: string) {
    super(`Request failed with status ${status}: ${statusText}`);
    this.name = 'HttpError';
    this.status = status;
    this.statusText = statusText;
  }
}

export const isHttpError = (error: unknown): error is HttpError => {
  return error instanceof HttpError;
};

const parseResponseBody = async <T>(response: Response): Promise<T> => {
  const responseText = await response.text();

  if (responseText.length === 0) {
    return undefined as T;
  }

  return JSON.parse(responseText) as T;
};

export const fetchJson = async <T>(
  url: string,
  authHeader: string,
  init?: RequestInit,
): Promise<ApiResponse<T>> => {
  const mergedHeaders = {
    Authorization: authHeader,
    ...(init?.headers ?? {}),
  };

  const response = await fetch(url, {
    ...init,
    headers: mergedHeaders,
  });

  if (!response.ok) {
    throw new HttpError(response.status, response.statusText);
  }

  const data = await parseResponseBody<T>(response);

  return {
    data,
    status: response.status,
    statusText: response.statusText,
  };
};

export const dummyStatusInfo: StatusInfo = {
  status: 'dummy',
  description: 'Dummy data is displayed for access from outside the INIAD Wi-Fi.',
};

export const handleErrors = <T>(response: ApiResponse<T>): T => {
  if (response.status >= 500 && response.status <= 599) {
    throw new HttpError(response.status, response.statusText);
  }
  return response.data;
};

export const makeBasicAuth = (userId: string, password: string): string => {
  const token = `${userId}:${password}`;
  const hash = btoa(token);
  return `Basic ${hash}`;
};

const isCardIDm = (input: string): input is ValidatedCardIDm => {
  return input.length === 16 && input.match(/^[0-9A-Z]+$/) !== null;
};

export const validateCardIDm = (input: string): ValidatedCardIDm => {
  if (isCardIDm(input)) {
    return input;
  }
  throw new Error(
    'The IDm entered is invalid: the IDm must consist of only 16 digits (0-9) and capital letters (A-Z)',
  );
};
