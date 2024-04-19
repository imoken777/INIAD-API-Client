import type { AxiosResponse, AxiosResponseHeaders } from 'axios';
import { handleErrors, makeBasicAuth, validateCardIDm } from '../src/utils';

describe('handleErrors', () => {
  it('ステータスコードが5xxでない場合はレスポンスデータを返すべきです', () => {
    const mockResponse: AxiosResponse = {
      data: { message: 'OK' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { headers: {} as AxiosResponseHeaders },
    };

    expect(handleErrors(mockResponse)).toEqual({ message: 'OK' });
  });

  it('ステータスコードが5xxの場合はエラーをスローするべきです', () => {
    const mockResponse: AxiosResponse = {
      data: { message: 'Internal Server Error' },
      status: 500,
      statusText: 'Internal Server Error',
      headers: {},
      config: { headers: {} as AxiosResponseHeaders },
    };

    expect(() => handleErrors(mockResponse)).toThrow();
  });
});

describe('makeBasicAuth', () => {
  it('正しくフォーマットされた基本認証ヘッダーを返すべきです', () => {
    const userId = 'user';
    const password = 'password';
    const token = `${userId}:${password}`;
    const hash = btoa(token);
    const expectedAuthHeader = `Basic ${hash}`;

    expect(makeBasicAuth(userId, password)).toEqual(expectedAuthHeader);
  });
});

describe('validateCardIDm', () => {
  it('正しい形式のカードIDmの場合はtrueを返すべきです', () => {
    const input = '1A34567890123456';
    expect(validateCardIDm(input)).toEqual(input);
  });

  it('16桁でないカードIDmの場合はエラーをスローするべきです', () => {
    const input = '1A3456789012';
    expect(() => validateCardIDm(input)).toThrow();
  });

  it('数字と大文字アルファベット以外が含まれるカードIDmの場合はエラーをスローするべきです', () => {
    const input = '1A34-6789012345';
    expect(() => validateCardIDm(input)).toThrow();
  });
});
