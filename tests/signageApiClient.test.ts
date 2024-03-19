import axios from 'axios';
import { signageApiClient } from '../src';
import type { CardSignageLink } from '../src/types';

jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

const mockCardSignageLink: CardSignageLink = {
  status: 'success',
  description: 'Succeeded getting content by cardIDm',
  cardIDm: '1234567890123456',
  url: 'https://example.com',
  displaySeconds: 10,
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
});
