/// <reference types="jest" />

import type { AllCardSignageLinks, CardSignageLink } from '../src';
import { SignageApiClient } from '../src';
import type {
  AllCardSignageLinksApiResponse,
  CardSignageLinkApiResponse,
  DeleteCardSignageLinkApiResponse,
} from '../src/types/internal';

const mockFetch = jest.fn();

Object.defineProperty(globalThis, 'fetch', {
  writable: true,
  value: mockFetch,
});

beforeEach(() => {
  jest.clearAllMocks();
});

const mockCardSignageLink: CardSignageLinkApiResponse = {
  idm: '1234567890123456',
  url: 'https://example.com',
  display_seconds: 10,
};

describe('SignageApiClient', () => {
  describe('getContentByCardIDm', () => {
    it('カードIDmに紐づくサイネージで表示するコンテンツを返すべきです', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: jest.fn().mockResolvedValue(JSON.stringify(mockCardSignageLink)),
      });
      const client = new SignageApiClient('user', 'password');
      const result = await client.getContentByCardIDm('1234567890123456');

      const expectedCardSignageLink: CardSignageLink = {
        status: 'success',
        description: 'Succeeded getting content by cardIDm',
        cardIDm: '1234567890123456',
        url: 'https://example.com',
        displaySeconds: 10,
      };

      expect(result).toEqual(expectedCardSignageLink);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://proxy-iniad-signage-api.imoken27.workers.dev/api/v1/signage/cards/1234567890123456',
        {
          headers: {
            Authorization: expect.stringMatching(/^Basic /),
          },
        },
      );
    });

    it('取得に失敗した場合はエラーをスローするべきです', async () => {
      mockFetch.mockRejectedValue(new Error('Failed to get content by cardIDm'));
      const client = new SignageApiClient('user', 'password');
      const result = client.getContentByCardIDm('1234567890123456');

      await expect(result).rejects.toThrow('Failed to get content by cardIDm');
    });
  });

  describe('getAllCardIDmAndContentList', () => {
    it('ログインユーザのカードIDmとサイネージで表示するコンテンツの紐づけの一覧を返すべきです', async () => {
      const mockResponse: AllCardSignageLinksApiResponse = [
        {
          idm: '1234567890123456',
          url: 'https://example.com',
          display_seconds: 10,
        },
      ];
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: jest.fn().mockResolvedValue(JSON.stringify(mockResponse)),
      });
      const client = new SignageApiClient('user', 'password');
      const result = await client.getAllCardIDmAndContentList();

      const expectedResponse: AllCardSignageLinks = {
        status: 'success',
        description: 'Succeeded getting all cardIDm and content list',
        links: [
          {
            cardIDm: '1234567890123456',
            url: 'https://example.com',
            displaySeconds: 10,
          },
        ],
      };

      expect(result).toEqual(expectedResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://proxy-iniad-signage-api.imoken27.workers.dev/api/v1/signage/cards',
        {
          headers: {
            Authorization: expect.stringMatching(/^Basic /),
          },
        },
      );
    });

    it('取得に失敗した場合はエラーをスローするべきです', async () => {
      mockFetch.mockRejectedValue(new Error('Failed to get all cardIDm and content list'));
      const client = new SignageApiClient('user', 'password');
      const result = client.getAllCardIDmAndContentList();

      await expect(result).rejects.toThrow('Failed to get all cardIDm and content list');
    });
  });

  describe('upsertContentByCardIDm', () => {
    it('カードIDmにコンテンツを登録することに成功した場合はCardSignageLinkを返すべきです', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: jest.fn().mockResolvedValue(JSON.stringify(mockCardSignageLink)),
      });
      const client = new SignageApiClient('user', 'password');
      const result = await client.upsertContentByCardIDm(
        '1234567890123456',
        'https://example.com',
        10,
      );

      const expectedCardSignageLink: CardSignageLink = {
        status: 'success',
        description: 'Content registered or updated successfully by cardIDm',
        cardIDm: '1234567890123456',
        url: 'https://example.com',
        displaySeconds: 10,
      };

      expect(result).toEqual(expectedCardSignageLink);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://proxy-iniad-signage-api.imoken27.workers.dev/api/v1/signage/cards/1234567890123456',
        {
          method: 'PUT',
          body: JSON.stringify({ url: 'https://example.com', display_seconds: 10 }),
          headers: {
            Authorization: expect.stringMatching(/^Basic /),
            'Content-Type': 'application/json',
          },
        },
      );
    });

    it('登録に失敗した場合はエラーをスローするべきです', async () => {
      mockFetch.mockRejectedValue(new Error('Failed to register content by cardIDm'));
      const client = new SignageApiClient('user', 'password');
      const result = client.upsertContentByCardIDm('1234567890123456', 'https://example.com', 10);

      await expect(result).rejects.toThrow('Failed to register content by cardIDm');
    });
  });

  describe('deleteContentByCardIDm', () => {
    it('カードIDmに紐づくコンテンツを削除することに成功した場合はDeleteCardSignageLinkを返すべきです', async () => {
      const mockResponse: DeleteCardSignageLinkApiResponse = {
        message: 'ok',
        removed_count: 1,
      };

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: jest.fn().mockResolvedValue(JSON.stringify(mockResponse)),
      });
      const client = new SignageApiClient('user', 'password');
      const result = await client.deleteContentByCardIDm('1234567890123456');

      const expectedResponse = {
        status: 'success',
        description: 'Content deleted successfully by cardIDm',
        cardIDm: '1234567890123456',
        removeCount: 1,
      };

      expect(result).toEqual(expectedResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://proxy-iniad-signage-api.imoken27.workers.dev/api/v1/signage/cards/1234567890123456',
        {
          method: 'DELETE',
          headers: {
            Authorization: expect.stringMatching(/^Basic /),
          },
        },
      );
    });

    it('削除に失敗した場合はエラーをスローするべきです', async () => {
      mockFetch.mockRejectedValue(new Error('Failed to delete content by cardIDm'));
      const client = new SignageApiClient('user', 'password');
      const result = client.deleteContentByCardIDm('1234567890123456');

      await expect(result).rejects.toThrow('Failed to delete content by cardIDm');
    });
  });
});
