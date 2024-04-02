import { EduIotApiClient } from '../src/index';
import type { LockerApiResponse, LockerInfo, RoomApiResponse, RoomStatus } from '../src/types';
import { dummyDescription } from '../src/utils';

const mockAxiosInstance = {
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
};

// `axios.create()` の挙動をモック化して、上記のモックインスタンスを返すように設定
jest.mock('axios', () => ({
  create: jest.fn(() => mockAxiosInstance),
  isAxiosError: jest.fn((error) => Boolean(error?.isAxiosError)),
}));

const mockLockerInfo: LockerApiResponse = {
  status: 'success',
  description: 'Succeeded',
  name: '32XXXX',
  floor: 3,
};

describe('EduIotApiClient', () => {
  describe('getLockerInfo', () => {
    it('locker infoの取得に成功した場合はLockerInfoを返すべきです', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: mockLockerInfo });
      const client = new EduIotApiClient('http://localhost', 'user', 'password');
      const result = await client.getLockerInfo();

      const expectedLockerInfo: LockerInfo = {
        status: 'success',
        description: 'Succeeded getting locker information',
        lockerAddress: '32XXXX',
        lockerFloor: 3,
      };

      expect(result).toEqual(expectedLockerInfo);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/locker');
    });

    it('locker infoの取得に503で失敗した場合はダミーを返すべきです', async () => {
      mockAxiosInstance.get.mockRejectedValue({ response: { status: 503 }, isAxiosError: true });
      const client = new EduIotApiClient('http://localhost', 'user', 'password');
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
      const client = new EduIotApiClient('http://localhost', 'user', 'password');
      mockAxiosInstance.get.mockRejectedValue(new Error('Failed to get locker info'));
      const result = client.getLockerInfo();

      await expect(result).rejects.toThrow('Failed to get locker info');
    });
  });

  describe('openLocker', () => {
    it('lockerの開錠に成功した場合はLockerInfoを返すべきです', async () => {
      mockAxiosInstance.post.mockResolvedValue({ data: mockLockerInfo });
      const client = new EduIotApiClient('http://localhost', 'user', 'password');
      const result = await client.openLocker();

      const expectedLockerInfo: LockerInfo = {
        status: 'success',
        description: 'Succeeded opening locker',
        lockerAddress: '32XXXX',
        lockerFloor: 3,
      };

      expect(result).toEqual(expectedLockerInfo);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/locker/open', null);
    });

    it('lockerの開錠に503で失敗した場合はダミーを返すべきです', async () => {
      mockAxiosInstance.post.mockRejectedValue({
        response: { status: 503 },
        isAxiosError: true,
      });
      const client = new EduIotApiClient('http://localhost', 'user', 'password');
      const result = await client.openLocker();

      const expectedLockerInfo: LockerInfo = {
        status: 'dummy',
        description: dummyDescription,
        lockerAddress: '32XXXX',
        lockerFloor: 3,
      };

      expect(result).toEqual(expectedLockerInfo);
    });

    it('lockerの開錠に失敗した場合はエラーをスローするべきです', async () => {
      mockAxiosInstance.post.mockRejectedValue(new Error('Failed to open locker'));
      const client = new EduIotApiClient('http://localhost', 'user', 'password');
      const result = client.openLocker();

      await expect(result).rejects.toThrow('Failed to open locker');
    });
  });

  //TODO
  describe('getICCardInfo', () => {});
  describe('registerICCard', () => {});
  describe('deleteICCard', () => {});

  describe('getRoomStatus', () => {
    it('room statusの取得に成功した場合はRoomStatusを返すべきです', async () => {
      const sensors = ['temperature', 'humidity', 'illuminance', 'airpressure'];
      const mockRoomStatus: RoomApiResponse = [
        { roomNumber: 1111, sensorType: 'temperature', value: 25 },
        { roomNumber: 1111, sensorType: 'humidity', value: 50 },
        { roomNumber: 1111, sensorType: 'illuminance', value: 500 },
        { roomNumber: 1111, sensorType: 'airpressure', value: 1000 },
      ];
      mockAxiosInstance.get.mockResolvedValue({ data: mockRoomStatus });
      const client = new EduIotApiClient('http://localhost', 'user', 'password');
      const result = await client.getRoomStatus(1);

      const expectedRoomStatus: RoomStatus = {
        status: 'success',
        description: 'Succeeded getting room status',
        temperature: 25,
        humidity: 50,
        illuminance: 500,
        airPressure: 1000,
      };

      expect(result).toEqual(expectedRoomStatus);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        `/sensors/1?sensor_type=${sensors.join('+')}`,
      );
    });

    it('room statusの取得に503で失敗した場合はダミーを返すべきです', async () => {
      mockAxiosInstance.get.mockRejectedValue({ response: { status: 503 }, isAxiosError: true });
      const client = new EduIotApiClient('http://localhost', 'user', 'password');
      const result = await client.getRoomStatus(1);

      const expectedRoomStatus: RoomStatus = {
        status: 'dummy',
        description: dummyDescription,
        temperature: 30.9,
        humidity: 55.5,
        illuminance: 100,
        airPressure: 1006,
      };

      expect(result).toEqual(expectedRoomStatus);
    });

    it('room statusの取得に失敗した場合はエラーをスローするべきです', async () => {
      mockAxiosInstance.get.mockRejectedValue(new Error('Failed to get room status'));
      const client = new EduIotApiClient('http://localhost', 'user', 'password');
      const result = client.getRoomStatus(1);

      await expect(result).rejects.toThrow('Failed to get room status');
    });
  });
});
