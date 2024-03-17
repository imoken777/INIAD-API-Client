import { eduIotApiClient } from '../src/index';
import axios from 'axios';
import type { LockerApiResponse, LockerInfo } from '../src/types';
import { dummyDescription } from '../src/utils';

jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  isAxiosError: jest.fn((error) => Boolean(error?.isAxiosError)),
}));

const mockLockerInfo: LockerApiResponse = {
  status: 'success',
  description: 'Succeeded getting locker information',
  name: '32XXXX',
  floor: 3,
};

describe('eduIotApiClient', () => {
  describe('getLockerInfo', () => {
    it('locker infoの取得に成功した場合はLockerInfoを返すべきです', async () => {
      (axios.get as jest.Mock).mockResolvedValue({ data: mockLockerInfo });
      const client = new eduIotApiClient('http://localhost', 'user', 'password');
      const result = await client.getLockerInfo();

      const expectedLockerInfo: LockerInfo = {
        status: 'success',
        description: 'Succeeded getting locker information',
        lockerAddress: '32XXXX',
        lockerFloor: 3,
      };

      expect(result).toEqual(expectedLockerInfo);
      expect(axios.get).toHaveBeenCalledWith('http://localhost/locker', {
        headers: { Authorization: expect.any(String) },
      });
    });

    it('locker infoの取得に503で失敗した場合はダミーを返すべきです', async () => {
      (axios.get as jest.Mock).mockRejectedValue({ response: { status: 503 }, isAxiosError: true });
      const client = new eduIotApiClient('http://localhost', 'user', 'password');
      const result = await client.getLockerInfo();

      const expectedLockerInfo: LockerInfo = {
        status: 'dummy',
        description: dummyDescription,
        lockerAddress: '32XXXX',
        lockerFloor: 3,
      };

      expect(result).toEqual(expectedLockerInfo);
    });

    it('locker infoの取得に失敗した場合はエラーをスローするべきです', async () => {
      const client = new eduIotApiClient('http://localhost', 'user', 'password');
      (axios.get as jest.Mock).mockRejectedValue(new Error('Failed to get locker info'));

      await expect(client.getLockerInfo()).rejects.toThrow('Failed to get locker info');
    });
  });
});
