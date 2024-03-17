import axios from 'axios';
import type {
  AllCardSignageLinks,
  AllCardSignageLinksApiResponse,
  CardSignageLink,
  ICCardInfo,
  LockerApiResponse,
  LockerInfo,
  RoomApiResponse,
  RoomStatus,
} from './types';
import { parseToLockerInfo, parseToRoomStatus, parseToAllCardSignageLinks } from './parser';
import { dummyDescription, handleErrors, makeBasicAuth } from './utils';

export class eduIotApiClient {
  private baseUrl: string;
  private authHeader: string;

  constructor(baseUrl: string, userId: string, password: string) {
    this.baseUrl = baseUrl;
    this.authHeader = makeBasicAuth(userId, password);
  }

  public async getLockerInfo(): Promise<LockerInfo> {
    const headers = { Authorization: this.authHeader };
    const requestUrl = `${this.baseUrl}/locker`;

    try {
      const response = await axios.get<LockerApiResponse>(requestUrl, {
        headers,
      });
      const responseData = handleErrors<LockerApiResponse>(response);

      return parseToLockerInfo({
        status: 'success',
        description: 'Succeeded getting locker information',
        name: responseData.name,
        floor: responseData.floor,
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 503) {
          return parseToLockerInfo({
            status: 'dummy',
            description: dummyDescription,
            name: '32XXXX',
            floor: 3,
          });
        }
      }
      throw error;
    }
  }

  public async openLocker(): Promise<LockerInfo> {
    const headers = { Authorization: this.authHeader };
    const requestUrl = `${this.baseUrl}/locker/open`;

    try {
      const response = await axios.post<LockerApiResponse>(requestUrl, null, {
        headers,
      });
      const responseData = handleErrors<LockerApiResponse>(response);

      return parseToLockerInfo({
        status: 'success',
        description: 'Succeeded opening locker',
        name: responseData.name,
        floor: responseData.floor,
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 503) {
          return parseToLockerInfo({
            status: 'dummy',
            description: dummyDescription,
            name: '32XXXX',
            floor: 3,
          });
        }
      }
      throw error;
    }
  }

  public async getICCardsInfo(): Promise<ICCardInfo> {
    const headers = { Authorization: this.authHeader };
    const requestUrl = `${this.baseUrl}/iccards`;

    try {
      const response = await axios.get(requestUrl, { headers });
      const responseData = handleErrors(response);

      return {
        status: 'success',
        description: 'Succeeded getting IC card information',
        icCardId: responseData[0].uid,
        icCardComment: responseData[0].comment,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 503) {
          return {
            status: 'dummy',
            description: dummyDescription,
            icCardId: 'XXXXXXXXXXXXXXXX',
            icCardComment: 'dummy comment',
          };
        }
      }
      throw error;
    }
  }

  public async registerICCard(uid: string, comment: string) {
    const headers = {
      Authorization: this.authHeader,
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const requestUrl = `${this.baseUrl}/iccards`;

    try {
      const data = new URLSearchParams();
      data.append('uid', uid);
      data.append('comment', comment);

      const response = await axios.post(requestUrl, data, { headers });
      const responseData = handleErrors(response);

      return {
        status: 'success',
        description: 'Succeeded registering IC card',
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 503) {
          return {
            status: 'dummy',
            description: dummyDescription,
          };
        }
      }
      throw error;
    }
  }

  public async deleteICCard(uid: string, comment: string) {
    const headers = {
      Authorization: this.authHeader,
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const requestUrl = `${this.baseUrl}/iccards/1`;
    try {
      const data = new URLSearchParams();
      data.append('uid', uid);
      data.append('comment', comment);
      const response = await axios.delete(requestUrl, { headers, data });
      const responseData = handleErrors(response);

      return {
        status: 'success',
        description: 'Succeeded deleting IC card',
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 503) {
          return {
            status: 'dummy',
            description: dummyDescription,
          };
        }
      }
      throw error;
    }
  }

  public async getRoomStatus(roomNumber: number): Promise<RoomStatus> {
    const sensors = ['temperature', 'humidity', 'illuminance', 'airpressure'];
    const headers = { Authorization: this.authHeader };
    const requestUrl = `${this.baseUrl}/sensors/${roomNumber}?sensor_type=${sensors.join('+')}`;

    try {
      const response = await axios.get<RoomApiResponse>(requestUrl, {
        headers,
      });
      const responseData = handleErrors<RoomApiResponse>(response);

      return parseToRoomStatus({
        status: 'success',
        description: 'Succeeded getting room status',
        data: responseData.data,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 503) {
          return parseToRoomStatus({
            status: 'dummy',
            description: dummyDescription,
            data: [
              { sensorType: 'temperature', value: 30.9 },
              { sensorType: 'humidity', value: 55.5 },
              { sensorType: 'illuminance', value: 100 },
              { sensorType: 'airPressure', value: 1006 },
            ],
          });
        }
      }
      throw error;
    }
  }
}

