import { SignageApiClient } from '../src';
import type {
  AllCardSignageLinks,
  AllCardSignageLinksApiResponse,
  CardSignageLink,
  CardSignageLinkApiResponse,
  DeleteCardSignageLinkApiResponse,
} from '../src/types';

const mockAxiosInstance = {
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

jest.mock('axios', () => ({
  create: jest.fn(() => mockAxiosInstance),
}));

const mockCardSignageLink: CardSignageLinkApiResponse = {
  idm: '1234567890123456',
  url: 'https://example.com',
  display_seconds: 10,
};

describe('SignageApiClient', () => {
  describe('getContentByCardIDm', () => {
    it('カードIDmに紐づくサイネージで表示するコンテンツを返すべきです', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: mockCardSignageLink });
      const client = new SignageApiClient('http://localhost', 'user', 'password');
      const result = await client.getContentByCardIDm('1234567890123456');

      const expectedCardSignageLink: CardSignageLink = {
        status: 'success',
        description: 'Succeeded getting content by cardIDm',
        cardIDm: '1234567890123456',
        url: 'https://example.com',
        displaySeconds: 10,
      };

      expect(result).toEqual(expectedCardSignageLink);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v1/signage/cards/1234567890123456');
    });

    it('取得に失敗した場合はエラーをスローするべきです', async () => {
      mockAxiosInstance.get.mockRejectedValue(new Error('Failed to get content by cardIDm'));
      const client = new SignageApiClient('http://localhost', 'user', 'password');
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
      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });
      const client = new SignageApiClient('http://localhost', 'user', 'password');
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
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v1/signage/cards');
    });

    it('取得に失敗した場合はエラーをスローするべきです', async () => {
      mockAxiosInstance.get.mockRejectedValue(
        new Error('Failed to get all cardIDm and content list'),
      );
      const client = new SignageApiClient('http://localhost', 'user', 'password');
      const result = client.getAllCardIDmAndContentList();

      await expect(result).rejects.toThrow('Failed to get all cardIDm and content list');
    });
  });

  describe('upsertContentByCardIDm', () => {
    it('カードIDmにコンテンツを登録することに成功した場合はCardSignageLinkを返すべきです', async () => {
      mockAxiosInstance.put.mockResolvedValue({ data: mockCardSignageLink });
      const client = new SignageApiClient('http://localhost', 'user', 'password');
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
      expect(mockAxiosInstance.put).toHaveBeenCalledWith(
        '/api/v1/signage/cards/1234567890123456',
        { url: 'https://example.com', display_seconds: 10 },
        { headers: { 'Content-Type': 'application/json' } },
      );
    });

    it('登録に失敗した場合はエラーをスローするべきです', async () => {
      mockAxiosInstance.put.mockRejectedValue(new Error('Failed to register content by cardIDm'));
      const client = new SignageApiClient('http://localhost', 'user', 'password');
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

      mockAxiosInstance.delete.mockResolvedValue({ data: mockResponse });
      const client = new SignageApiClient('http://localhost', 'user', 'password');
      const result = await client.deleteContentByCardIDm('1234567890123456');

      const expectedResponse = {
        status: 'success',
        description: 'Content deleted successfully by cardIDm',
        cardIDm: '1234567890123456',
        removeCount: 1,
      };

      expect(result).toEqual(expectedResponse);
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(
        '/api/v1/signage/cards/1234567890123456',
      );
    });

    it('削除に失敗した場合はエラーをスローするべきです', async () => {
      mockAxiosInstance.delete.mockRejectedValue(new Error('Failed to delete content by cardIDm'));
      const client = new SignageApiClient('http://localhost', 'user', 'password');
      const result = client.deleteContentByCardIDm('1234567890123456');

      await expect(result).rejects.toThrow('Failed to delete content by cardIDm');
    });
  });
});
