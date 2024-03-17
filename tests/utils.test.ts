import type { AxiosResponse, AxiosResponseHeaders } from 'axios';
import { handleErrors, makeBasicAuth } from '../src/utils';

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
    const expectedAuthHeader = `Basic ${btoa(`${userId}:${password}`)}`;

    expect(makeBasicAuth(userId, password)).toEqual(expectedAuthHeader);
  });
});
