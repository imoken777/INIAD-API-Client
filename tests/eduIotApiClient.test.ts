import type { LockerInfo, RoomStatus } from '../src/index';
import { EduIotApiClient } from '../src/index';
import type { LockerApiResponse, RoomApiResponse } from '../src/types/internal';
import { dummyStatusInfo } from '../src/utils';

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
      mockAxiosInstance.get.mockResolvedValue({ data: mockLockerInfo });
      const client = new EduIotApiClient('user', 'password', 'https://localhost');
      const result = await client.getLockerInfo();

      const expectedLockerInfo: LockerInfo = {
        status: 'success',
        description: 'Succeeded getting locker information',
        lockerAddress: '32XXXX',
        lockerFloor: 3,
      };

      expect(result).toEqual(expectedLockerInfo);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v1/locker');
    });

    it('locker infoの取得に503で失敗した場合はダミーを返すべきです', async () => {
      mockAxiosInstance.get.mockRejectedValue({ response: { status: 503 }, isAxiosError: true });
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
      mockAxiosInstance.get.mockRejectedValue(new Error('Failed to get locker info'));
      const result = client.getLockerInfo();

      await expect(result).rejects.toThrow('Failed to get locker info');
    });
  });

  describe('openLocker', () => {
    it('lockerの開錠に成功した場合はLockerInfoを返すべきです', async () => {
      mockAxiosInstance.post.mockResolvedValue({ data: mockLockerInfo });
      const client = new EduIotApiClient('user', 'password', 'https://localhost');
      const result = await client.openLocker();

      const expectedLockerInfo: LockerInfo = {
        status: 'success',
        description: 'Succeeded opening locker',
        lockerAddress: '32XXXX',
        lockerFloor: 3,
      };

      expect(result).toEqual(expectedLockerInfo);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v1/locker/open', null);
    });

    it('lockerの開錠に503で失敗した場合はダミーを返すべきです', async () => {
      mockAxiosInstance.post.mockRejectedValue({
        response: { status: 503 },
        isAxiosError: true,
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
      mockAxiosInstance.post.mockRejectedValue(new Error('Failed to open locker'));
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
      mockAxiosInstance.get.mockResolvedValue({ data: mockAllICCardInfo });
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
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v1/iccards');
    });

    it('ic card infoの取得に503で失敗した場合はダミーを返すべきです', async () => {
      mockAxiosInstance.get.mockRejectedValue({ response: { status: 503 }, isAxiosError: true });
      const client = new EduIotApiClient('user', 'password', 'https://localhost');
      const result = await client.getAllICCardsInfo();

      const expectedAllICCardsInfo = {
        ...dummyStatusInfo,
        cards: [{ cardIDm: 'XXXXXXXXXXXXXXXX', icCardComment: 'dummy comment' }],
      };

      expect(result).toEqual(expectedAllICCardsInfo);
    });

    it('ic card infoの取得に失敗した場合はエラーをスローするべきです', async () => {
      mockAxiosInstance.get.mockRejectedValue(new Error('Failed to get all IC card info'));
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
      mockAxiosInstance.post.mockResolvedValue({ data: mockICCardInfo });
      const client = new EduIotApiClient('user', 'password', 'https://localhost');
      const result = await client.registerICCard('1234567890123456', 'test1');

      const expectedICCardInfo = {
        status: 'success',
        description: 'Succeeded registering IC card',
        cardIDm: '1234567890123456',
        icCardComment: 'test1',
      };

      expect(result).toEqual(expectedICCardInfo);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/api/v1/iccards',
        expect.any(URLSearchParams),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
    });

    it('ic cardの登録に503で失敗した場合はダミーを返すべきです', async () => {
      mockAxiosInstance.post.mockRejectedValue({ response: { status: 503 }, isAxiosError: true });
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
      mockAxiosInstance.post.mockRejectedValue(new Error('Failed to register IC card'));
      const client = new EduIotApiClient('user', 'password', 'https://localhost');
      const result = client.registerICCard('1234567890123456', 'test1');

      await expect(result).rejects.toThrow('Failed to register IC card');
    });
  });

  describe('deleteICCard', () => {
    it('ic cardの削除に成功した場合はStatusInfoを返すべきです', async () => {
      const mockMessage = { message: 'ICCard No.1 was deleted' };
      mockAxiosInstance.delete.mockResolvedValue({ data: mockMessage });
      const client = new EduIotApiClient('user', 'password', 'https://localhost');
      const result = await client.deleteICCard();

      const expectedStatusInfo = {
        status: 'success',
        description: 'Succeeded deleting IC card',
      };

      expect(result).toEqual(expectedStatusInfo);
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/api/v1/iccards/1');
    });

    it('ic cardの削除に503で失敗した場合はダミーを返すべきです', async () => {
      mockAxiosInstance.delete.mockRejectedValue({ response: { status: 503 }, isAxiosError: true });
      const client = new EduIotApiClient('user', 'password', 'https://localhost');
      const result = await client.deleteICCard();

      const expectedStatusInfo = {
        ...dummyStatusInfo,
      };

      expect(result).toEqual(expectedStatusInfo);
    });

    it('ic cardの削除に失敗した場合はエラーをスローするべきです', async () => {
      mockAxiosInstance.delete.mockRejectedValue(new Error('Failed to delete IC card'));
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
      mockAxiosInstance.get.mockResolvedValue({ data: mockRoomStatus });
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
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        `/api/v1/sensors/1?sensor_type=${sensors.join('+')}`,
      );
    });

    it('room statusの取得に503で失敗した場合はダミーを返すべきです', async () => {
      mockAxiosInstance.get.mockRejectedValue({ response: { status: 503 }, isAxiosError: true });
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
      mockAxiosInstance.get.mockRejectedValue(new Error('Failed to get room status'));
      const client = new EduIotApiClient('user', 'password', 'https://localhost');
      const result = client.getRoomStatus(1);

      await expect(result).rejects.toThrow('Failed to get room status');
    });
  });
});
