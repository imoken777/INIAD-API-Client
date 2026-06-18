/// <reference types="jest" />

import type { LockerInfo, RoomStatus } from '../src/index';
import { EduIotApiClient } from '../src/index';
import type { LockerApiResponse, RoomApiResponse } from '../src/types/internal';
import { dummyStatusInfo } from '../src/utils';

const mockFetch = jest.fn();

Object.defineProperty(globalThis, 'fetch', {
  writable: true,
  value: mockFetch,
});

beforeEach(() => {
  jest.clearAllMocks();
});

const mockLockerInfo: LockerApiResponse = {
  name: '32XXXX',
  floor: 3,
};

describe('EduIotApiClient', () => {
  describe('getLockerInfo', () => {
    it('locker infoの取得に成功した場合はLockerInfoを返すべきです', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: jest.fn().mockResolvedValue(JSON.stringify(mockLockerInfo)),
      });
      const client = new EduIotApiClient('user', 'password', 'https://localhost');
      const result = await client.getLockerInfo();

      const expectedLockerInfo: LockerInfo = {
        status: 'success',
        description: 'Succeeded getting locker information',
        lockerAddress: '32XXXX',
        lockerFloor: 3,
      };

      expect(result).toEqual(expectedLockerInfo);
      expect(mockFetch).toHaveBeenCalledWith('https://localhost/api/v1/locker', {
        headers: {
          Authorization: expect.stringMatching(/^Basic /),
        },
      });
    });

    it('locker infoの取得に503で失敗した場合はダミーを返すべきです', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 503,
        statusText: 'Service Unavailable',
      });
      const client = new EduIotApiClient('user', 'password', 'https://localhost');
      const result = await client.getLockerInfo();

      const expectedLockerInfo: LockerInfo = {
        ...dummyStatusInfo,
        lockerAddress: '32XXXX',
        lockerFloor: 3,
      };

      expect(result).toEqual(expectedLockerInfo);
    });

    it('locker infoの取得に失敗した場合はエラーをスローするべきです', async () => {
      const client = new EduIotApiClient('user', 'password', 'https://localhost');
      mockFetch.mockRejectedValue(new Error('Failed to get locker info'));
      const result = client.getLockerInfo();

      await expect(result).rejects.toThrow('Failed to get locker info');
    });
  });

  describe('openLocker', () => {
    it('lockerの開錠に成功した場合はLockerInfoを返すべきです', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: jest.fn().mockResolvedValue(JSON.stringify(mockLockerInfo)),
      });
      const client = new EduIotApiClient('user', 'password', 'https://localhost');
      const result = await client.openLocker();

      const expectedLockerInfo: LockerInfo = {
        status: 'success',
        description: 'Succeeded opening locker',
        lockerAddress: '32XXXX',
        lockerFloor: 3,
      };

      expect(result).toEqual(expectedLockerInfo);
      expect(mockFetch).toHaveBeenCalledWith('https://localhost/api/v1/locker/open', {
        method: 'POST',
        headers: {
          Authorization: expect.stringMatching(/^Basic /),
        },
      });
    });

    it('lockerの開錠に503で失敗した場合はダミーを返すべきです', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 503,
        statusText: 'Service Unavailable',
      });
      const client = new EduIotApiClient('user', 'password', 'https://localhost');
      const result = await client.openLocker();

      const expectedLockerInfo: LockerInfo = {
        ...dummyStatusInfo,
        lockerAddress: '32XXXX',
        lockerFloor: 3,
      };

      expect(result).toEqual(expectedLockerInfo);
    });

    it('lockerの開錠に失敗した場合はエラーをスローするべきです', async () => {
      mockFetch.mockRejectedValue(new Error('Failed to open locker'));
      const client = new EduIotApiClient('user', 'password', 'https://localhost');
      const result = client.openLocker();

      await expect(result).rejects.toThrow('Failed to open locker');
    });
  });

  describe('getAllICCardsInfo', () => {
    it('ic card infoの取得に成功した場合はAllICCardInfoを返すべきです', async () => {
      const mockAllICCardInfo = [
        { id: 1, uid: '1234567890123456', comment: 'test1' },
        { id: 2, uid: '1234567890123457', comment: 'test2' },
      ];
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: jest.fn().mockResolvedValue(JSON.stringify(mockAllICCardInfo)),
      });
      const client = new EduIotApiClient('user', 'password', 'https://localhost');
      const result = await client.getAllICCardsInfo();

      const expectedAllICCardsInfo = {
        status: 'success',
        description: 'Succeeded getting all IC card information',
        cards: [
          { cardIDm: '1234567890123456', icCardComment: 'test1' },
          { cardIDm: '1234567890123457', icCardComment: 'test2' },
        ],
      };

      expect(result).toEqual(expectedAllICCardsInfo);
      expect(mockFetch).toHaveBeenCalledWith('https://localhost/api/v1/iccards', {
        headers: {
          Authorization: expect.stringMatching(/^Basic /),
        },
      });
    });

    it('ic card infoの取得に503で失敗した場合はダミーを返すべきです', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 503,
        statusText: 'Service Unavailable',
      });
      const client = new EduIotApiClient('user', 'password', 'https://localhost');
      const result = await client.getAllICCardsInfo();

      const expectedAllICCardsInfo = {
        ...dummyStatusInfo,
        cards: [{ cardIDm: 'XXXXXXXXXXXXXXXX', icCardComment: 'dummy comment' }],
      };

      expect(result).toEqual(expectedAllICCardsInfo);
    });

    it('ic card infoの取得に失敗した場合はエラーをスローするべきです', async () => {
      mockFetch.mockRejectedValue(new Error('Failed to get all IC card info'));
      const client = new EduIotApiClient('user', 'password', 'https://localhost');
      const result = client.getAllICCardsInfo();

      await expect(result).rejects.toThrow('Failed to get all IC card info');
    });
  });
  describe('registerICCard', () => {
    it('ic cardの登録に成功した場合はICCardInfoを返すべきです', async () => {
      const mockICCardInfo = {
        status: 'success',
        description: 'Succeeded registering IC card',
        uid: '1234567890123456',
        comment: 'test1',
      };
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: jest.fn().mockResolvedValue(JSON.stringify(mockICCardInfo)),
      });
      const client = new EduIotApiClient('user', 'password', 'https://localhost');
      const result = await client.registerICCard('1234567890123456', 'test1');

      const expectedICCardInfo = {
        status: 'success',
        description: 'Succeeded registering IC card',
        cardIDm: '1234567890123456',
        icCardComment: 'test1',
      };

      expect(result).toEqual(expectedICCardInfo);
      expect(mockFetch).toHaveBeenCalledWith('https://localhost/api/v1/iccards', {
        method: 'POST',
        body: 'uid=1234567890123456&comment=test1',
        headers: {
          Authorization: expect.stringMatching(/^Basic /),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
    });

    it('ic cardの登録に503で失敗した場合はダミーを返すべきです', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 503,
        statusText: 'Service Unavailable',
      });
      const client = new EduIotApiClient('user', 'password', 'https://localhost');
      const result = await client.registerICCard('1234567890123456', 'test1');

      const expectedICCardInfo = {
        ...dummyStatusInfo,
        cardIDm: 'XXXXXXXXXXXXXXXX',
        icCardComment: 'dummy comment',
      };

      expect(result).toEqual(expectedICCardInfo);
    });

    it('ic cardの登録に失敗した場合はエラーをスローするべきです', async () => {
      mockFetch.mockRejectedValue(new Error('Failed to register IC card'));
      const client = new EduIotApiClient('user', 'password', 'https://localhost');
      const result = client.registerICCard('1234567890123456', 'test1');

      await expect(result).rejects.toThrow('Failed to register IC card');
    });
  });

  describe('deleteICCard', () => {
    it('ic cardの削除に成功した場合はStatusInfoを返すべきです', async () => {
      const mockMessage = { message: 'ICCard No.1 was deleted' };
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: jest.fn().mockResolvedValue(JSON.stringify(mockMessage)),
      });
      const client = new EduIotApiClient('user', 'password', 'https://localhost');
      const result = await client.deleteICCard();

      const expectedStatusInfo = {
        status: 'success',
        description: 'Succeeded deleting IC card',
      };

      expect(result).toEqual(expectedStatusInfo);
      expect(mockFetch).toHaveBeenCalledWith('https://localhost/api/v1/iccards/1', {
        method: 'DELETE',
        headers: {
          Authorization: expect.stringMatching(/^Basic /),
        },
      });
    });

    it('ic cardの削除に503で失敗した場合はダミーを返すべきです', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 503,
        statusText: 'Service Unavailable',
      });
      const client = new EduIotApiClient('user', 'password', 'https://localhost');
      const result = await client.deleteICCard();

      const expectedStatusInfo = {
        ...dummyStatusInfo,
      };

      expect(result).toEqual(expectedStatusInfo);
    });

    it('ic cardの削除に失敗した場合はエラーをスローするべきです', async () => {
      mockFetch.mockRejectedValue(new Error('Failed to delete IC card'));
      const client = new EduIotApiClient('user', 'password', 'https://localhost');
      const result = client.deleteICCard();

      await expect(result).rejects.toThrow('Failed to delete IC card');
    });
  });

  describe('getRoomStatus', () => {
    it('room statusの取得に成功した場合はRoomStatusを返すべきです', async () => {
      const sensors = ['temperature', 'humidity', 'illuminance', 'airpressure'];
      const mockRoomStatus: RoomApiResponse = [
        { room_num: 1111, sensor_type: 'temperature', value: 25 },
        { room_num: 1111, sensor_type: 'humidity', value: 50 },
        { room_num: 1111, sensor_type: 'illuminance', value: 500 },
        { room_num: 1111, sensor_type: 'airpressure', value: 1000 },
      ];
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: jest.fn().mockResolvedValue(JSON.stringify(mockRoomStatus)),
      });
      const client = new EduIotApiClient('user', 'password', 'https://localhost');
      const result = await client.getRoomStatus(1);

      const expectedRoomStatus: RoomStatus = {
        status: 'success',
        description: 'Succeeded getting room status',
        roomNumber: 1111,
        temperature: 25,
        humidity: 50,
        illuminance: 500,
        airPressure: 1000,
      };

      expect(result).toEqual(expectedRoomStatus);
      expect(mockFetch).toHaveBeenCalledWith(
        `https://localhost/api/v1/sensors/1?sensor_type=${sensors.join('+')}`,
        {
          headers: {
            Authorization: expect.stringMatching(/^Basic /),
          },
        },
      );
    });

    it('room statusの取得に503で失敗した場合はダミーを返すべきです', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 503,
        statusText: 'Service Unavailable',
      });
      const client = new EduIotApiClient('user', 'password', 'https://localhost');
      const result = await client.getRoomStatus(1);

      const expectedRoomStatus: RoomStatus = {
        ...dummyStatusInfo,
        roomNumber: 1,
        temperature: 30.9,
        humidity: 55.5,
        illuminance: 100,
        airPressure: 1006,
      };

      expect(result).toEqual(expectedRoomStatus);
    });

    it('room statusの取得に失敗した場合はエラーをスローするべきです', async () => {
      mockFetch.mockRejectedValue(new Error('Failed to get room status'));
      const client = new EduIotApiClient('user', 'password', 'https://localhost');
      const result = client.getRoomStatus(1);

      await expect(result).rejects.toThrow('Failed to get room status');
    });
  });
});
