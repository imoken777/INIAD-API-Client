import axios from 'axios';
import { signageApiClient } from '../src';
import type {
  AllCardSignageLinks,
  AllCardSignageLinksApiResponse,
  CardSignageLink,
  CardSignageLinkApiResponse,
  DeleteCardSignageLinkApiResponse,
} from '../src/types';

jest.mock('axios', () => ({
  get: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
}));

const mockCardSignageLink: CardSignageLinkApiResponse = {
  idm: '1234567890123456',
  url: 'https://example.com',
  display_seconds: 10,
};

describe('signageApiClient', () => {
  describe('getContentByCardIDm', () => {
    it('カードIDmに紐づくサイネージで表示するコンテンツを返すべきです', async () => {
      (axios.get as jest.Mock).mockResolvedValue({ data: mockCardSignageLink });
      const client = new signageApiClient('http://localhost', 'user', 'password');
      const result = await client.getContentByCardIDm('1234567890123456');

      const expectedCardSignageLink: CardSignageLink = {
        status: 'success',
        description: 'Succeeded getting content by cardIDm',
        cardIDm: '1234567890123456',
        url: 'https://example.com',
        displaySeconds: 10,
      };

      expect(result).toEqual(expectedCardSignageLink);
      expect(axios.get).toHaveBeenCalledWith(
        'http://localhost/api/v1/signage/cards/1234567890123456',
        {
          headers: { Authorization: expect.any(String) },
        },
      );
    });

    it('取得に失敗した場合はエラーをスローするべきです', async () => {
      (axios.get as jest.Mock).mockRejectedValue(new Error('Failed to get content by cardIDm'));
      const client = new signageApiClient('http://localhost', 'user', 'password');
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
      (axios.get as jest.Mock).mockResolvedValue({ data: mockResponse });
      const client = new signageApiClient('http://localhost', 'user', 'password');
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
      expect(axios.get).toHaveBeenCalledWith('http://localhost/api/v1/signage/cards', {
        headers: { Authorization: expect.any(String) },
      });
    });

    it('取得に失敗した場合はエラーをスローするべきです', async () => {
      (axios.get as jest.Mock).mockRejectedValue(
        new Error('Failed to get all cardIDm and content list'),
      );
      const client = new signageApiClient('http://localhost', 'user', 'password');
      const result = client.getAllCardIDmAndContentList();

      await expect(result).rejects.toThrow('Failed to get all cardIDm and content list');
    });
  });

  describe('upsertContentByCardIDm', () => {
    it('カードIDmにコンテンツを登録することに成功した場合はCardSignageLinkを返すべきです', async () => {
      (axios.put as jest.Mock).mockResolvedValue({ data: mockCardSignageLink });
      const client = new signageApiClient('http://localhost', 'user', 'password');
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
      expect(axios.put).toHaveBeenCalledWith(
        'http://localhost/api/v1/signage/cards/1234567890123456',
        { url: 'https://example.com', display_seconds: 10 },
        { headers: { Authorization: expect.any(String), 'Content-Type': 'application/json' } },
      );
    });

    it('登録に失敗した場合はエラーをスローするべきです', async () => {
      (axios.put as jest.Mock).mockRejectedValue(
        new Error('Failed to register content by cardIDm'),
      );
      const client = new signageApiClient('http://localhost', 'user', 'password');
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

      (axios.delete as jest.Mock).mockResolvedValue({ data: mockResponse });
      const client = new signageApiClient('http://localhost', 'user', 'password');
      const result = await client.deleteContentByCardIDm('1234567890123456');

      const expectedResponse = {
        status: 'success',
        description: 'Content deleted successfully by cardIDm',
        cardIDm: '1234567890123456',
        removeCount: 1,
      };

      expect(result).toEqual(expectedResponse);
      expect(axios.delete).toHaveBeenCalledWith(
        'http://localhost/api/v1/signage/cards/1234567890123456',
        { headers: { Authorization: expect.any(String) } },
      );
    });

    it('削除に失敗した場合はエラーをスローするべきです', async () => {
      (axios.delete as jest.Mock).mockRejectedValue(
        new Error('Failed to delete content by cardIDm'),
      );
      const client = new signageApiClient('http://localhost', 'user', 'password');
      const result = client.deleteContentByCardIDm('1234567890123456');

      await expect(result).rejects.toThrow('Failed to delete content by cardIDm');
    });
  });
});