export class signageApiClient {
  private baseUrl: string;
  private authHeader: string;

  constructor(baseUrl: string, userId: string, password: string) {
    this.baseUrl = baseUrl;
    this.authHeader = makeBasicAuth(userId, password);
  }

  //カードIDmに紐づくサイネージで表示するコンテンツを返す関数
  public async getContentByCardIdm(cardIdm: number): Promise<CardSignageLink> {
    const headers = { Authorization: this.authHeader };
    const requestUrl = `${this.baseUrl}/api/v1/signage/cards/${cardIdm}`;

    try {
      const response = await axios.get<CardSignageLink>(requestUrl, {
        headers,
      });
      const responseData = handleErrors<CardSignageLink>(response);

      return {
        status: 'success',
        description: 'Succeeded getting content by cardIdm',
        idm: responseData.idm,
        url: responseData.url,
        displaySeconds: responseData.displaySeconds,
      };
    } catch (error) {
      throw error;
    }
  }
  //ログインユーザのカードIDmとサイネージで表示するコンテンツの紐づけの一覧を返す関数
  public async getAllCardIdmAndContentList(): Promise<AllCardSignageLinks> {
    const headers = { Authorization: this.authHeader };
    const requestUrl = `${this.baseUrl}/api/v1/signage/cards`;

    try {
      const response = await axios.get<AllCardSignageLinksApiResponse>(requestUrl, {
        headers,
      });
      const responseData = handleErrors<AllCardSignageLinksApiResponse>(response);

      return parseToAllCardSignageLinks({
        status: 'success',
        description: 'Succeeded getting all cardIdm and content list',
        links: responseData.links,
      });
    } catch (error) {
      throw error;
    }
  }

  public async registerContentByCardIdm(
    cardIdm: number,
    contentUrl: string,
    displaySeconds: number,
  ): Promise<CardSignageLink> {
    const headers = {
      Authorization: this.authHeader,
      'Content-Type': 'application/json',
    };
    const requestUrl = `${this.baseUrl}/api/v1/signage/cards/${cardIdm}`;
    const data = { url: contentUrl, display_seconds: displaySeconds };

    try {
      const response = await axios.put<CardSignageLink>(requestUrl, data, {
        headers,
      });
      const responseData = handleErrors(response);

      return {
        status: 'success',
        description: 'Succeeded registering content by cardIdm',
        idm: responseData.idm,
        url: responseData.url,
        displaySeconds: responseData.displaySeconds,
      };
    } catch (error) {
      throw error;
    }
  }

  public async updateContentByCardIdm(
    cardIdm: number,
    contentUrl: string,
    displaySeconds: number,
  ): Promise<CardSignageLink> {
    const headers = {
      Authorization: this.authHeader,
      'Content-Type': 'application/json',
    };
    const requestUrl = `${this.baseUrl}/api/v1/signage/cards/${cardIdm}`;
    const data = { url: contentUrl, display_seconds: displaySeconds };

    try {
      const response = await axios.patch<CardSignageLink>(requestUrl, data, {
        headers,
      });
      const responseData = handleErrors(response);

      return {
        status: 'success',
        description: 'Succeeded updating content by cardIdm',
        idm: responseData.idm,
        url: responseData.url,
        displaySeconds: responseData.displaySeconds,
      };
    } catch (error) {
      throw error;
    }
  }

  //未実装
  public async deleteContentByCardIdm(cardIdm: number): Promise<void> {
    const headers = { Authorization: this.authHeader };
    const requestUrl = `${this.baseUrl}/api/v1/signage/cards/${cardIdm}`;

    try {
      const response = await axios.delete(requestUrl, { headers });
      const responseData = handleErrors(response);

      return;
    } catch (error) {
      throw error;
    }
  }
}
